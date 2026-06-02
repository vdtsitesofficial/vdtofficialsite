// =============================================================
// VDT Fluid Footer Wordmark — vanilla port
//
// Ported from `C:\Websites\.claude\Obsidian\Sem's\Shared\Fluid Footer
// Wordmark.source.tsx` (Next.js + React + WebGL2) to plain ES module
// for the laptop-zoom-v2 page (no build step, no React).
//
// Same shaders, same constants, same Navier-Stokes sim as the
// apechain port the source was derived from. Stripped the dev
// ControlPanel and the test-page chrome — this is just the
// footer effect, ready to drop into any host with a wrap div
// and a canvas inside.
//
// API:
//   import { initFluidFooter } from './footer.js';
//   const cleanup = initFluidFooter({
//     wrap:    document.querySelector('.vdt-fl-band'),
//     canvas:  document.querySelector('.vdt-fl-canvas'),
//     fallback: document.querySelector('.vdt-fl-fallback'),
//     word:    'VDTSITES',           // text to render as the wordmark
//     params:  { /* override DEFAULTS */ },
//   });
//
// Skip the WebGL path automatically when prefers-reduced-motion is
// set — the host page renders a static <span> fallback instead.
// =============================================================

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

const FS_COPY = `#version 300 es
precision highp float;
uniform sampler2D u_x;
in vec2 v_position;
out vec4 res;
void main() { res = texture(u_x, v_position); }
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

// Tuned defaults from the saved VDT version (Apechain port).
const DEFAULTS = {
  velocityDissipation: 1.0,
  dyeDissipation:      0.989,
  radius:              0.00018,   /* +20% area affected by the cursor splat */
  splatForce:          18,
  pressureIterations:  25,
  dispStrength:        1.0,
  dt:                  0.031,
  pointSize:           2.4,
};

// ── WebGL helpers ─────────────────────────────────────────────
function compile(gl, type, src) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh);
    gl.deleteShader(sh);
    throw new Error("shader compile: " + log + "\n" + src);
  }
  return sh;
}

function program(gl, vs, fs) {
  const p = gl.createProgram();
  gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, vs));
  gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    throw new Error("link: " + gl.getProgramInfoLog(p));
  }
  return p;
}

function createFBO(gl, w, h, internalFormat, format, type, filter) {
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);
  const fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  gl.viewport(0, 0, w, h);
  gl.clear(gl.COLOR_BUFFER_BIT);
  return { tex, fbo, width: w, height: h };
}

function createDoubleFBO(gl, w, h, internalFormat, format, type, filter) {
  let a = createFBO(gl, w, h, internalFormat, format, type, filter);
  let b = createFBO(gl, w, h, internalFormat, format, type, filter);
  return {
    get read()  { return a; },
    get write() { return b; },
    swap() { const t = a; a = b; b = t; },
  };
}

// ── particle generation from a text canvas ────────────────────
function makeTextCanvas(width, height, word) {
  const c = document.createElement("canvas");
  c.width = width;
  c.height = height;
  const ctx = c.getContext("2d");
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  // Wordmark fit inside the text canvas. All horizontal + vertical clearance
  // is controlled here (the canvas spans the band 100%, so this is the only
  // reliable knob):
  //   - margin = 0.72 → ~14% horizontal gutter per side. Absorbs Anton's V/S
  //     side bearings (measureText under-reports them) and the WebGL particle
  //     halo so the outer letters don't clip at the band edges. Generous on
  //     purpose — user prefers extra room to a tight fit.
  //   - fontPx multiplier = 1.20 → caps occupy ~86% of canvas height when the
  //     text is width-bound, leaving headroom at the top so the V's apex
  //     doesn't crop against the canvas top.
  //   - baseline at height * 0.93 → letters sit ~7% above the canvas bottom,
  //     so the bottom of the letters has breathing room and isn't flush with
  //     the footer's bottom row.
  const margin = 0.72;
  let fontPx = Math.round(height * 1.20);
  ctx.font = `400 ${fontPx}px "Anton", "Hanken Grotesk", sans-serif`;
  const measured = ctx.measureText(word).width;
  if (measured > width * margin) {
    fontPx = Math.floor(fontPx * ((width * margin) / measured));
    ctx.font = `400 ${fontPx}px "Anton", "Hanken Grotesk", sans-serif`;
  }
  ctx.fillText(word, width / 2, height * 0.93);
  return c;
}

function particlesFromTextCanvas(c, sampling) {
  const ctx = c.getContext("2d");
  const w = c.width, h = c.height;
  const data = ctx.getImageData(0, 0, w, h).data;
  const positions = [];
  const uvs = [];
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

// ── init ──────────────────────────────────────────────────────
export function initFluidFooter(opts = {}) {
  const wrap     = opts.wrap;
  const canvas   = opts.canvas;
  const fallback = opts.fallback || null;
  const word     = (opts.word || "VDTSITES").toUpperCase();
  const params   = { ...DEFAULTS, ...(opts.params || {}) };

  if (!wrap || !canvas) {
    console.error("initFluidFooter: missing wrap or canvas");
    return () => {};
  }

  // Honour prefers-reduced-motion. If set, skip the whole WebGL path
  // and let the host's static fallback span do the rendering.
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    canvas.style.display = "none";
    if (fallback) fallback.style.display = "";
    return () => {};
  }
  if (fallback) fallback.style.display = "none";

  const gl = canvas.getContext("webgl2", {
    premultipliedAlpha: false,
    antialias: false,
    alpha: false,
  });
  if (!gl) {
    console.error("Fluid footer: WebGL2 required");
    if (fallback) {
      canvas.style.display = "none";
      fallback.style.display = "";
    }
    return () => {};
  }

  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const cbf = gl.getExtension("EXT_color_buffer_float");
  if (!cbf) {
    console.error("Fluid footer: EXT_color_buffer_float required");
    if (fallback) {
      canvas.style.display = "none";
      fallback.style.display = "";
    }
    return () => {};
  }

  // ── programs ──
  const pAdvect = program(gl, VS_QUAD, FS_ADVECT);
  const pDiv    = program(gl, VS_QUAD, FS_DIVERGENCE);
  const pJacobi = program(gl, VS_QUAD, FS_JACOBI);
  const pGrad   = program(gl, VS_QUAD, FS_GRADSUB);
  const pSplat  = program(gl, VS_QUAD, FS_SPLAT);
  const pCopy   = program(gl, VS_QUAD, FS_COPY);
  const pPart   = program(gl, VS_PARTICLE, FS_PARTICLE);

  // ── fullscreen quad ──
  const quadBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW,
  );
  function bindQuad(loc) {
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  }

  // ── sim fields ──
  const SIM = coarse ? 48 : 64;
  const DYE = coarse ? 160 : 256;
  const RG16F = gl.RG16F, RG = gl.RG, R16F = gl.R16F, RED = gl.RED, HF = gl.HALF_FLOAT;

  const velocity   = createDoubleFBO(gl, SIM, SIM, RG16F, RG, HF, gl.LINEAR);
  const pressure   = createDoubleFBO(gl, SIM, SIM, R16F, RED, HF, gl.NEAREST);
  const divergence = createFBO       (gl, SIM, SIM, R16F, RED, HF, gl.NEAREST);
  const dye        = createDoubleFBO(gl, DYE, DYE, RG16F, RG, HF, gl.LINEAR);

  // ── particles ──
  let particleData = { positions: new Float32Array(), uvs: new Float32Array(), count: 0 };
  const posBuf = gl.createBuffer();
  const uvBuf  = gl.createBuffer();

  function rebuildParticles() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(wrap.clientWidth * dpr));
    const h = Math.max(1, Math.round(wrap.clientHeight * dpr));
    canvas.width = w;
    canvas.height = h;
    canvas.style.width  = wrap.clientWidth + "px";
    canvas.style.height = wrap.clientHeight + "px";

    const tw = Math.min(1600, Math.round(w * 0.85));
    const th = Math.round(tw * (h / w));
    const tc = makeTextCanvas(tw, th, word);
    const sampling = 2;
    particleData = particlesFromTextCanvas(tc, sampling);

    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, particleData.positions, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
    gl.bufferData(gl.ARRAY_BUFFER, particleData.uvs, gl.STATIC_DRAW);
  }
  rebuildParticles();
  if (typeof document !== "undefined" && document.fonts) {
    document.fonts.load('400 200px "Anton"').then(() => rebuildParticles());
  }
  const ro = new ResizeObserver(rebuildParticles);
  ro.observe(wrap);

  function blit(target) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
    gl.viewport(0, 0, target.width, target.height);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  // ── cursor state ──
  let cursorActive = false;
  let cx = 0.5, cy = 0.5, pcx = 0.5, pcy = 0.5;
  let hasPrev = false;

  function setFromEvent(e) {
    const r = wrap.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right ||
        e.clientY < r.top  || e.clientY > r.bottom) {
      cursorActive = false;
      return;
    }
    cursorActive = true;
    cx = (e.clientX - r.left) / r.width;
    cy = 1 - (e.clientY - r.top) / r.height;
  }
  function onMove(e)  { setFromEvent(e); }
  function onLeave()  { cursorActive = false; hasPrev = false; }

  window.addEventListener("pointermove",   onMove,  { passive: true });
  window.addEventListener("pointerup",     onLeave, { passive: true });
  window.addEventListener("pointercancel", onLeave, { passive: true });
  window.addEventListener("touchend",      onLeave, { passive: true });
  window.addEventListener("touchcancel",   onLeave, { passive: true });
  wrap.addEventListener("pointerleave",    onLeave);

  // ── sim step ──
  function step(dt) {
    const p = params;
    const ratio = canvas.width / canvas.height;

    if (cursorActive && hasPrev) {
      const dx = (cx - pcx) * p.splatForce;
      const dy = (cy - pcy) * p.splatForce;
      if (dx !== 0 || dy !== 0) {
        gl.useProgram(pSplat);
        bindQuad(gl.getAttribLocation(pSplat, "a_position"));
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
        gl.uniform1i(gl.getUniformLocation(pSplat, "u_x"), 0);
        gl.uniform2f(gl.getUniformLocation(pSplat, "u_point"), cx, cy);
        gl.uniform3f(gl.getUniformLocation(pSplat, "u_value"), dx, dy, 0);
        gl.uniform1f(gl.getUniformLocation(pSplat, "u_radius"), p.radius);
        gl.uniform1f(gl.getUniformLocation(pSplat, "u_ratio"), ratio);
        blit(velocity.write);
        velocity.swap();

        gl.bindTexture(gl.TEXTURE_2D, dye.read.tex);
        gl.uniform1i(gl.getUniformLocation(pSplat, "u_x"), 0);
        gl.uniform3f(gl.getUniformLocation(pSplat, "u_value"), dx * 0.5, dy * 0.5, 0);
        blit(dye.write);
        dye.swap();
      }
    }
    pcx = cx; pcy = cy;
    if (cursorActive) hasPrev = true;

    // advect velocity
    gl.useProgram(pAdvect);
    bindQuad(gl.getAttribLocation(pAdvect, "a_position"));
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
    gl.uniform1i(gl.getUniformLocation(pAdvect, "u_v"), 0);
    gl.uniform1i(gl.getUniformLocation(pAdvect, "u_x"), 1);
    gl.uniform1f(gl.getUniformLocation(pAdvect, "u_dt"), dt);
    gl.uniform1f(gl.getUniformLocation(pAdvect, "u_dissipation"), p.velocityDissipation);
    blit(velocity.write);
    velocity.swap();

    // divergence
    gl.useProgram(pDiv);
    bindQuad(gl.getAttribLocation(pDiv, "a_position"));
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
    gl.uniform1i(gl.getUniformLocation(pDiv, "u_v"), 0);
    blit(divergence);

    // clear pressure
    gl.bindFramebuffer(gl.FRAMEBUFFER, pressure.read.fbo);
    gl.viewport(0, 0, pressure.read.width, pressure.read.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Jacobi pressure iterations
    gl.useProgram(pJacobi);
    bindQuad(gl.getAttribLocation(pJacobi, "a_position"));
    const uXJ = gl.getUniformLocation(pJacobi, "u_x");
    const uBJ = gl.getUniformLocation(pJacobi, "u_b");
    gl.uniform1i(uXJ, 0);
    gl.uniform1i(uBJ, 1);
    gl.uniform1f(gl.getUniformLocation(pJacobi, "u_alpha"), -1);
    gl.uniform1f(gl.getUniformLocation(pJacobi, "u_beta"), 0.25);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, divergence.tex);
    const iters = Math.round(p.pressureIterations);
    for (let i = 0; i < iters; i++) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, pressure.read.tex);
      blit(pressure.write);
      pressure.swap();
    }

    // gradient subtract
    gl.useProgram(pGrad);
    bindQuad(gl.getAttribLocation(pGrad, "a_position"));
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, pressure.read.tex);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
    gl.uniform1i(gl.getUniformLocation(pGrad, "u_p"), 0);
    gl.uniform1i(gl.getUniformLocation(pGrad, "u_v"), 1);
    blit(velocity.write);
    velocity.swap();

    // advect dye
    gl.useProgram(pAdvect);
    bindQuad(gl.getAttribLocation(pAdvect, "a_position"));
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, dye.read.tex);
    gl.uniform1i(gl.getUniformLocation(pAdvect, "u_v"), 0);
    gl.uniform1i(gl.getUniformLocation(pAdvect, "u_x"), 1);
    gl.uniform1f(gl.getUniformLocation(pAdvect, "u_dt"), dt);
    gl.uniform1f(gl.getUniformLocation(pAdvect, "u_dissipation"), p.dyeDissipation);
    blit(dye.write);
    dye.swap();
  }

  // Page background (#f4efe6) + particle colour as RGBA fractions.
  // Caller can override via opts.bgColor / opts.particleColor.
  // Default particle colour is the brand red (#dc2626) so the
  // wordmark reads as a coloured-ink swirl on cream rather than
  // white ink on navy (the apechain look the source was ported
  // from). Mathing the host page's cream theme.
  const bgRGB   = opts.bgColor       || [0.957, 0.937, 0.902, 1.0];   // #f4efe6
  const partRGB = opts.particleColor || [0.863, 0.149, 0.149, 1.0];   // #dc2626

  function render() {
    const p = params;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(bgRGB[0], bgRGB[1], bgRGB[2], bgRGB[3]);
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (!particleData.count) return;

    gl.useProgram(pPart);
    const aPos = gl.getAttribLocation(pPart, "a_pos");
    const aUv  = gl.getAttribLocation(pPart, "a_uv");
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
    gl.enableVertexAttribArray(aUv);
    gl.vertexAttribPointer(aUv, 2, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, dye.read.tex);
    gl.uniform1i(gl.getUniformLocation(pPart, "u_dye"), 0);
    gl.uniform1f(gl.getUniformLocation(pPart, "u_dispStrength"), p.dispStrength);
    gl.uniform1f(
      gl.getUniformLocation(pPart, "u_pointSize"),
      p.pointSize * Math.min(window.devicePixelRatio || 1, 2),
    );
    gl.uniform4f(gl.getUniformLocation(pPart, "u_color"),
                 partRGB[0], partRGB[1], partRGB[2], partRGB[3]);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.drawArrays(gl.POINTS, 0, particleData.count);
  }

  // ── main loop (gated to on-screen only) ──
  // The footer sits far below the fold; running a full Navier-Stokes step
  // (advect ×2, divergence, 25 Jacobi pressure iterations, gradient-subtract,
  // particle draw) every frame for the whole session would drain GPU/battery
  // even when nobody can see it. Pause the loop whenever the footer is off
  // screen and resume when it scrolls into view.
  const minMs = coarse ? 33 : 0;     // ~30fps cap on touch devices
  let raf = 0;
  let lastT = performance.now();
  let running = false;
  function frame() {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    const now = performance.now();
    if (now - lastT < minMs) return;
    lastT = now;
    step(params.dt);
    render();
  }
  function startLoop() {
    if (running) return;
    running = true;
    lastT = performance.now();
    raf = requestAnimationFrame(frame);
  }
  function stopLoop() {
    running = false;
    cancelAnimationFrame(raf);
  }
  const visObserver = new IntersectionObserver(
    (entries) => { entries.some((e) => e.isIntersecting) ? startLoop() : stopLoop(); },
    { threshold: 0.01 },
  );
  visObserver.observe(wrap);

  return function cleanup() {
    stopLoop();
    visObserver.disconnect();
    ro.disconnect();
    window.removeEventListener("pointermove",   onMove);
    window.removeEventListener("pointerup",     onLeave);
    window.removeEventListener("pointercancel", onLeave);
    window.removeEventListener("touchend",      onLeave);
    window.removeEventListener("touchcancel",   onLeave);
    wrap.removeEventListener("pointerleave",    onLeave);
  };
}
