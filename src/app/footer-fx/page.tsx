"use client";

/* -----------------------------------------------------------------------
 * VDTSITES — apechain-identical footer wordmark.
 *
 * This is the real apechain technique, ported from their published JS
 * chunk (with shader source verified line-for-line where appropriate):
 *
 *   1. A GPU Navier–Stokes incompressible fluid solver runs each frame
 *      on a 64×64 velocity grid. Cursor motion splats velocity into the
 *      fluid; the fluid then advects, projects (pressure solve), and
 *      decays naturally — same equations as PavelDoGreat's open-source
 *      reference, same constants as apechain.
 *
 *   2. A second "dye" field (256×256) carries the displacement vector.
 *      The cursor also splats displacement into it; that displacement
 *      flows with the fluid and dissipates over many frames.
 *
 *   3. The wordmark is rendered as a particle system (one point per
 *      sampled lit text pixel). Each particle's vertex shader looks up
 *      the dye texture at the particle's UV and offsets its position
 *      by that amount. That's why the letters appear to flow like ink
 *      rather than snap back like a spring.
 *
 * Tunable constants (set as apechain's defaults; sliders override live):
 *   VELOCITY_DISSIPATION 0.999   (extracted from apechain chunk 6917)
 *   DYE_DISSIPATION      0.989
 *   RADIUS               318e-6
 *   SPLAT_FORCE          20 (used as /30 ≈ 0.667 per splat)
 *   SIM_RESOLUTION       64
 *   DYE_RESOLUTION       512 (we use 256 to save GPU on weaker hardware)
 *   displacementStrength 1
 * --------------------------------------------------------------------- */

import { useEffect, useRef, useState } from "react";
import { Anton } from "next/font/google";

const anton = Anton({ weight: "400", subsets: ["latin"], display: "swap" });

/* =========================== shader sources =========================== */

const VS_QUAD = `#version 300 es
in vec2 a_position;
out vec2 v_position;
void main() {
  v_position = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FS_ADVECT = `#version 300 es
precision highp float;
uniform sampler2D u_v;
uniform sampler2D u_x;
uniform float u_dt;
uniform float u_dissipation;
in vec2 v_position;
out vec4 res;
void main() {
  vec2 size_v = vec2(textureSize(u_v, 0));
  vec2 size_x = vec2(textureSize(u_x, 0));
  vec2 aspect_ratio = vec2(size_x.x / size_x.y, 1.0);
  vec2 vel = texture(u_v, v_position).xy;
  vec2 prev = v_position - u_dt * vel / aspect_ratio;
  res = u_dissipation * texture(u_x, prev);
}
`;

const FS_DIVERGENCE = `#version 300 es
precision highp float;
uniform sampler2D u_v;
in vec2 v_position;
out vec4 res;
void main() {
  vec2 ts = 1.0 / vec2(textureSize(u_v, 0));
  float L = texture(u_v, v_position - vec2(ts.x, 0.0)).x;
  float R = texture(u_v, v_position + vec2(ts.x, 0.0)).x;
  float T = texture(u_v, v_position + vec2(0.0, ts.y)).y;
  float B = texture(u_v, v_position - vec2(0.0, ts.y)).y;
  res = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
}
`;

const FS_JACOBI = `#version 300 es
precision highp float;
uniform sampler2D u_x;   // pressure (previous)
uniform sampler2D u_b;   // divergence
uniform float u_alpha;
uniform float u_beta;
in vec2 v_position;
out vec4 res;
void main() {
  vec2 ts = 1.0 / vec2(textureSize(u_x, 0));
  float L = texture(u_x, v_position - vec2(ts.x, 0.0)).x;
  float R = texture(u_x, v_position + vec2(ts.x, 0.0)).x;
  float T = texture(u_x, v_position + vec2(0.0, ts.y)).x;
  float B = texture(u_x, v_position - vec2(0.0, ts.y)).x;
  float b = texture(u_b, v_position).x;
  res = vec4((L + R + T + B + u_alpha * b) * u_beta, 0.0, 0.0, 1.0);
}
`;

const FS_GRADSUB = `#version 300 es
precision highp float;
uniform sampler2D u_p;
uniform sampler2D u_v;
in vec2 v_position;
out vec4 res;
void main() {
  vec2 ts = 1.0 / vec2(textureSize(u_p, 0));
  float L = texture(u_p, v_position - vec2(ts.x, 0.0)).x;
  float R = texture(u_p, v_position + vec2(ts.x, 0.0)).x;
  float T = texture(u_p, v_position + vec2(0.0, ts.y)).x;
  float B = texture(u_p, v_position - vec2(0.0, ts.y)).x;
  vec2 v = texture(u_v, v_position).xy;
  v -= 0.5 * vec2(R - L, T - B);
  res = vec4(v, 0.0, 1.0);
}
`;

const FS_SPLAT = `#version 300 es
precision highp float;
uniform sampler2D u_x;
uniform vec2 u_point;
uniform vec3 u_value;
uniform float u_radius;
uniform float u_ratio;
in vec2 v_position;
out vec4 res;
void main() {
  vec4 init = texture(u_x, v_position);
  vec2 p = v_position - u_point;
  p.x *= u_ratio;
  vec3 force = exp(-dot(p, p) / u_radius) * u_value;
  res = vec4(init.xyz + force, 1.0);
}
`;

const FS_COPY = `#version 300 es
precision highp float;
uniform sampler2D u_x;
in vec2 v_position;
out vec4 res;
void main() { res = texture(u_x, v_position); }
`;

const VS_PARTICLE = `#version 300 es
in vec2 a_pos;     // base position in [-1, 1]
in vec2 a_uv;      // [0, 1]
uniform sampler2D u_dye;
uniform float u_dispStrength;
uniform float u_pointSize;
out float v_opacity;
void main() {
  vec2 disp = texture(u_dye, a_uv).xy * u_dispStrength;
  gl_Position = vec4(a_pos + disp, 0.0, 1.0);
  gl_PointSize = u_pointSize;
  v_opacity = 1.0;
}
`;

const FS_PARTICLE = `#version 300 es
precision highp float;
in float v_opacity;
uniform vec4 u_color;
out vec4 frag;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  if (d > 0.5) discard;
  float a = smoothstep(0.5, 0.30, d) * v_opacity;
  frag = vec4(u_color.rgb, u_color.a * a);
}
`;

/* =========================== params / defaults ======================== */

type Params = {
  velocityDissipation: number;
  dyeDissipation: number;
  radius: number;
  splatForce: number;
  pressureIterations: number;
  dispStrength: number;
  dt: number;
  pointSize: number;
};

// Tuned defaults (saved 2026-05-19 from VDT footer-fx page after live
// adjustment). Apechain's stock constants are noted in parens for
// reference — restore those by hitting Reset after editing DEFAULTS.
const DEFAULTS: Params = {
  velocityDissipation: 1.0,    // apechain: 0.999
  dyeDissipation: 0.989,       // apechain: 0.989
  radius: 0.00015,             // apechain: 0.000318
  splatForce: 18,              // apechain: 20
  pressureIterations: 25,      // apechain: 20
  dispStrength: 1.0,           // apechain: 1.0
  dt: 0.031,                   // apechain: ~0.016
  pointSize: 2.4,              // apechain n/a
};

/* =========================== WebGL helpers ============================ */

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh);
    gl.deleteShader(sh);
    throw new Error("shader compile: " + log + "\n" + src);
  }
  return sh;
}

function program(gl: WebGL2RenderingContext, vs: string, fs: string) {
  const p = gl.createProgram()!;
  gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, vs));
  gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    throw new Error("link: " + gl.getProgramInfoLog(p));
  }
  return p;
}

type FBO = {
  tex: WebGLTexture;
  fbo: WebGLFramebuffer;
  width: number;
  height: number;
};

function createFBO(
  gl: WebGL2RenderingContext,
  w: number,
  h: number,
  internalFormat: number,
  format: number,
  type: number,
  filter: number,
): FBO {
  const tex = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);
  const fbo = gl.createFramebuffer()!;
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    tex,
    0,
  );
  gl.viewport(0, 0, w, h);
  gl.clear(gl.COLOR_BUFFER_BIT);
  return { tex, fbo, width: w, height: h };
}

type DoubleFBO = { read: FBO; write: FBO; swap: () => void };

function createDoubleFBO(
  gl: WebGL2RenderingContext,
  w: number,
  h: number,
  internalFormat: number,
  format: number,
  type: number,
  filter: number,
): DoubleFBO {
  let a = createFBO(gl, w, h, internalFormat, format, type, filter);
  let b = createFBO(gl, w, h, internalFormat, format, type, filter);
  return {
    get read() {
      return a;
    },
    get write() {
      return b;
    },
    swap() {
      const t = a;
      a = b;
      b = t;
    },
  };
}

/* =========================== particle gen ============================= */

function makeTextCanvas(width: number, height: number) {
  const c = document.createElement("canvas");
  c.width = width;
  c.height = height;
  const ctx = c.getContext("2d")!;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  const word = "VDTSITES";
  const margin = 0.96;
  let fontPx = Math.round(height * 0.95);
  ctx.font = `400 ${fontPx}px "Anton", "Hanken Grotesk", sans-serif`;
  const measured = ctx.measureText(word).width;
  if (measured > width * margin) {
    fontPx = Math.floor(fontPx * ((width * margin) / measured));
    ctx.font = `400 ${fontPx}px "Anton", "Hanken Grotesk", sans-serif`;
  }
  ctx.fillText(word, width / 2, height * 0.92);
  return c;
}

function particlesFromTextCanvas(c: HTMLCanvasElement, sampling: number) {
  const ctx = c.getContext("2d")!;
  const w = c.width;
  const h = c.height;
  const data = ctx.getImageData(0, 0, w, h).data;
  const positions: number[] = [];
  const uvs: number[] = [];
  for (let y = 0; y < h; y += sampling) {
    for (let x = 0; x < w; x += sampling) {
      const a = data[(y * w + x) * 4 + 3];
      if (a > 128) {
        const nx = (x / w) * 2 - 1;
        const ny = -((y / h) * 2 - 1);
        positions.push(nx, ny);
        uvs.push(x / w, 1 - y / h);
      }
    }
  }
  return {
    positions: new Float32Array(positions),
    uvs: new Float32Array(uvs),
    count: positions.length / 2,
  };
}

/* =========================== UI ====================================== */

function Slider({
  label,
  value,
  min,
  max,
  step,
  fmt = (v: number) => v.toFixed(3),
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  fmt?: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block mb-1.5">
      <div className="flex justify-between items-baseline">
        <span className="text-[10px] tracking-wide text-white/75 truncate">
          {label}
        </span>
        <span className="font-mono text-[9px] text-white/50 ml-2 shrink-0">
          {fmt(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-white/90 h-1"
      />
    </label>
  );
}

function ControlPanel({
  params,
  setP,
  reset,
}: {
  params: Params;
  setP: <K extends keyof Params>(k: K, v: Params[K]) => void;
  reset: () => void;
}) {
  const [open, setOpen] = useState(true);
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-3 right-3 z-50 text-[10px] tracking-[0.2em] uppercase px-3 py-2 rounded-md text-white font-sans"
        style={{
          background: "rgba(8,14,32,0.92)",
          border: "1px solid rgba(255,255,255,0.16)",
        }}
      >
        Show controls
      </button>
    );
  }
  return (
    <aside
      className="fixed bottom-0 left-0 right-0 z-50 w-full px-4 py-3 text-white font-sans backdrop-blur-md max-h-[60vh] overflow-y-auto"
      style={{
        background: "rgba(8,14,32,0.94)",
        borderTop: "1px solid rgba(255,255,255,0.10)",
        boxShadow: "0 -10px 30px rgba(0,0,0,0.5)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[11px] tracking-[0.28em] uppercase">
          Controls — apechain fluid sim
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={reset}
            className="text-[10px] tracking-[0.18em] uppercase px-2 py-1 rounded border border-white/20 hover:bg-white/10 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={() => setOpen(false)}
            className="text-[10px] tracking-[0.18em] uppercase px-2 py-1 rounded border border-white/20 hover:bg-white/10 transition-colors"
          >
            Hide
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-3">
        <div className="min-w-0">
          <p className="text-[10px] tracking-[0.22em] uppercase text-white/55 mb-2.5">
            Fluid dynamics
          </p>
          <Slider
            label="Velocity dissipation"
            value={params.velocityDissipation}
            min={0.9}
            max={1.0}
            step={0.0005}
            fmt={(v) => v.toFixed(4)}
            onChange={(v) => setP("velocityDissipation", v)}
          />
          <Slider
            label="Dye dissipation"
            value={params.dyeDissipation}
            min={0.85}
            max={1.0}
            step={0.001}
            fmt={(v) => v.toFixed(3)}
            onChange={(v) => setP("dyeDissipation", v)}
          />
          <Slider
            label="Pressure iterations"
            value={params.pressureIterations}
            min={5}
            max={40}
            step={1}
            fmt={(v) => v.toFixed(0)}
            onChange={(v) => setP("pressureIterations", v)}
          />
          <Slider
            label="Time step"
            value={params.dt}
            min={0.005}
            max={0.1}
            step={0.001}
            fmt={(v) => v.toFixed(3)}
            onChange={(v) => setP("dt", v)}
          />
        </div>

        <div className="min-w-0">
          <p className="text-[10px] tracking-[0.22em] uppercase text-white/55 mb-2.5">
            Cursor splat
          </p>
          <Slider
            label="Splat radius"
            value={params.radius}
            min={0.00005}
            max={0.005}
            step={0.00005}
            fmt={(v) => v.toExponential(2)}
            onChange={(v) => setP("radius", v)}
          />
          <Slider
            label="Splat force"
            value={params.splatForce}
            min={1}
            max={80}
            step={1}
            fmt={(v) => v.toFixed(0)}
            onChange={(v) => setP("splatForce", v)}
          />
        </div>

        <div className="min-w-0">
          <p className="text-[10px] tracking-[0.22em] uppercase text-white/55 mb-2.5">
            Wordmark
          </p>
          <Slider
            label="Displacement strength"
            value={params.dispStrength}
            min={0}
            max={4}
            step={0.05}
            fmt={(v) => v.toFixed(2)}
            onChange={(v) => setP("dispStrength", v)}
          />
          <Slider
            label="Particle size"
            value={params.pointSize}
            min={0.5}
            max={6}
            step={0.1}
            fmt={(v) => v.toFixed(1)}
            onChange={(v) => setP("pointSize", v)}
          />
        </div>

        <div className="min-w-0">
          <p className="text-[10px] tracking-[0.22em] uppercase text-white/55 mb-2.5">
            About
          </p>
          <p className="text-[10px] leading-relaxed text-white/55">
            Real Navier-Stokes fluid sim, same shaders & constants
            apechain.com uses. Cursor splats velocity + dye into the
            fluid; particles read the dye texture for displacement.
          </p>
        </div>
      </div>
    </aside>
  );
}

/* =========================== component ================================ */

export default function VdtSitesFluid() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [params, setParams] = useState<Params>(DEFAULTS);
  const paramsRef = useRef(params);
  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  function setP<K extends keyof Params>(key: K, value: Params[K]) {
    setParams((p) => ({ ...p, [key]: value }));
  }

  // Mobile / accessibility detection. Tracked in state so we can pick
  // a static fallback for reduce-motion users and pass mobile flags to
  // the WebGL effect for quality + framerate scaling.
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // The global stylesheet paints <html> cream; for this page we want
  // dark navy edge-to-edge so the canvas blends with the page.
  useEffect(() => {
    const prev = document.documentElement.style.background;
    document.documentElement.style.background = "#050B1F";
    return () => {
      document.documentElement.style.background = prev;
    };
  }, []);

  useEffect(() => {
    // Reduce-motion users get a static rendered wordmark via React (see
    // render block at bottom) — we skip the entire WebGL/fluid path.
    if (reduced) return;

    const canvas = canvasRef.current!;
    const wrap = wrapRef.current!;
    const gl = canvas.getContext("webgl2", {
      premultipliedAlpha: false,
      antialias: false,
      alpha: false,
    });
    if (!gl) {
      console.error("WebGL2 required");
      return;
    }

    // Touch / coarse-pointer detection. On mobile we use a smaller sim
    // grid and cap the loop to ~30 fps to keep weaker phones smooth
    // and save battery; the visual result is nearly indistinguishable.
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    // RG16F / R16F render targets need this extension
    const cbf = gl.getExtension("EXT_color_buffer_float");
    if (!cbf) {
      console.error("EXT_color_buffer_float required");
      return;
    }

    /* --- programs --- */
    const pAdvect = program(gl, VS_QUAD, FS_ADVECT);
    const pDiv = program(gl, VS_QUAD, FS_DIVERGENCE);
    const pJacobi = program(gl, VS_QUAD, FS_JACOBI);
    const pGrad = program(gl, VS_QUAD, FS_GRADSUB);
    const pSplat = program(gl, VS_QUAD, FS_SPLAT);
    const pCopy = program(gl, VS_QUAD, FS_COPY);
    const pPart = program(gl, VS_PARTICLE, FS_PARTICLE);

    /* --- fullscreen quad --- */
    const quadBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    function bindQuad(progLoc: number) {
      gl!.bindBuffer(gl!.ARRAY_BUFFER, quadBuf);
      gl!.enableVertexAttribArray(progLoc);
      gl!.vertexAttribPointer(progLoc, 2, gl!.FLOAT, false, 0, 0);
    }

    /* --- sim fields --- */
    // Lower-spec grids on coarse-pointer devices keeps mid-range mobile
    // GPUs comfortably above 30fps without changing the look much.
    const SIM = coarse ? 48 : 64;
    const DYE = coarse ? 160 : 256;
    const RG16F = gl.RG16F;
    const RG = gl.RG;
    const R16F = gl.R16F;
    const RED = gl.RED;
    const HF = gl.HALF_FLOAT;

    const velocity = createDoubleFBO(gl, SIM, SIM, RG16F, RG, HF, gl.LINEAR);
    const pressure = createDoubleFBO(gl, SIM, SIM, R16F, RED, HF, gl.NEAREST);
    const divergence = createFBO(gl, SIM, SIM, R16F, RED, HF, gl.NEAREST);
    const dye = createDoubleFBO(gl, DYE, DYE, RG16F, RG, HF, gl.LINEAR);

    /* --- particles --- */
    let particleData = { positions: new Float32Array(), uvs: new Float32Array(), count: 0 };
    const posBuf = gl.createBuffer();
    const uvBuf = gl.createBuffer();

    function rebuildParticles() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(wrap.clientWidth * dpr));
      const h = Math.max(1, Math.round(wrap.clientHeight * dpr));
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = wrap.clientWidth + "px";
      canvas.style.height = wrap.clientHeight + "px";

      // sample text at a moderate resolution
      const tw = Math.min(1600, Math.round(w * 0.85));
      const th = Math.round(tw * (h / w));
      const tc = makeTextCanvas(tw, th);
      // a denser sampling = more particles. step 2 gives ~1 in 4 lit pixels.
      const sampling = 2;
      particleData = particlesFromTextCanvas(tc, sampling);

      gl!.bindBuffer(gl!.ARRAY_BUFFER, posBuf);
      gl!.bufferData(gl!.ARRAY_BUFFER, particleData.positions, gl!.STATIC_DRAW);
      gl!.bindBuffer(gl!.ARRAY_BUFFER, uvBuf);
      gl!.bufferData(gl!.ARRAY_BUFFER, particleData.uvs, gl!.STATIC_DRAW);
    }
    rebuildParticles();
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.load('400 200px "Anton"').then(() => rebuildParticles());
    }
    const ro = new ResizeObserver(rebuildParticles);
    ro.observe(wrap);

    /* --- helpers --- */
    function blit(target: FBO) {
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, target.fbo);
      gl!.viewport(0, 0, target.width, target.height);
      gl!.drawArrays(gl!.TRIANGLES, 0, 6);
    }

    /* --- cursor state --- */
    let cursorActive = false;
    let cx = 0.5;
    let cy = 0.5;
    let pcx = 0.5;
    let pcy = 0.5;
    let hasPrev = false;

    function setFromEvent(e: PointerEvent) {
      const r = wrap.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      ) {
        cursorActive = false;
        return;
      }
      cursorActive = true;
      cx = (e.clientX - r.left) / r.width;
      cy = 1 - (e.clientY - r.top) / r.height;
    }
    const onMove = (e: PointerEvent) => setFromEvent(e);
    const onLeave = () => {
      cursorActive = false;
      hasPrev = false;
    };
    // On touch devices "pointerleave" is unreliable — a lift doesn't
    // necessarily fire it. Bind release on pointerup / touchend /
    // touchcancel too so the splat state always clears when the
    // finger comes off the screen.
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onLeave, { passive: true });
    window.addEventListener("pointercancel", onLeave, { passive: true });
    window.addEventListener("touchend", onLeave, { passive: true });
    window.addEventListener("touchcancel", onLeave, { passive: true });
    wrap.addEventListener("pointerleave", onLeave);

    /* ---------- sim step ---------- */
    function step(dt: number) {
      const p = paramsRef.current;
      const ratio = canvas.width / canvas.height;

      // --- cursor splat (velocity + dye) ---
      if (cursorActive && hasPrev) {
        const dx = (cx - pcx) * p.splatForce;
        const dy = (cy - pcy) * p.splatForce;
        if (dx !== 0 || dy !== 0) {
          // velocity splat
          gl!.useProgram(pSplat);
          bindQuad(gl!.getAttribLocation(pSplat, "a_position"));
          gl!.activeTexture(gl!.TEXTURE0);
          gl!.bindTexture(gl!.TEXTURE_2D, velocity.read.tex);
          gl!.uniform1i(gl!.getUniformLocation(pSplat, "u_x"), 0);
          gl!.uniform2f(gl!.getUniformLocation(pSplat, "u_point"), cx, cy);
          gl!.uniform3f(gl!.getUniformLocation(pSplat, "u_value"), dx, dy, 0);
          gl!.uniform1f(gl!.getUniformLocation(pSplat, "u_radius"), p.radius);
          gl!.uniform1f(gl!.getUniformLocation(pSplat, "u_ratio"), ratio);
          blit(velocity.write);
          velocity.swap();

          // dye splat (same value carries the displacement)
          gl!.bindTexture(gl!.TEXTURE_2D, dye.read.tex);
          gl!.uniform1i(gl!.getUniformLocation(pSplat, "u_x"), 0);
          gl!.uniform3f(
            gl!.getUniformLocation(pSplat, "u_value"),
            dx * 0.5,
            dy * 0.5,
            0,
          );
          blit(dye.write);
          dye.swap();
        }
      }
      pcx = cx;
      pcy = cy;
      if (cursorActive) hasPrev = true;

      // --- advect velocity ---
      gl!.useProgram(pAdvect);
      bindQuad(gl!.getAttribLocation(pAdvect, "a_position"));
      gl!.activeTexture(gl!.TEXTURE0);
      gl!.bindTexture(gl!.TEXTURE_2D, velocity.read.tex);
      gl!.activeTexture(gl!.TEXTURE1);
      gl!.bindTexture(gl!.TEXTURE_2D, velocity.read.tex);
      gl!.uniform1i(gl!.getUniformLocation(pAdvect, "u_v"), 0);
      gl!.uniform1i(gl!.getUniformLocation(pAdvect, "u_x"), 1);
      gl!.uniform1f(gl!.getUniformLocation(pAdvect, "u_dt"), dt);
      gl!.uniform1f(
        gl!.getUniformLocation(pAdvect, "u_dissipation"),
        p.velocityDissipation,
      );
      blit(velocity.write);
      velocity.swap();

      // --- divergence ---
      gl!.useProgram(pDiv);
      bindQuad(gl!.getAttribLocation(pDiv, "a_position"));
      gl!.activeTexture(gl!.TEXTURE0);
      gl!.bindTexture(gl!.TEXTURE_2D, velocity.read.tex);
      gl!.uniform1i(gl!.getUniformLocation(pDiv, "u_v"), 0);
      blit(divergence);

      // --- clear pressure to zero before iterating ---
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, pressure.read.fbo);
      gl!.viewport(0, 0, pressure.read.width, pressure.read.height);
      gl!.clearColor(0, 0, 0, 1);
      gl!.clear(gl!.COLOR_BUFFER_BIT);

      // --- Jacobi pressure iterations ---
      gl!.useProgram(pJacobi);
      bindQuad(gl!.getAttribLocation(pJacobi, "a_position"));
      const uXJ = gl!.getUniformLocation(pJacobi, "u_x");
      const uBJ = gl!.getUniformLocation(pJacobi, "u_b");
      gl!.uniform1i(uXJ, 0);
      gl!.uniform1i(uBJ, 1);
      gl!.uniform1f(gl!.getUniformLocation(pJacobi, "u_alpha"), -1);
      gl!.uniform1f(gl!.getUniformLocation(pJacobi, "u_beta"), 0.25);
      gl!.activeTexture(gl!.TEXTURE1);
      gl!.bindTexture(gl!.TEXTURE_2D, divergence.tex);
      const iters = Math.round(p.pressureIterations);
      for (let i = 0; i < iters; i++) {
        gl!.activeTexture(gl!.TEXTURE0);
        gl!.bindTexture(gl!.TEXTURE_2D, pressure.read.tex);
        blit(pressure.write);
        pressure.swap();
      }

      // --- gradient subtract ---
      gl!.useProgram(pGrad);
      bindQuad(gl!.getAttribLocation(pGrad, "a_position"));
      gl!.activeTexture(gl!.TEXTURE0);
      gl!.bindTexture(gl!.TEXTURE_2D, pressure.read.tex);
      gl!.activeTexture(gl!.TEXTURE1);
      gl!.bindTexture(gl!.TEXTURE_2D, velocity.read.tex);
      gl!.uniform1i(gl!.getUniformLocation(pGrad, "u_p"), 0);
      gl!.uniform1i(gl!.getUniformLocation(pGrad, "u_v"), 1);
      blit(velocity.write);
      velocity.swap();

      // --- advect dye ---
      gl!.useProgram(pAdvect);
      bindQuad(gl!.getAttribLocation(pAdvect, "a_position"));
      gl!.activeTexture(gl!.TEXTURE0);
      gl!.bindTexture(gl!.TEXTURE_2D, velocity.read.tex);
      gl!.activeTexture(gl!.TEXTURE1);
      gl!.bindTexture(gl!.TEXTURE_2D, dye.read.tex);
      gl!.uniform1i(gl!.getUniformLocation(pAdvect, "u_v"), 0);
      gl!.uniform1i(gl!.getUniformLocation(pAdvect, "u_x"), 1);
      gl!.uniform1f(gl!.getUniformLocation(pAdvect, "u_dt"), dt);
      gl!.uniform1f(
        gl!.getUniformLocation(pAdvect, "u_dissipation"),
        p.dyeDissipation,
      );
      blit(dye.write);
      dye.swap();
    }

    /* ---------- render pass ---------- */
    function render() {
      const p = paramsRef.current;
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
      gl!.viewport(0, 0, canvas.width, canvas.height);
      gl!.clearColor(0.020, 0.043, 0.122, 1);
      gl!.clear(gl!.COLOR_BUFFER_BIT);

      if (!particleData.count) return;

      gl!.useProgram(pPart);
      const aPos = gl!.getAttribLocation(pPart, "a_pos");
      const aUv = gl!.getAttribLocation(pPart, "a_uv");
      gl!.bindBuffer(gl!.ARRAY_BUFFER, posBuf);
      gl!.enableVertexAttribArray(aPos);
      gl!.vertexAttribPointer(aPos, 2, gl!.FLOAT, false, 0, 0);
      gl!.bindBuffer(gl!.ARRAY_BUFFER, uvBuf);
      gl!.enableVertexAttribArray(aUv);
      gl!.vertexAttribPointer(aUv, 2, gl!.FLOAT, false, 0, 0);

      gl!.activeTexture(gl!.TEXTURE0);
      gl!.bindTexture(gl!.TEXTURE_2D, dye.read.tex);
      gl!.uniform1i(gl!.getUniformLocation(pPart, "u_dye"), 0);
      gl!.uniform1f(
        gl!.getUniformLocation(pPart, "u_dispStrength"),
        p.dispStrength,
      );
      gl!.uniform1f(
        gl!.getUniformLocation(pPart, "u_pointSize"),
        p.pointSize *
          (Math.min(window.devicePixelRatio || 1, 2)),
      );
      gl!.uniform4f(gl!.getUniformLocation(pPart, "u_color"), 1, 1, 1, 1);

      gl!.enable(gl!.BLEND);
      gl!.blendFunc(gl!.SRC_ALPHA, gl!.ONE_MINUS_SRC_ALPHA);
      gl!.drawArrays(gl!.POINTS, 0, particleData.count);
    }

    /* ---------- main loop ---------- */
    // Cap at ~30fps on coarse-pointer devices: keeps the sim stable,
    // saves battery, and matches the lower input rate of touch.
    const minMs = coarse ? 33 : 0;
    let raf = 0;
    let lastT = performance.now();
    function frame() {
      raf = requestAnimationFrame(frame);
      const now = performance.now();
      if (now - lastT < minMs) return;
      lastT = now;
      step(paramsRef.current.dt);
      render();
    }
    frame();

    /* ---------- cleanup ---------- */
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onLeave);
      window.removeEventListener("pointercancel", onLeave);
      window.removeEventListener("touchend", onLeave);
      window.removeEventListener("touchcancel", onLeave);
      wrap.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced]);

  return (
    <main
      className={`min-h-screen flex flex-col text-white pb-[360px] sm:pb-[280px] lg:pb-[230px] ${anton.className}`}
      style={{ background: "#050B1F" }}
    >
      <ControlPanel
        params={params}
        setP={setP}
        reset={() => setParams(DEFAULTS)}
      />

      <header className="px-8 py-6 flex items-center justify-between text-[10px] tracking-[0.34em] uppercase opacity-75 font-sans">
        <span>VDT Sites</span>
        <span>Footer FX · fluid sim (apechain port)</span>
      </header>

      <div className="flex-1 flex items-center justify-center px-8 font-sans">
        <div className="max-w-2xl text-center opacity-70 space-y-4">
          <p className="text-[11px] tracking-[0.3em] uppercase">scroll mock</p>
          <p className="text-sm leading-relaxed">
            Real GPU fluid simulation, same shaders and constants
            apechain.com uses. Move your cursor through the wordmark —
            the motion ripples and flows like liquid because it&apos;s a
            real Navier&ndash;Stokes solve running every frame, not a
            spring approximation.
          </p>
        </div>
      </div>

      <section
        className="relative w-full overflow-hidden"
        style={{ background: "#050B1F" }}
      >
        <div
          aria-hidden
          className="absolute left-0 right-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)",
          }}
        />

        <div className="relative z-10 px-8 sm:px-12 pt-14 pb-6 flex flex-col sm:flex-row gap-6 sm:gap-0 sm:justify-between text-[10px] tracking-[0.3em] uppercase font-sans">
          <div className="flex flex-col gap-3 sm:max-w-xs">
            <span className="opacity-100 font-semibold">VDT Sites</span>
            <span className="opacity-70 leading-relaxed normal-case tracking-normal text-[12px]">
              Modern websites for small businesses. The place to build.
            </span>
          </div>
          <ul className="flex flex-wrap gap-x-7 gap-y-3 opacity-80">
            <li>Home</li>
            <li>Work</li>
            <li>Blog</li>
            <li>Contact</li>
            <li>Email</li>
          </ul>
        </div>

        {/* Responsive aspect: a taller band on mobile so the wordmark
            reads at a usable size, transitioning to the wide editorial
            ratio on desktop. */}
        <div
          ref={wrapRef}
          className="relative w-full aspect-[3/2] sm:aspect-[16/9] lg:aspect-[16/8]"
        >
          {reduced ? (
            // Reduce-motion fallback: a static rendered wordmark, same
            // typeface and colour, no fluid sim. Honours prefers-reduced-
            // motion without sacrificing the brand mark.
            <div
              aria-label="VDTSITES"
              className="absolute inset-0 flex items-center justify-center px-6"
            >
              <span
                className="font-black tracking-tight text-white leading-none w-full text-center"
                style={{
                  fontFamily: '"Anton", "Hanken Grotesk", sans-serif',
                  fontSize: "clamp(64px, 22vw, 360px)",
                  letterSpacing: "-0.02em",
                }}
              >
                VDTSITES
              </span>
            </div>
          ) : (
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full block touch-none"
            />
          )}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-1/4 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, transparent 0%, #050B1F 95%)",
            }}
          />
        </div>

        <div className="relative z-10 px-8 sm:px-12 pb-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] tracking-[0.3em] uppercase opacity-70 font-sans">
          <span>© {new Date().getFullYear()} VDT Sites</span>
          <span>Built in BC, Canada</span>
        </div>
      </section>
    </main>
  );
}
