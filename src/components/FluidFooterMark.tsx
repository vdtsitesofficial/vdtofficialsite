"use client";

/* -----------------------------------------------------------------------
 * FluidFooterMark
 *
 * Production-ready slice of the apechain-style fluid wordmark. Same
 * GPU Navier-Stokes solver + particle text as the tuning page at
 * /footer-fx, with the control panel removed and the tuned defaults
 * baked in. Drop this in just above the page footer.
 *
 * Vault: Shared/Fluid Footer Wordmark.md for the full docs.
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
uniform sampler2D u_x;
uniform sampler2D u_b;
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

const VS_PARTICLE = `#version 300 es
in vec2 a_pos;
in vec2 a_uv;
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

/* =========================== tuned defaults =========================== */

// Saved VDT defaults — identical to the tuned state of /footer-fx.
const D = {
  velocityDissipation: 1.0,
  dyeDissipation: 0.989,
  radius: 0.00015,
  splatForce: 18,
  pressureIterations: 25,
  dispStrength: 1.0,
  dt: 0.031,
  pointSize: 2.4,
};

/* =========================== WebGL helpers ============================ */

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh);
    gl.deleteShader(sh);
    throw new Error("shader compile: " + log);
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

/* =========================== text → particles ========================= */

function makeTextCanvas(width: number, height: number, word: string) {
  const c = document.createElement("canvas");
  c.width = width;
  c.height = height;
  const ctx = c.getContext("2d")!;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
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

/* =========================== component ================================ */

type Props = {
  /** Wordmark text. Defaults to "VDTSITES". */
  word?: string;
  /** Band/clear color. Defaults to the deep navy used elsewhere on VDT. */
  background?: string;
};

export default function FluidFooterMark({
  word = "VDTSITES",
  background = "#050B1F",
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Reduce-motion / accessibility: skip the WebGL path and render
  // static text instead. Tracked in state so we react to runtime
  // changes (user toggling the OS preference).
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced) return;

    const canvas = canvasRef.current!;
    const wrap = wrapRef.current!;
    const gl = canvas.getContext("webgl2", {
      premultipliedAlpha: false,
      antialias: false,
      alpha: false,
    });
    if (!gl) return;
    if (!gl.getExtension("EXT_color_buffer_float")) return;

    // Coarse-pointer (touch) gets a lighter sim grid and 30fps cap.
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    const pAdvect = program(gl, VS_QUAD, FS_ADVECT);
    const pDiv = program(gl, VS_QUAD, FS_DIVERGENCE);
    const pJacobi = program(gl, VS_QUAD, FS_JACOBI);
    const pGrad = program(gl, VS_QUAD, FS_GRADSUB);
    const pSplat = program(gl, VS_QUAD, FS_SPLAT);
    const pPart = program(gl, VS_PARTICLE, FS_PARTICLE);

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

    const SIM = coarse ? 48 : 64;
    const DYE = coarse ? 160 : 256;
    const velocity = createDoubleFBO(
      gl, SIM, SIM, gl.RG16F, gl.RG, gl.HALF_FLOAT, gl.LINEAR,
    );
    const pressure = createDoubleFBO(
      gl, SIM, SIM, gl.R16F, gl.RED, gl.HALF_FLOAT, gl.NEAREST,
    );
    const divergence = createFBO(
      gl, SIM, SIM, gl.R16F, gl.RED, gl.HALF_FLOAT, gl.NEAREST,
    );
    const dye = createDoubleFBO(
      gl, DYE, DYE, gl.RG16F, gl.RG, gl.HALF_FLOAT, gl.LINEAR,
    );

    let particleData = {
      positions: new Float32Array(),
      uvs: new Float32Array(),
      count: 0,
    };
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
      const tw = Math.min(1600, Math.round(w * 0.85));
      const th = Math.round(tw * (h / w));
      const tc = makeTextCanvas(tw, th, word);
      particleData = particlesFromTextCanvas(tc, 2);
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

    function blit(target: FBO) {
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, target.fbo);
      gl!.viewport(0, 0, target.width, target.height);
      gl!.drawArrays(gl!.TRIANGLES, 0, 6);
    }

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
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onLeave, { passive: true });
    window.addEventListener("pointercancel", onLeave, { passive: true });
    window.addEventListener("touchend", onLeave, { passive: true });
    window.addEventListener("touchcancel", onLeave, { passive: true });
    wrap.addEventListener("pointerleave", onLeave);

    function step(dt: number) {
      const ratio = canvas.width / canvas.height;

      if (cursorActive && hasPrev) {
        const dx = (cx - pcx) * D.splatForce;
        const dy = (cy - pcy) * D.splatForce;
        if (dx !== 0 || dy !== 0) {
          gl!.useProgram(pSplat);
          bindQuad(gl!.getAttribLocation(pSplat, "a_position"));
          gl!.activeTexture(gl!.TEXTURE0);
          gl!.bindTexture(gl!.TEXTURE_2D, velocity.read.tex);
          gl!.uniform1i(gl!.getUniformLocation(pSplat, "u_x"), 0);
          gl!.uniform2f(gl!.getUniformLocation(pSplat, "u_point"), cx, cy);
          gl!.uniform3f(gl!.getUniformLocation(pSplat, "u_value"), dx, dy, 0);
          gl!.uniform1f(gl!.getUniformLocation(pSplat, "u_radius"), D.radius);
          gl!.uniform1f(gl!.getUniformLocation(pSplat, "u_ratio"), ratio);
          blit(velocity.write);
          velocity.swap();

          gl!.bindTexture(gl!.TEXTURE_2D, dye.read.tex);
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
        D.velocityDissipation,
      );
      blit(velocity.write);
      velocity.swap();

      gl!.useProgram(pDiv);
      bindQuad(gl!.getAttribLocation(pDiv, "a_position"));
      gl!.activeTexture(gl!.TEXTURE0);
      gl!.bindTexture(gl!.TEXTURE_2D, velocity.read.tex);
      gl!.uniform1i(gl!.getUniformLocation(pDiv, "u_v"), 0);
      blit(divergence);

      gl!.bindFramebuffer(gl!.FRAMEBUFFER, pressure.read.fbo);
      gl!.viewport(0, 0, pressure.read.width, pressure.read.height);
      gl!.clearColor(0, 0, 0, 1);
      gl!.clear(gl!.COLOR_BUFFER_BIT);

      gl!.useProgram(pJacobi);
      bindQuad(gl!.getAttribLocation(pJacobi, "a_position"));
      gl!.uniform1i(gl!.getUniformLocation(pJacobi, "u_x"), 0);
      gl!.uniform1i(gl!.getUniformLocation(pJacobi, "u_b"), 1);
      gl!.uniform1f(gl!.getUniformLocation(pJacobi, "u_alpha"), -1);
      gl!.uniform1f(gl!.getUniformLocation(pJacobi, "u_beta"), 0.25);
      gl!.activeTexture(gl!.TEXTURE1);
      gl!.bindTexture(gl!.TEXTURE_2D, divergence.tex);
      for (let i = 0; i < D.pressureIterations; i++) {
        gl!.activeTexture(gl!.TEXTURE0);
        gl!.bindTexture(gl!.TEXTURE_2D, pressure.read.tex);
        blit(pressure.write);
        pressure.swap();
      }

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
        D.dyeDissipation,
      );
      blit(dye.write);
      dye.swap();
    }

    function render() {
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
      gl!.viewport(0, 0, canvas.width, canvas.height);
      // Parse hex bg → clear color so the canvas blends with the page bg
      const c =
        background.startsWith("#") && background.length === 7
          ? [
              parseInt(background.slice(1, 3), 16) / 255,
              parseInt(background.slice(3, 5), 16) / 255,
              parseInt(background.slice(5, 7), 16) / 255,
            ]
          : [0.020, 0.043, 0.122];
      gl!.clearColor(c[0], c[1], c[2], 1);
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
        D.dispStrength,
      );
      gl!.uniform1f(
        gl!.getUniformLocation(pPart, "u_pointSize"),
        D.pointSize * Math.min(window.devicePixelRatio || 1, 2),
      );
      gl!.uniform4f(gl!.getUniformLocation(pPart, "u_color"), 1, 1, 1, 1);
      gl!.enable(gl!.BLEND);
      gl!.blendFunc(gl!.SRC_ALPHA, gl!.ONE_MINUS_SRC_ALPHA);
      gl!.drawArrays(gl!.POINTS, 0, particleData.count);
    }

    const minMs = coarse ? 33 : 0;
    let raf = 0;
    let lastT = performance.now();
    function frame() {
      raf = requestAnimationFrame(frame);
      const now = performance.now();
      if (now - lastT < minMs) return;
      lastT = now;
      step(D.dt);
      render();
    }
    frame();

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
  }, [reduced, word, background]);

  return (
    <div
      className={`relative w-full overflow-hidden ${anton.className}`}
      style={{ background }}
    >
      <div
        ref={wrapRef}
        className="relative w-full aspect-[3/2] sm:aspect-[16/9] lg:aspect-[16/8]"
      >
        {reduced ? (
          <div
            aria-label={word}
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
              {word}
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
            background: `linear-gradient(to bottom, transparent 0%, ${background} 95%)`,
          }}
        />
      </div>
    </div>
  );
}
