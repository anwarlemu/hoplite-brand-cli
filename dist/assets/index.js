import { createRequire as __ds_require } from 'node:module'; const require = __ds_require(import.meta.url);

// dist/assets/canvas.js
import { readFileSync as readFileSync2 } from "node:fs";
import { createCanvas, GlobalFonts, SvgExportFlag } from "@napi-rs/canvas";

// dist/lib/brand.js
import { readFileSync } from "node:fs";

// dist/lib/paths.js
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
var PKG_ROOT = (() => {
  let dir = dirname(fileURLToPath(import.meta.url));
  while (!existsSync(join(dir, "brand", "brand.json")) && dirname(dir) !== dir)
    dir = dirname(dir);
  return dir;
})();
var pkgPath = (...parts) => join(PKG_ROOT, ...parts);

// dist/lib/brand.js
var tokenFile;
function tokens() {
  tokenFile ??= JSON.parse(readFileSync(pkgPath("build", "tokens.json"), "utf8"));
  return tokenFile;
}
function colorHex(name, theme = "site") {
  const t = tokens();
  const table = theme === "site" ? t.site : theme === "site-dark" ? t.siteDark ?? t.site : theme === "product" ? t.product : { ...t.product, ...t.dark };
  const raw = table[`--ds-color-${name}`];
  if (!raw)
    return void 0;
  if (raw.startsWith("#"))
    return raw.toUpperCase();
  const rgb = raw.match(/rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)(?:\s*[/,]\s*([\d.]+))?/);
  if (!rgb)
    return void 0;
  const hex = [rgb[1], rgb[2], rgb[3]].map((n) => Number(n).toString(16).padStart(2, "0")).join("").toUpperCase();
  return rgb[4] === void 0 ? `#${hex}` : `#${hex}${Math.round(Number(rgb[4]) * 255).toString(16).padStart(2, "0").toUpperCase()}`;
}

// dist/assets/png.js
import { deflateSync } from "node:zlib";
var CRC = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++)
      c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();
function crc32(buf) {
  let c = 4294967295;
  for (let i = 0; i < buf.length; i++)
    c = CRC[(c ^ buf[i]) & 255] ^ c >>> 8;
  return (c ^ 4294967295) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function encodePng(pixels, width, height, channels = 4, dpi) {
  const stride = width * channels;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++)
    pixels.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = channels === 4 ? 6 : 2;
  const parts = [Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", ihdr)];
  if (dpi) {
    const phys = Buffer.alloc(9);
    const ppm = Math.round(dpi / 0.0254);
    phys.writeUInt32BE(ppm, 0);
    phys.writeUInt32BE(ppm, 4);
    phys[8] = 1;
    parts.push(chunk("pHYs", phys));
  }
  parts.push(chunk("IDAT", deflateSync(raw, { level: 6 })), chunk("IEND", Buffer.alloc(0)));
  return Buffer.concat(parts);
}

// dist/assets/canvas.js
var fonts;
function brandFonts() {
  if (fonts)
    return fonts;
  const doc6 = JSON.parse(readFileSync2(pkgPath("brand", "fonts", "fonts.json"), "utf8"));
  for (const face of [doc6.display, doc6.mono])
    for (const file of Object.values(face.files))
      GlobalFonts.registerFromPath(pkgPath("brand", "fonts", file), face.family);
  fonts = { display: `"${doc6.display.family}"`, mono: `"${doc6.mono.family}"` };
  return fonts;
}
function surface(width, height, opts = {}) {
  brandFonts();
  const scale = opts.scale ?? 1;
  const pw = Math.max(1, Math.round(width * scale));
  const ph = Math.max(1, Math.round(height * scale));
  const canvas = opts.svg ? createCanvas(pw, ph, SvgExportFlag.ConvertTextToPaths) : createCanvas(pw, ph);
  const ctx = canvas.getContext("2d");
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  return { canvas, ctx, width, height, scale, svg: !!opts.svg };
}
function scratch(width, height) {
  brandFonts();
  const canvas = createCanvas(Math.max(1, Math.round(width)), Math.max(1, Math.round(height)));
  return { canvas, ctx: canvas.getContext("2d") };
}
function pixelsOf(s) {
  const { width, height } = s.canvas;
  const img = s.canvas.getContext("2d").getImageData(0, 0, width, height);
  return { data: Buffer.from(img.data.buffer, img.data.byteOffset, img.data.byteLength), width, height };
}
function toPng(s, opts = {}) {
  if (s.svg)
    throw new Error("This surface records SVG; draw again on a raster surface for PNG.");
  const px = pixelsOf(s);
  if (!opts.opaque)
    return encodePng(px.data, px.width, px.height, 4, opts.dpi);
  const rgb = Buffer.alloc(px.width * px.height * 3);
  for (let i = 0, j = 0; i < px.data.length; i += 4, j += 3) {
    rgb[j] = px.data[i];
    rgb[j + 1] = px.data[i + 1];
    rgb[j + 2] = px.data[i + 2];
  }
  return encodePng(rgb, px.width, px.height, 3, opts.dpi);
}
function toSvg(s, physical) {
  if (!s.svg)
    throw new Error("This surface holds pixels; draw again with { svg: true } for SVG.");
  let svg = compactSvg(s.canvas.getContent().toString("utf8"));
  if (physical)
    svg = svg.replace(/(<svg [^>]*?)width="[\d.]+" height="[\d.]+"/, `$1width="${physical.widthIn}in" height="${physical.heightIn}in" viewBox="0 0 ${s.canvas.width} ${s.canvas.height}"`);
  return svg;
}
function tokenColor(name, theme = "light") {
  if (/^#[0-9a-f]{3,8}$/i.test(name) || /^rgba?\(/.test(name))
    return name;
  const hex = colorHex(name.replace(/^--ds-color-/, ""), theme === "dark" ? "site-dark" : "site");
  if (!hex)
    throw new Error(`Unknown color token \`${name}\`.`);
  if (hex.length === 9) {
    const n = (i) => Number.parseInt(hex.slice(i, i + 2), 16);
    return `rgba(${n(1)}, ${n(3)}, ${n(5)}, ${Math.round(n(7) / 255 * 1e3) / 1e3})`;
  }
  return hex;
}
function tokenAlpha(name, alpha, theme = "light") {
  const c = tokenColor(name, theme);
  const m = /^#([0-9a-f]{6})/i.exec(c);
  if (!m)
    return c;
  const n = Number.parseInt(m[1], 16);
  return `rgba(${n >> 16 & 255}, ${n >> 8 & 255}, ${n & 255}, ${Math.round(alpha * 1e3) / 1e3})`;
}
function compactSvg(svg) {
  return svg.replace(/ d="([^"]*)"/g, (_m, d) => ` d="${compactPath(d)}"`);
}
var r2 = (n) => {
  const v = Math.round(n * 100) / 100;
  return Object.is(v, -0) ? "0" : String(v);
};
function compactPath(d) {
  const tokens2 = d.match(/[A-Za-z]|-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/g);
  if (!tokens2 || tokens2.some((t) => /^[A-Za-z]$/.test(t) && !"MLQCZ".includes(t)))
    return d;
  const subpaths = [];
  let cur = [];
  let seg;
  for (const t of tokens2) {
    if (/^[A-Z]$/.test(t)) {
      if (t === "M" && cur.length) {
        subpaths.push(cur);
        cur = [];
      }
      seg = { cmd: t, nums: [] };
      cur.push(seg);
    } else
      seg?.nums.push(Number(t));
  }
  if (cur.length)
    subpaths.push(cur);
  return subpaths.map((sp) => circleOf(sp) ?? sp.map((s) => s.cmd + s.nums.map(r2).join(" ")).join("")).join("");
}
function circleOf(sp) {
  if (sp.length < 9 || sp[0].cmd !== "M" || sp[0].nums.length !== 2)
    return void 0;
  const pts = [];
  for (const s of sp) {
    if (s.cmd === "Z")
      continue;
    if (s.cmd !== "M" && s.cmd !== "Q")
      return void 0;
    for (let i = 0; i + 1 < s.nums.length; i += 2)
      pts.push([s.nums[i], s.nums[i + 1]]);
  }
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const x0 = Math.min(...xs);
  const x1 = Math.max(...xs);
  const y0 = Math.min(...ys);
  const y1 = Math.max(...ys);
  const r = (x1 - x0) / 2;
  if (r <= 0 || Math.abs(x1 - x0 - (y1 - y0)) > r * 0.03)
    return void 0;
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  for (const s of sp) {
    if (s.cmd === "Z")
      continue;
    const n = s.nums;
    const ex = n[n.length - 2];
    const ey = n[n.length - 1];
    if (Math.abs(Math.hypot(ex - cx, ey - cy) - r) > Math.max(0.01, r * 0.02))
      return void 0;
  }
  const [sx, sy] = pts[0];
  const last = pts[pts.length - 1];
  if (Math.hypot(last[0] - sx, last[1] - sy) > Math.max(0.01, r * 0.02))
    return void 0;
  let area = 0;
  for (let i = 0; i < pts.length; i++) {
    const [ax, ay] = pts[i];
    const [bx, by] = pts[(i + 1) % pts.length];
    area += ax * by - bx * ay;
  }
  const sweep = area > 0 ? 1 : 0;
  return `M${r2(cx + r)} ${r2(cy)}A${r2(r)} ${r2(r)} 0 1 ${sweep} ${r2(cx - r)} ${r2(cy)}A${r2(r)} ${r2(r)} 0 1 ${sweep} ${r2(cx + r)} ${r2(cy)}Z`;
}

// dist/assets/scene.js
var CUT = "cut";
function mulberry(seed) {
  let a = seed >>> 0 || 1;
  return () => {
    a |= 0;
    a = a + 1831565813 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function stroke(ctx, style, u, color, alpha = 1, march = 0) {
  ctx.strokeStyle = color;
  ctx.globalAlpha = alpha;
  ctx.lineCap = style === "dots" ? "round" : "butt";
  ctx.lineJoin = "round";
  const period = style === "dots" ? 5.2 : style === "dash" ? 12.5 : style === "long" ? 21 : 0;
  ctx.lineDashOffset = -march * period * u;
  if (style === "dots") {
    ctx.lineWidth = Math.max(0.8, 1.7 * u);
    ctx.setLineDash([0.01, 5.2 * u]);
  } else if (style === "dash") {
    ctx.lineWidth = Math.max(0.6, 1.25 * u);
    ctx.setLineDash([7 * u, 5.5 * u]);
  } else if (style === "long") {
    ctx.lineWidth = Math.max(0.6, 1.25 * u);
    ctx.setLineDash([13 * u, 8 * u]);
  } else {
    ctx.lineWidth = Math.max(0.5, 0.9 * u);
    ctx.setLineDash([]);
    ctx.globalAlpha = alpha * 0.8;
  }
}
var add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
var mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
var cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
var norm = (a) => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};
function nodeIn(ctx, c, e1, e2, r, to, fill, hole, turn = 0) {
  const ring = (k) => Array.from({ length: 6 }, (_, i) => {
    const a = i * Math.PI / 3 + turn;
    return to(add(c, add(mul(e1, Math.cos(a) * r * k), mul(e2, Math.sin(a) * r * k))));
  });
  const path = (pts) => {
    ctx.beginPath();
    pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
    ctx.closePath();
  };
  ctx.save();
  ctx.setLineDash([]);
  ctx.globalAlpha = 1;
  ctx.beginPath();
  for (const pts of [ring(1), ring(0.42)]) {
    pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
    ctx.closePath();
  }
  ctx.fillStyle = fill;
  ctx.fill("evenodd");
  if (hole !== CUT) {
    path(ring(0.42));
    ctx.fillStyle = hole;
    ctx.fill();
  }
  ctx.restore();
}
function drawNode(ctx, x, y, r, fill, hole, turn = 0) {
  nodeIn(ctx, [x, y, 0], [1, 0, 0], [0, 1, 0], r, (p) => [p[0], p[1]], fill, hole, turn);
}
function hexPill(ctx, x, y, w, h) {
  const p = Math.min(h * 0.5, w / 2);
  ctx.beginPath();
  ctx.moveTo(x + p, y);
  ctx.lineTo(x + w - p, y);
  ctx.lineTo(x + w, y + h / 2);
  ctx.lineTo(x + w - p, y + h);
  ctx.lineTo(x + p, y + h);
  ctx.lineTo(x, y + h / 2);
  ctx.closePath();
}
var overlaps = (x, y, pad, avoid) => avoid.some((r) => x > r.x - pad && x < r.x + r.w + pad && y > r.y - pad && y < r.y + r.h + pad);
function drawGlobe(ctx, o, u, W2, H2, line, node, hole, avoid, motion = {}) {
  const rnd = mulberry(o.seed);
  const e = o.tilt * Math.PI / 180;
  const ce = Math.cos(e);
  const se = Math.sin(e);
  const march = motion.march ?? 0;
  const view = (p) => {
    const y = p[1] * ce - p[2] * se;
    const z = p[1] * se + p[2] * ce;
    return { x: o.cx + p[0] * o.r, y: o.cy - z * o.r, depth: -y };
  };
  const to = (p) => {
    const v = view(p);
    return [v.x, v.y];
  };
  const styles = ["dots", "dash", "long", "dots", "dash"];
  const pick2 = (a) => a[Math.floor(rnd() * a.length)];
  const circles = [];
  const nm = 3 + Math.floor(rnd() * 2);
  const lon0 = rnd() * Math.PI;
  for (let i = 0; i < nm; i++) {
    const lon = lon0 + i / nm * Math.PI + (rnd() - 0.5) * 0.35;
    const c = Math.cos(lon);
    const s2 = Math.sin(lon);
    circles.push({ pts: (t) => [Math.cos(t) * c, Math.cos(t) * s2, Math.sin(t)], style: pick2(styles), alpha: 0.9 });
  }
  const np = 1 + Math.floor(rnd() * 2);
  for (let i = 0; i < np; i++) {
    const lat = (0.15 + rnd() * 0.45) * (Math.PI / 2);
    circles.push({ pts: (t) => [Math.cos(lat) * Math.cos(t), Math.cos(lat) * Math.sin(t), Math.sin(lat)], style: pick2(styles), alpha: 0.85 });
  }
  const ax = norm([rnd() - 0.5, rnd() - 0.5, 0.6 + rnd()]);
  const b1 = norm(cross(ax, [0, 0, 1]));
  const b2 = cross(ax, b1);
  const tip = 0.5 + rnd() * 0.6;
  const g1 = norm(add(mul(b1, Math.cos(tip)), mul(ax, Math.sin(tip))));
  circles.push({ pts: (t) => add(mul(g1, Math.cos(t)), mul(b2, Math.sin(t))), style: "long", alpha: 0.9 });
  if (o.ring) {
    const lat = 0.62 * (Math.PI / 2);
    circles.push({ pts: (t) => [Math.cos(lat) * Math.cos(t), Math.cos(lat) * Math.sin(t), Math.sin(lat)], style: "solid", alpha: 0.85 });
  }
  ctx.save();
  stroke(ctx, "dots", u, line, 0.9, march);
  ctx.beginPath();
  ctx.arc(o.cx, o.cy, o.r * 1.035, 0, Math.PI * 2);
  ctx.stroke();
  stroke(ctx, "long", u, line, 0.9, march);
  ctx.beginPath();
  ctx.arc(o.cx, o.cy, o.r, 0, Math.PI * 2);
  ctx.stroke();
  const N = 420;
  for (const c of circles) {
    stroke(ctx, c.style, u, line, c.alpha, march);
    ctx.beginPath();
    let pen = false;
    for (let i = 0; i <= N; i++) {
      const v = view(c.pts(i / N * Math.PI * 2));
      if (v.depth < -0.02) {
        pen = false;
        continue;
      }
      if (pen)
        ctx.lineTo(v.x, v.y);
      else
        ctx.moveTo(v.x, v.y);
      pen = true;
    }
    ctx.stroke();
  }
  ctx.setLineDash([]);
  ctx.lineDashOffset = 0;
  ctx.globalAlpha = 1;
  const s = o.nodeSize * u / o.r;
  const placed = [];
  const room = o.nodeSize * u * 5;
  const lay = (p, along, scale = 1) => {
    const n = norm(p);
    const e1 = norm(along);
    const e2 = norm(cross(n, e1));
    nodeIn(ctx, p, e1, e2, s * scale, to, node, hole, motion.turn ?? 0);
  };
  if (o.pole) {
    const v = view([0, 0, 1]);
    if (v.depth > 0) {
      lay([0, 0, 1], [1, 0, 0], 1.45);
      placed.push([v.x, v.y]);
    }
  }
  let tries = 0;
  while (placed.length < o.nodes + (o.pole ? 1 : 0) && tries++ < 600) {
    const c = circles[Math.floor(rnd() * circles.length)];
    const t = rnd() * Math.PI * 2;
    const p = c.pts(t);
    const v = view(p);
    if (v.depth < 0.22)
      continue;
    const pad = o.nodeSize * u * 2;
    if (v.x < pad || v.x > W2 - pad || v.y < pad || v.y > H2 - pad)
      continue;
    if (overlaps(v.x, v.y, pad * 1.5, avoid))
      continue;
    if (placed.some(([x, y]) => Math.hypot(x - v.x, y - v.y) < room))
      continue;
    const q = c.pts(t + 1e-3);
    lay(p, [q[0] - p[0], q[1] - p[1], q[2] - p[2]]);
    placed.push([v.x, v.y]);
  }
  ctx.restore();
}
function drawCube(ctx, o, u, W2, H2, line, node, hole, avoid, motion = {}) {
  const rnd = mulberry(o.seed);
  const c30 = Math.cos(Math.PI / 6);
  const s30 = 0.5;
  const march = motion.march ?? 0;
  const to = (p) => [o.x + (p[0] - p[1]) * c30 * o.size, o.y - (p[0] + p[1]) * s30 * o.size - p[2] * o.size];
  const seg = (a, b, style, alpha = 0.9) => {
    stroke(ctx, style, u, line, alpha, march);
    const [x1, y1] = to(a);
    const [x2, y2] = to(b);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };
  const cells = 2 + Math.floor(rnd() * 2);
  ctx.save();
  const g = 0.14;
  const G = [[-g, -g, -g], [1 + g, -g, -g], [-g, 1 + g, -g], [1 + g, 1 + g, -g], [-g, -g, 1 + g], [1 + g, -g, 1 + g], [-g, 1 + g, 1 + g], [1 + g, 1 + g, 1 + g]];
  for (const [a, b] of [[4, 5], [4, 6], [5, 7], [6, 7], [1, 5], [2, 6], [0, 1], [0, 2], [0, 4]])
    seg(G[a], G[b], "dots", 0.75);
  for (const b of [[1, 1, 1], [0, 1, 0], [1, 0, 0]])
    seg([1, 1, 0], b, "dots", 0.55);
  const kinds = ["solid", "dots", "dash", "solid"];
  const pick2 = () => kinds[Math.floor(rnd() * kinds.length)];
  const lines = [];
  for (let i = 1; i < cells; i++) {
    const t = i / cells;
    lines.push({ a: [0, t, 0], b: [0, t, 1], face: 0 });
    lines.push({ a: [0, 0, t], b: [0, 1, t], face: 0 });
    lines.push({ a: [t, 0, 0], b: [t, 0, 1], face: 1 });
    lines.push({ a: [0, 0, t], b: [1, 0, t], face: 1 });
    lines.push({ a: [t, 0, 1], b: [t, 1, 1], face: 2 });
    lines.push({ a: [0, t, 1], b: [1, t, 1], face: 2 });
  }
  for (const l of lines)
    seg(l.a, l.b, pick2(), 0.85);
  const E = [
    [[0, 0, 1], [1, 0, 1]],
    [[0, 0, 1], [0, 1, 1]],
    [[1, 0, 1], [1, 1, 1]],
    [[0, 1, 1], [1, 1, 1]],
    [[1, 0, 0], [1, 0, 1]],
    [[0, 1, 0], [0, 1, 1]],
    [[0, 0, 0], [1, 0, 0]],
    [[0, 0, 0], [0, 1, 0]]
  ];
  for (const [a, b] of E)
    seg(a, b, "long", 0.95);
  seg([0, 0, 0], [0, 0, 1], "solid", 1);
  ctx.setLineDash([]);
  ctx.lineDashOffset = 0;
  ctx.globalAlpha = 1;
  const placed = [];
  const r = o.nodeSize * u / o.size;
  const room = o.nodeSize * u * 5;
  let tries = 0;
  while (placed.length < o.nodes && tries++ < 400) {
    const l = lines[Math.floor(rnd() * lines.length)];
    const t = 0.2 + rnd() * 0.6;
    const p = add(l.a, mul(add(l.b, mul(l.a, -1)), t));
    const [px, py] = to(p);
    const pad = o.nodeSize * u * 2;
    if (px < pad || px > W2 - pad || py < pad || py > H2 - pad)
      continue;
    if (overlaps(px, py, pad * 1.5, avoid))
      continue;
    if (placed.some(([x, y]) => Math.hypot(x - px, y - py) < room))
      continue;
    const along = norm(add(l.b, mul(l.a, -1)));
    const facing = l.face === 0 ? [1, 0, 0] : l.face === 1 ? [0, 1, 0] : [0, 0, 1];
    nodeIn(ctx, p, along, norm(cross(facing, along)), r, to, node, hole, motion.turn ?? 0);
    placed.push([px, py]);
  }
  ctx.restore();
}
function drawLoader(ctx, x, y, w, progress, label, mono, ink, red, hole, motion = {}) {
  const p = Math.max(0, Math.min(100, progress)) / 100;
  const fs = Math.max(10, w * 0.034);
  ctx.save();
  ctx.fillStyle = ink;
  ctx.globalAlpha = 0.9;
  ctx.font = `400 ${fs}px ${mono}`;
  ctx.letterSpacing = `${fs * 0.55}px`;
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  ctx.fillText(label.toUpperCase(), x, y);
  ctx.letterSpacing = `${fs * 0.08}px`;
  ctx.textAlign = "right";
  ctx.fillText(`${Math.round(p * 100)}%`, x + w, y);
  ctx.textAlign = "left";
  ctx.letterSpacing = "0px";
  ctx.globalAlpha = 1;
  const by = y + fs * 3.2;
  const lw = Math.max(1, w * 28e-4);
  const tick = fs * 1.15;
  const r = fs * 0.95;
  const nx = x + r + (w - 2 * r) * p;
  ctx.fillStyle = red;
  ctx.fillRect(x, by - tick / 2, lw, tick);
  ctx.fillRect(x + w - lw, by - tick / 2, lw, tick);
  ctx.fillRect(x, by - lw / 2, nx - x, lw);
  ctx.strokeStyle = ink;
  ctx.globalAlpha = 0.85;
  ctx.lineWidth = lw * 0.8;
  ctx.setLineDash([w * 0.012, w * 9e-3]);
  ctx.lineDashOffset = -(motion.march ?? 0) * w * 0.021;
  ctx.beginPath();
  ctx.moveTo(nx + r * 1.4, by);
  ctx.lineTo(x + w - lw * 3, by);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.lineDashOffset = 0;
  ctx.globalAlpha = 1;
  drawNode(ctx, nx, by, r, red, hole, motion.turn ?? 0);
  ctx.restore();
  return { x, y: y - fs, w, h: by + tick / 2 - (y - fs) };
}
var grainTile;
function drawGrain(ctx, amount, dark, scale = 1) {
  if (amount <= 0)
    return;
  if (!grainTile || grainTile.dark !== dark) {
    const N = 192;
    const { canvas, ctx: o } = scratch(N, N);
    const im = o.createImageData(N, N);
    const rnd = mulberry(7);
    for (let i = 0; i < N * N; i++) {
      const v = rnd();
      const a = rnd() < 0.55 ? Math.round(v * 255) : 0;
      im.data[i * 4] = dark ? 255 : 0;
      im.data[i * 4 + 1] = dark ? 255 : 0;
      im.data[i * 4 + 2] = dark ? 255 : 0;
      im.data[i * 4 + 3] = a;
    }
    o.putImageData(im, 0, 0);
    grainTile = { canvas, dark };
  }
  const pat = ctx.createPattern(grainTile.canvas, "repeat");
  if (!pat)
    return;
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = amount / 100 * (dark ? 0.09 : 0.03);
  ctx.fillStyle = pat;
  ctx.fillRect(0, 0, ctx.canvas.width / 1, ctx.canvas.height / 1);
  ctx.restore();
  void scale;
}
function drawRules(ctx, u, W2, H2, inset, foot, sides, color, march = 0) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.75;
  ctx.lineWidth = Math.max(0.6, 1.1 * u);
  ctx.setLineDash([9 * u, 7 * u]);
  ctx.lineDashOffset = -march * 16 * u;
  ctx.beginPath();
  if (sides.top) {
    ctx.moveTo(0, inset);
    ctx.lineTo(W2, inset);
  }
  if (sides.bottom) {
    ctx.moveTo(sides.left ? inset : 0, H2 - foot);
    ctx.lineTo(W2, H2 - foot);
  }
  if (sides.left) {
    ctx.moveTo(inset, 0);
    ctx.lineTo(inset, H2);
  }
  ctx.stroke();
  ctx.restore();
}
function drawNote(ctx, text, x, y, w, size, mono, color, justify = true, dry = false) {
  const t = text.trim();
  if (!t)
    return { x, y, w: 0, h: 0 };
  ctx.save();
  ctx.font = `400 ${size}px ${mono}`;
  ctx.letterSpacing = `${size * 0.08}px`;
  ctx.fillStyle = color;
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  const lh = size * 1.62;
  const space = ctx.measureText(" ").width;
  let row = 0;
  for (const para of t.toUpperCase().split("\n")) {
    const words = para.split(/\s+/).filter(Boolean);
    const lines = [];
    let cur = [];
    let cw = 0;
    for (const wd of words) {
      const ww = ctx.measureText(wd).width;
      if (cur.length && cw + space + ww > w) {
        lines.push(cur);
        cur = [wd];
        cw = ww;
      } else {
        cw += (cur.length ? space : 0) + ww;
        cur.push(wd);
      }
    }
    if (cur.length)
      lines.push(cur);
    lines.forEach((ln, i) => {
      const base = y + row * lh + size;
      row++;
      if (dry)
        return;
      const last = i === lines.length - 1;
      const widths = ln.map((wd) => ctx.measureText(wd).width);
      const total = widths.reduce((a, b) => a + b, 0);
      const gap = justify && !last && ln.length > 1 ? (w - total) / (ln.length - 1) : space;
      let px = x;
      ln.forEach((wd, j) => {
        ctx.fillText(wd, px, base);
        px += widths[j] + gap;
      });
    });
  }
  ctx.restore();
  return { x, y, w, h: row * lh };
}
function drawCorners(ctx, r, len, width, color) {
  ctx.save();
  ctx.fillStyle = color;
  for (const [x, y, dx, dy] of [[r.x, r.y, 1, 1], [r.x + r.w, r.y, -1, 1], [r.x, r.y + r.h, 1, -1], [r.x + r.w, r.y + r.h, -1, -1]]) {
    ctx.fillRect(dx > 0 ? x : x - len, dy > 0 ? y : y - width, len, width);
    ctx.fillRect(dx > 0 ? x : x - width, dy > 0 ? y : y - len, width, len);
  }
  ctx.restore();
}

// dist/assets/text.js
function setFont(ctx, s) {
  ctx.font = `${s.weight} ${s.size}px ${s.family}`;
  ctx.letterSpacing = `${(s.tracking ?? 0) * s.size}px`;
}
function wrap(ctx, text, max) {
  const out = [];
  for (const para of text.split("\n")) {
    const words = para.split(/\s+/).filter(Boolean);
    let line = "";
    for (const w of words) {
      const next = line ? `${line} ${w}` : w;
      if (line && ctx.measureText(next).width > max) {
        out.push(line);
        line = w;
      } else
        line = next;
    }
    out.push(line);
  }
  return out;
}
function fit(ctx, text, style, max, maxLines = 99, minScale = 0.5, what = "text") {
  const value = style.caps ? text.toUpperCase() : text;
  for (let size = style.size; size >= style.size * minScale - 0.01; size -= Math.max(0.5, style.size / 40)) {
    setFont(ctx, { ...style, size });
    const lines = wrap(ctx, value, max);
    const widths = lines.map((l) => ctx.measureText(l).width);
    if (lines.length <= maxLines && widths.every((w) => w <= max + 0.5)) {
      ctx.letterSpacing = "0px";
      return { lines, size, widths, width: Math.max(0, ...widths), height: lines.length * size * (style.leading ?? 1.2), style: { ...style, size } };
    }
  }
  ctx.letterSpacing = "0px";
  throw new Error(`The ${what} is too long for this layout: it needs more than ${maxLines} line${maxLines === 1 ? "" : "s"} at ${Math.round(style.size * minScale)}px in ${Math.round(max)}px. Shorten it.`);
}
function drawFitted(ctx, f, x, top, width = f.width) {
  const s = f.style;
  const lh = s.size * (s.leading ?? 1.2);
  setFont(ctx, s);
  ctx.fillStyle = s.color ?? "#000000";
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  f.lines.forEach((l, i) => {
    const w = f.widths[i];
    const lx = s.align === "center" ? x + (width - w) / 2 : s.align === "right" ? x + width - w : x;
    ctx.fillText(l, lx, top + i * lh + s.size * 0.92);
  });
  ctx.letterSpacing = "0px";
  const left = s.align === "center" ? x + (width - f.width) / 2 : s.align === "right" ? x + width - f.width : x;
  return { x: left, y: top, w: f.width, h: f.lines.length * lh };
}

// dist/assets/logo.js
import { readFileSync as readFileSync3 } from "node:fs";
import { Path2D } from "@napi-rs/canvas";
var doc;
var logoDoc = () => doc ??= JSON.parse(readFileSync3(pkgPath("brand", "assets", "logo.json"), "utf8"));
var markP;
var wordP;
var markPath = () => markP ??= join2(logoDoc().mark.paths);
var wordPath = () => wordP ??= join2(logoDoc().wordmark.paths);
function join2(paths) {
  const p = new Path2D();
  for (const d of paths)
    p.addPath(new Path2D(d));
  return p;
}
var logoRatio = () => logoDoc().width / logoDoc().height;
var markRatio = () => logoDoc().mark.width / logoDoc().height;
var lockupNames = () => Object.keys(logoDoc().lockups);
function drawLogo(ctx, x, y, h, mark, word) {
  const l = logoDoc();
  const k = h / l.height;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(k, k);
  ctx.fillStyle = mark;
  ctx.fill(markPath(), "evenodd");
  ctx.fillStyle = word;
  ctx.fill(wordPath());
  ctx.restore();
  return l.width * k;
}
function drawMark(ctx, x, y, h, color) {
  const l = logoDoc();
  const k = h / l.height;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(k, k);
  ctx.fillStyle = color;
  ctx.fill(markPath(), "evenodd");
  ctx.restore();
  return l.mark.width * k;
}
function drawWordmark(ctx, x, y, h, color) {
  const l = logoDoc();
  const k = h / l.height;
  ctx.save();
  ctx.translate(x - l.wordmark.x * k, y);
  ctx.scale(k, k);
  ctx.fillStyle = color;
  ctx.fill(wordPath());
  ctx.restore();
  return (l.width - l.wordmark.x) * k;
}

// dist/assets/picture.js
import { createHash } from "node:crypto";
import { readFileSync as readFileSync4 } from "node:fs";
import { isAbsolute, resolve as resolve2 } from "node:path";
import { loadImage } from "@napi-rs/canvas";
var KINDS = [
  ["png", (b) => b.length > 8 && b[0] === 137 && b[1] === 80 && b[2] === 78 && b[3] === 71],
  ["jpeg", (b) => b.length > 3 && b[0] === 255 && b[1] === 216],
  ["webp", (b) => b.length > 12 && b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP"],
  ["gif", (b) => b.length > 6 && b.toString("ascii", 0, 3) === "GIF"],
  ["svg", (b) => /<svg[\s>]/i.test(b.toString("utf8", 0, Math.min(b.length, 4096)))]
];
function pictureKind(data) {
  return KINDS.find(([, test]) => test(data))?.[0];
}
async function pictureFrom(data, max = 1e3) {
  const kind = pictureKind(data);
  if (!kind)
    throw new Error("Use a PNG, JPEG, WebP, GIF or SVG picture.");
  const img = await loadImage(data);
  const iw = img.width || max;
  const ih = img.height || (img.width ? max : iw);
  const k = Math.min(1, max / Math.max(iw, ih));
  const w = Math.max(1, Math.round(iw * k));
  const h = Math.max(1, Math.round(ih * k));
  const { canvas, ctx } = scratch(w, h);
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, w, h);
  return { canvas, width: w, height: h, key: createHash("sha1").update(data).update(String(max)).digest("hex") };
}
async function readPicture(cwd, path, max = 1e3) {
  const abs = isAbsolute(path) ? path : resolve2(cwd, path);
  let data;
  try {
    data = readFileSync4(abs);
  } catch {
    throw new Error(`No picture at ${path}.`);
  }
  if (!pictureKind(data))
    throw new Error(`${path} is not a PNG, JPEG, WebP, GIF or SVG picture.`);
  return pictureFrom(data, max);
}

// dist/assets/og.js
import { readFileSync as readFileSync5 } from "node:fs";

// dist/assets/io.js
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname as dirname2, isAbsolute as isAbsolute2, relative } from "node:path";
var normalize = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, "");
function distance(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = i - 1;
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cur = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
  }
  return row[b.length];
}
function suggest(typed, pool, max = 3) {
  const t = normalize(typed);
  return [...new Set(pool)].map((name) => {
    const n = normalize(name);
    return { name, d: n && (n.includes(t) || t.includes(n)) ? Math.abs(n.length - t.length) * 0.3 : distance(t, n) };
  }).filter((s) => s.d <= Math.max(2, t.length * 0.4)).sort((a, b) => a.d - b.d || a.name.length - b.name.length).slice(0, max).map((s) => s.name);
}
function unknown(what, typed, pool) {
  const near = suggest(typed, pool);
  return new Error(`Unknown ${what} \`${typed}\`.${near.length ? ` Did you mean ${near.map((n) => `\`${n}\``).join(" or ")}?` : ""} Choose from: ${pool.join(", ")}.`);
}
function pick(what, typed, pool) {
  const hit = pool.find((p) => p.toLowerCase() === typed.trim().toLowerCase());
  if (!hit)
    throw unknown(what, typed, [...pool]);
  return hit;
}
function num(name, value, min, max, opts = {}) {
  if (value === void 0 || value === null || value === "")
    return void 0;
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n) || opts.integer && !Number.isInteger(n))
    throw new Error(`--${name} takes a ${opts.integer ? "whole " : ""}number, not \`${String(value)}\`.`);
  if (n < min || n > max)
    throw new Error(`--${name} takes ${min} to ${max}, not ${n}.`);
  return n;
}
function write(path, data) {
  mkdirSync(dirname2(path), { recursive: true });
  writeFileSync(path, data);
}
function display(cwd, path) {
  const rel = relative(cwd, path);
  return !rel || rel.startsWith("..") || isAbsolute2(rel) ? path : rel;
}

// dist/assets/og.js
var TEMPLATES = ["globe", "cube", "horizon", "banner", "loader", "logo", "partner"];
var doc2;
var imageDoc = () => doc2 ??= JSON.parse(readFileSync5(pkgPath("brand", "assets", "image.json"), "utf8"));
var themeNames = () => Object.keys(imageDoc().themes);
var clampDim = (n) => Math.round(Math.min(4e3, Math.max(160, n || 0)));
function frameOf(d) {
  const s = imageDoc().sizes[d.size];
  return s ? { w: s.w, h: s.h } : { w: clampDim(d.w), h: clampDim(d.h) };
}
function unitOf(d) {
  const { w, h } = frameOf(d);
  return Math.sqrt(w * h / (1200 * 630));
}
function layoutFor(t, at) {
  const { w: W2, h: H2 } = frameOf(at);
  const u = unitOf(at);
  const wide = W2 / H2 >= 1.4;
  const banner = W2 / H2 >= 2.4;
  const portrait = !wide;
  const inset = portrait ? W2 * 0.059 : Math.min(W2, H2) * 0.075;
  const foot = portrait ? H2 * 0.1 : H2 * 0.14;
  const textX = (inset + (portrait ? W2 * 0.045 : inset * 0.75)) / W2;
  const hd = portrait ? W2 * 0.056 : banner ? H2 * 0.085 : H2 * 0.068;
  const note = Math.max(9, portrait ? W2 * 0.0112 : H2 * 0.0175);
  const nodePx = portrait ? W2 * 0.02 : H2 * 0.028;
  const lockPx = portrait ? W2 * 0.034 : H2 * 0.052;
  const right = portrait ? W2 * 0.045 : inset;
  const lockBR = { logo: true, logoSize: lockPx / u, logoAnchor: "right", logoX: (W2 - right) / W2, logoY: (H2 - foot / 2 - lockPx / 2) / H2 };
  const hp = {
    size: at.size,
    w: W2,
    h: H2,
    grain: 100,
    align: "left",
    textX,
    textY: (inset + hd * 0.72) / H2,
    textSize: hd / u,
    textWidth: portrait ? 0.7 : 0.52,
    textFit: portrait ? 0.24 : 0.36,
    leading: 1.16,
    hideWords: false,
    noteX: textX,
    noteY: 0.4,
    note2X: (W2 - right) / W2,
    note2Y: 0.4,
    note2Right: true,
    noteWidth: portrait ? 0.18 : 0.17,
    noteSize: note / u,
    art: "none",
    artX: 0.5,
    artY: 1.4,
    artSize: 0.8,
    artTilt: 20,
    artNodes: 6,
    nodeSize: nodePx / u,
    artRing: false,
    artPole: false,
    rules: true,
    ruleTop: true,
    ruleBottom: true,
    ruleLeft: true,
    ruleInset: inset / u,
    ruleFoot: foot / u,
    loaderX: 0.08,
    loaderY: 0.66,
    loaderW: 0.84,
    logo: false,
    logoX: 0.033,
    logoY: 0.863,
    logoSize: 24,
    logoAnchor: "left",
    foot: false,
    footSize: 20,
    footInset: W2 * 0.05 / u,
    footTracking: 260,
    minText: 10
  };
  const dome = (top, r, cx = 0.5) => ({ artX: cx, artSize: r, artY: top + r * W2 * 1.035 / H2 });
  const footLine = { foot: true, footTracking: 260, footSize: (portrait ? W2 * 0.016 : H2 * 0.0135) / u, footInset: (portrait ? W2 * 0.06 : W2 * 0.05) / u };
  switch (t) {
    case "globe":
      return { ...hp, ...lockBR, noteY: portrait ? 0.272 : 0.4, art: "globe", artTilt: 16, ...dome(portrait ? 0.4 : 0.47, portrait ? 1.06 : 0.62, 0.54) };
    case "cube":
      return { ...hp, ...lockBR, noteY: portrait ? 0.45 : 0.42, note2Y: portrait ? 0.81 : 0.66, note2Right: false, note2X: textX, art: "cube", artX: portrait ? 0.73 : 0.7, artY: portrait ? 1.04 : 1.1, artSize: portrait ? 0.54 : 0.26, artNodes: 5 };
    case "horizon":
      return { ...hp, rules: false, align: "center", textX: 0.5, textY: portrait ? 0.14 : 0.18, textWidth: portrait ? 0.82 : 0.44, textSize: (portrait ? W2 * 0.07 : H2 * 0.062) / u, art: "globe", artTilt: portrait ? 34 : 26, artRing: true, artPole: true, artNodes: 6, ...dome(portrait ? 0.42 : 0.48, portrait ? 0.92 : 0.75), ...footLine };
    case "banner":
      return portrait ? { ...hp, ruleTop: false, ruleLeft: false, textY: 0.66, noteY: 0.86, noteWidth: 0.6, art: "globe", artTilt: 22, artX: 0.5, artY: 0.28, artSize: 0.3, artNodes: 3 } : { ...hp, ruleTop: false, ruleLeft: false, ruleFoot: H2 * 0.125 / u, textX: 0.655, textY: banner ? 0.31 : 0.3, textWidth: 0.32, textFit: 0.56, noteX: 0.655, noteY: 0.6, noteWidth: 0.3, art: "globe", artTilt: 22, artX: 0.2, artY: 0.5, artSize: banner ? 0.17 : 0.24, artNodes: 2 };
    case "loader":
      return { ...hp, ...lockBR, noteY: portrait ? 0.272 : 0.4, art: "loader", loaderX: textX, loaderY: portrait ? 0.56 : 0.68, loaderW: 1 - textX - right / W2 };
    case "logo": {
      const lw = (portrait ? 0.62 : 0.4) * W2;
      const lh = lw / logoRatio();
      return { ...hp, rules: false, hideWords: true, logo: true, logoSize: lh / u, logoAnchor: "center", logoX: 0.5, logoY: 0.3 - lh / 2 / H2, art: "globe", artTilt: portrait ? 34 : 26, artRing: true, artPole: true, ...dome(portrait ? 0.5 : 0.56, portrait ? 0.92 : 0.75), ...footLine };
    }
    case "partner": {
      const lh = portrait ? W2 * 0.07 : H2 * 0.085;
      return { ...hp, rules: false, align: "center", textX: 0.5, textY: portrait ? 0.3 : 0.36, textWidth: portrait ? 0.8 : 0.5, textSize: (portrait ? W2 * 0.05 : H2 * 0.052) / u, textFit: 0.2, logo: true, logoSize: lh / u, logoAnchor: "center", logoX: 0.5, logoY: 0.16, art: "globe", artTilt: 26, artRing: true, artPole: true, artNodes: 5, ...dome(portrait ? 0.56 : 0.62, portrait ? 0.92 : 0.75), ...footLine };
    }
  }
}
function designFor(t, size = "og", dims) {
  const doc6 = imageDoc();
  const s = doc6.sizes[size];
  const at = { size, w: dims?.w ?? s?.w ?? 1200, h: dims?.h ?? s?.h ?? 630 };
  const copy = doc6.templates[t].copy;
  return {
    ...layoutFor(t, at),
    template: t,
    theme: "light",
    lockup: "accent",
    headline: copy.headline ?? "",
    note: copy.note ?? "",
    note2: copy.note2 ?? "",
    footLeft: doc6.foot.left,
    footRight: doc6.foot.right,
    partnerName: copy.partnerName ?? "",
    progress: Number(copy.progress ?? 58),
    loaderLabel: copy.loaderLabel ?? "Loading",
    seed: 3,
    shade: 0
  };
}
function colorsOf(theme) {
  const t = imageDoc().themes[pick("theme", theme, themeNames())];
  const m = t.mode;
  return { bg: tokenColor(t.bg, m), ink: tokenColor(t.ink, m), muted: tokenColor(t.muted, m), line: tokenAlpha(t.line[0], t.line[1], m), grid: tokenAlpha(t.grid[0], t.grid[1], m), node: tokenColor(t.node, m), dark: m === "dark" };
}
function parseLine(line) {
  const out = [];
  let hi = false;
  const STAR = "\0";
  const parts = line.replaceAll("\\*", STAR).split("*");
  parts.forEach((chunk2, i) => {
    if (i > 0)
      hi = !hi;
    for (const b of chunk2.split(/\s+/))
      if (b)
        out.push({ text: b.replaceAll(STAR, "*"), hi });
  });
  return out;
}
function wrapWords(ctx, words, max) {
  const space = ctx.measureText(" ").width;
  const lines = [];
  let cur = [];
  let w = 0;
  for (const wd of words) {
    const ww = ctx.measureText(wd.text).width;
    const add2 = cur.length ? space + ww : ww;
    if (cur.length && w + add2 > max) {
      lines.push({ words: cur, w });
      cur = [wd];
      w = ww;
    } else {
      cur.push(wd);
      w += add2;
    }
  }
  if (cur.length || !lines.length)
    lines.push({ words: cur, w });
  return lines;
}
function baselineIn(ctx, lineTop, size, lh) {
  const m = ctx.measureText("Hg");
  const asc = m.fontBoundingBoxAscent || size * 0.9;
  const desc = m.fontBoundingBoxDescent || size * 0.22;
  return lineTop + (size * lh - (asc + desc)) / 2 + asc;
}
function drawWords(ctx, d, size, ink, accent, fonts2, dry = false) {
  const { w: W2, h: H2 } = frameOf(d);
  const maxW = d.textWidth * W2;
  const ax = d.textX * W2;
  let y = d.textY * H2;
  const top = y;
  const xFor = (w) => d.align === "left" ? ax : ax - w / 2;
  ctx.font = `300 ${size}px ${fonts2.display}`;
  ctx.letterSpacing = "0px";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  const lines = d.headline.split("\n").flatMap((l) => wrapWords(ctx, parseLine(l), maxW));
  const space = ctx.measureText(" ").width;
  let widest = 0;
  for (const line of lines) {
    let x = xFor(line.w);
    widest = Math.max(widest, line.w);
    if (!dry) {
      const base = baselineIn(ctx, y, size, d.leading);
      line.words.forEach((wd, i) => {
        ctx.fillStyle = wd.hi ? accent : ink;
        ctx.fillText(wd.text, x, base);
        x += ctx.measureText(wd.text).width + (i < line.words.length - 1 ? space : 0);
      });
    }
    y += size * d.leading;
  }
  return { x: xFor(widest), y: top, w: widest, h: y - top };
}
function fittedSize(ctx, d, u, fonts2) {
  const H2 = frameOf(d).h;
  let size = d.textSize * u;
  if (d.textFit <= 0)
    return size;
  const limit = d.textFit * H2 - d.textY * H2;
  if (limit <= 0)
    return size * 0.4;
  for (let i = 0; i < 6; i++) {
    const r = drawWords(ctx, d, size, "#000", "#000", fonts2, true);
    if (r.h <= limit + 0.5)
      break;
    size = Math.max(d.textSize * u * 0.4, size * Math.max(0.6, Math.min(0.98, limit / r.h)));
  }
  return size;
}
function drawLockup(ctx, d, u, C, fonts2, partner, draw = true) {
  if (!d.logo)
    return null;
  const { w: W2, h: H2 } = frameOf(d);
  const lh = d.logoSize * u;
  const lw = lh * logoRatio();
  const pname = d.partnerName.trim();
  const hasPartner = d.template === "partner" && (!!partner || !!pname);
  const gap = 74 / 304 * lh;
  const times = 46 / 304 * lh;
  let pw = 0;
  let ph = lh * 0.82;
  if (hasPartner && partner) {
    pw = ph * partner.width / Math.max(1, partner.height);
    if (pw > lw * 1.6) {
      pw = lw * 1.6;
      ph = pw * partner.height / Math.max(1, partner.width);
    }
  } else if (hasPartner) {
    ctx.font = `400 ${lh * 0.62}px ${fonts2.display}`;
    ctx.letterSpacing = "0px";
    pw = ctx.measureText(pname).width;
  }
  const total = hasPartner ? lw + gap * 2 + times + pw : lw;
  const x = d.logoAnchor === "left" ? d.logoX * W2 : d.logoAnchor === "center" ? d.logoX * W2 - total / 2 : d.logoX * W2 - total;
  const y = d.logoY * H2;
  if (draw) {
    drawLogo(ctx, x, y, lh, d.lockup === "ink" ? C.ink : C.node, C.ink);
    if (hasPartner) {
      const cy = y + lh / 2;
      const cx = x + lw + gap + times / 2;
      ctx.save();
      ctx.strokeStyle = C.ink;
      ctx.globalAlpha = 0.55;
      ctx.lineWidth = 6 / 304 * lh;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(cx - times / 2, cy - times / 2);
      ctx.lineTo(cx + times / 2, cy + times / 2);
      ctx.moveTo(cx + times / 2, cy - times / 2);
      ctx.lineTo(cx - times / 2, cy + times / 2);
      ctx.stroke();
      ctx.restore();
      const px = cx + times / 2 + gap;
      if (partner)
        ctx.drawImage(partner.canvas, px, cy - ph / 2, pw, ph);
      else {
        ctx.fillStyle = C.ink;
        ctx.textBaseline = "middle";
        ctx.textAlign = "left";
        ctx.font = `400 ${lh * 0.62}px ${fonts2.display}`;
        ctx.fillText(pname, px, cy + lh * 0.03);
      }
    }
  }
  return { x, y, w: total, h: lh };
}
function drawFoot(ctx, d, u, W2, H2, ink, fonts2) {
  const fs = Math.max(d.footSize * u, d.minText * u * 0.8);
  const inset = d.footInset * u;
  const mid = H2 - inset - fs * 0.5;
  const track = d.footTracking / 1e3 * fs;
  ctx.save();
  ctx.fillStyle = ink;
  ctx.font = `400 ${fs}px ${fonts2.mono}`;
  ctx.letterSpacing = `${track}px`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  if (d.footLeft.trim())
    ctx.fillText(d.footLeft.toUpperCase(), inset, mid);
  ctx.textAlign = "right";
  if (d.footRight.trim())
    ctx.fillText(d.footRight.toUpperCase(), W2 - inset + track, mid);
  ctx.restore();
  ctx.letterSpacing = "0px";
}
function artBox(d) {
  const { w: W2, h: H2 } = frameOf(d);
  const u = unitOf(d);
  const rulesOn = d.rules && (d.ruleTop || d.ruleBottom || d.ruleLeft);
  const top = rulesOn && d.ruleTop ? d.ruleInset * u : 0;
  const left = rulesOn && d.ruleLeft ? d.ruleInset * u : 0;
  const bottom = rulesOn && d.ruleBottom ? H2 - d.ruleFoot * u : H2;
  let r;
  if (d.art === "globe") {
    const rad = d.artSize * W2 * 1.04;
    r = { x: d.artX * W2 - rad, y: d.artY * H2 - rad, w: rad * 2, h: rad * 2 };
  } else if (d.art === "cube") {
    const e = d.artSize * W2;
    r = { x: d.artX * W2 - e, y: d.artY * H2 - e * 2.2, w: e * 2, h: e * 2.35 };
  } else
    return null;
  const x0 = Math.max(left, r.x);
  const y0 = Math.max(top, r.y);
  const x1 = Math.min(W2, r.x + r.w);
  const y1 = Math.min(bottom, r.y + r.h);
  return x1 - x0 > 4 && y1 - y0 > 4 ? { x: x0, y: y0, w: x1 - x0, h: y1 - y0 } : null;
}
function drawDesign(ctx, d, fonts2, opts = {}) {
  const { w: W2, h: H2 } = frameOf(d);
  const u = unitOf(d);
  const C = colorsOf(d.theme);
  const motion = opts.motion ?? {};
  ctx.save();
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, W2, H2);
  const size = fittedSize(ctx, d, u, fonts2);
  const laid = d.hideWords ? { x: 0, y: 0, w: 0, h: 0 } : drawWords(ctx, d, size, C.ink, C.node, fonts2, true);
  if (!opts.svg)
    drawGrain(ctx, d.grain, C.dark);
  const noteFs = Math.max(d.noteSize * u, 9);
  const nw = d.noteWidth * W2;
  const notes = d.hideWords ? [] : [drawNote(ctx, d.note, d.noteX * W2, d.noteY * H2, nw, noteFs, fonts2.mono, "#000", true, true), drawNote(ctx, d.note2, d.note2Right ? d.note2X * W2 - nw : d.note2X * W2, d.note2Y * H2, nw, noteFs, fonts2.mono, "#000", true, true)];
  const lockAt = drawLockup(ctx, d, u, C, fonts2, opts.partner ?? null, false);
  const avoid = [laid, ...notes.filter((r) => r.w), ...lockAt ? [lockAt] : [], ...opts.keep ?? []];
  if (d.foot) {
    const ffs = Math.max(d.footSize * u, d.minText * u * 0.8);
    avoid.push({ x: 0, y: H2 - d.footInset * u - ffs * 2.2, w: W2, h: ffs * 2.6 + d.footInset * u });
  }
  const rulesOn = d.rules && (d.ruleTop || d.ruleBottom || d.ruleLeft);
  const ri = d.ruleInset * u;
  const rf = d.ruleFoot * u;
  const bottom = rulesOn && d.ruleBottom ? H2 - rf : H2;
  const art = artBox(d);
  let loader = null;
  if (opts.picture && art) {
    const p = opts.picture;
    const k = Math.max(art.w / p.width, art.h / p.height);
    ctx.save();
    ctx.beginPath();
    ctx.rect(art.x, art.y, art.w, art.h);
    ctx.clip();
    ctx.drawImage(p.canvas, art.x + (art.w - p.width * k) / 2, art.y + (art.h - p.height * k) / 2, p.width * k, p.height * k);
    if (d.shade > 0) {
      ctx.fillStyle = tokenAlpha("bg-dark", Math.min(0.92, d.shade / 100), "dark");
      ctx.fillRect(art.x, art.y, art.w, art.h);
    }
    ctx.restore();
    drawCorners(ctx, art, 16 * u, Math.max(1, u), C.ink);
  } else if (d.art === "globe" || d.art === "cube") {
    ctx.save();
    if (rulesOn) {
      ctx.beginPath();
      const top = d.ruleTop ? ri : 0;
      const left = d.ruleLeft ? ri : 0;
      ctx.rect(left, top, W2 - left, bottom - top);
      ctx.clip();
    }
    if (d.art === "globe")
      drawGlobe(ctx, { cx: d.artX * W2, cy: d.artY * H2, r: d.artSize * W2, tilt: d.artTilt, seed: d.seed, nodes: d.artNodes, nodeSize: d.nodeSize, ring: d.artRing, pole: d.artPole }, u, W2, bottom, C.grid, C.node, C.bg, avoid, motion);
    else
      drawCube(ctx, { x: d.artX * W2, y: d.artY * H2, size: d.artSize * W2, seed: d.seed, nodes: d.artNodes, nodeSize: d.nodeSize }, u, W2, bottom, C.grid, C.node, C.bg, avoid, motion);
    ctx.restore();
  }
  if (rulesOn)
    drawRules(ctx, u, W2, H2, ri, rf, { top: d.ruleTop, bottom: d.ruleBottom, left: d.ruleLeft }, C.grid, motion.march ?? 0);
  if (d.art === "loader")
    loader = drawLoader(ctx, d.loaderX * W2, d.loaderY * H2, d.loaderW * W2, d.progress, d.loaderLabel, fonts2.mono, C.ink, C.node, C.bg, motion);
  const text = d.hideWords ? { x: d.textX * W2, y: d.textY * H2, w: 0, h: 0 } : drawWords(ctx, d, size, C.ink, C.node, fonts2);
  if (!d.hideWords) {
    if (notes[0])
      drawNote(ctx, d.note, notes[0].x, notes[0].y, nw, noteFs, fonts2.mono, C.ink);
    if (notes[1])
      drawNote(ctx, d.note2, notes[1].x, notes[1].y, nw, noteFs, fonts2.mono, C.ink);
  }
  const logo = drawLockup(ctx, d, u, C, fonts2, opts.partner ?? null, true);
  if (d.foot)
    drawFoot(ctx, d, u, W2, H2, C.ink, fonts2);
  ctx.restore();
  const footFs = Math.max(d.footSize * u, d.minText * u * 0.8);
  return {
    text,
    notes: notes.filter((n) => n.w && n.h),
    logo,
    art,
    loader,
    foot: d.foot ? { x: 0, y: H2 - d.footInset * u - footFs * 1.4, w: W2, h: footFs * 1.8 } : null,
    frame: { w: W2, h: H2 }
  };
}

// dist/assets/image.js
function imageSizes() {
  return Object.entries(imageDoc().sizes).map(([id, s]) => ({ id, group: s.group, label: s.label, width: s.w, height: s.h, aliases: s.aliases ?? [] }));
}
function sizeId(typed) {
  const t = typed.trim().toLowerCase();
  if (t === "custom")
    return "custom";
  const hit = imageSizes().find((s) => s.id === t || s.aliases.includes(t));
  if (!hit)
    throw unknown("size", typed, [...imageSizes().map((s) => s.id), "custom"]);
  return hit.id;
}
function designOf(req) {
  const template = pick("template", req.template, TEMPLATES);
  const size = req.size ? sizeId(req.size) : "og";
  if (size === "custom" && (!req.width || !req.height))
    throw new Error("A custom size needs --width and --height (160 to 4000).");
  if (size !== "custom" && (req.width || req.height))
    throw new Error(`--width and --height go with --size custom, not ${size}.`);
  const dims = size === "custom" ? { w: clampDim(req.width), h: clampDim(req.height) } : void 0;
  const set = Object.fromEntries(Object.entries(req.set ?? {}).filter(([, v]) => v !== void 0));
  const d = { ...designFor(template, size, dims), ...set };
  d.theme = pick("theme", d.theme, themeNames());
  d.lockup = pick("lockup", d.lockup, lockupNames().filter((l) => l !== "mark"));
  return d;
}
function renderDesign(d, pictures = {}, opts = { png: true }) {
  if (pictures.picture && !imageDoc().templates[d.template].picture)
    throw new Error(`The ${d.template} template holds no picture; --image goes with ${TEMPLATES.filter((t) => imageDoc().templates[t].picture).join(", ")}.`);
  const L = frameOf(d);
  const scale = opts.scale ?? 1;
  const out = { width: Math.round(L.w * scale), height: Math.round(L.h * scale) };
  if (opts.png !== false) {
    const s = surface(L.w, L.h, { scale });
    drawDesign(s.ctx, d, brandFonts(), { ...pictures, motion: opts.motion });
    out.png = toPng(s, { opaque: true });
  }
  if (opts.svg) {
    const s = surface(L.w, L.h, { svg: true });
    drawDesign(s.ctx, d, brandFonts(), { ...pictures, svg: true, motion: opts.motion });
    out.svg = toSvg(s);
  }
  return out;
}
function slotsOf(t) {
  switch (t) {
    case "globe":
    case "cube":
      return ["headline", "note", "note2"];
    case "banner":
      return ["headline", "note"];
    case "horizon":
      return ["headline", "foot-left", "foot-right"];
    case "loader":
      return ["headline", "note", "progress", "loader-label"];
    case "logo":
      return ["foot-left", "foot-right"];
    case "partner":
      return ["headline", "partner-name", "foot-left", "foot-right"];
  }
}
function imageCatalog() {
  const doc6 = imageDoc();
  return {
    templates: TEMPLATES.map((id) => ({ id, name: doc6.templates[id].label, description: doc6.templates[id].description, slots: slotsOf(id), picture: doc6.templates[id].picture ? "image (any picture, in the drawing's place)" : "none", partner: id === "partner" ? "partner (a logo file, only when passed)" : void 0 })),
    sizes: [...imageSizes(), { id: "custom", group: "custom", label: "Custom", width: 0, height: 0, aliases: [], note: "--width and --height, 160 to 4000" }],
    social: doc6.social,
    themes: Object.entries(doc6.themes).map(([id, t]) => ({ id, label: t.label, description: t.description })),
    lockups: lockupNames().filter((l) => l !== "mark"),
    notes: doc6.notes
  };
}

// dist/assets/deck.js
import { readFileSync as readFileSync6 } from "node:fs";
var doc3;
var deckDoc = () => doc3 ??= JSON.parse(readFileSync6(pkgPath("brand", "assets", "deck.json"), "utf8"));
var slideTypes = () => Object.keys(deckDoc().slides);
function deckCatalog() {
  const d = deckDoc();
  return {
    size: { width: d.width, height: d.height },
    slides: slideTypes().map((id) => ({ id, name: d.slides[id].name, from: d.slides[id].from, description: d.slides[id].description, theme: d.slides[id].theme, slots: d.slides[id].slots })),
    themes: themeNames()
  };
}
var RESERVED = ["type", "theme", "seed", "picture", "image"];
function slotsFor(type, given) {
  const def = deckDoc().slides[type].slots;
  const out = { ...def };
  for (const [k, v] of Object.entries(given)) {
    if (RESERVED.includes(k))
      continue;
    if (!(k in def))
      throw new Error(`A ${type} slide does not take "${k}". It takes ${Object.keys(def).map((s) => `"${s}"`).join(", ")}.`);
    if (Array.isArray(v) && v.every((x) => typeof x === "string"))
      out[k] = v.join(" | ");
    else if (typeof v === "string")
      out[k] = v;
    else
      throw new Error(`A ${type} slide's "${k}" takes text.`);
  }
  return out;
}
var W = 1920;
var H = 1080;
function drawSlide(ctx, slide, fonts2 = brandFonts(), opts = {}) {
  const type = pick("slide type", slide.type, slideTypes());
  const def = deckDoc().slides[type];
  const s = slotsFor(type, slide);
  const theme = slide.theme ? pick("theme", slide.theme, themeNames()) : def.theme;
  const C = colorsOf(theme);
  const base = (over) => ({ ...designFor(def.from, "custom", { w: W, h: H }), theme, ...slide.seed ? { seed: slide.seed } : {}, ...over });
  const u = unitOf({ size: "custom", w: W, h: H });
  const draw = (d, keep = [], picture = null) => drawDesign(ctx, d, fonts2, { svg: opts.svg, keep, picture });
  const headSize = (d) => d.textSize * u;
  switch (type) {
    case "cover":
      draw(base({ headline: s.title ?? "", note: s.body ?? "", note2: s.note2 ?? "" }));
      break;
    case "image":
      draw(base({ headline: s.title ?? "", note: s.body ?? "", note2: "" }), [], slide.picture ?? null);
      break;
    case "statement":
      draw(base({ headline: s.title ?? "" }));
      break;
    case "end":
      draw(base({ footLeft: s.url ?? "", footRight: s.tagline ?? "" }));
      break;
    case "section": {
      const d0 = base({ headline: s.title ?? "", note: "", note2: "" });
      const numSize = headSize(d0) * 0.42;
      const numTop = d0.textY * H;
      const d = { ...d0, textY: (numTop + numSize * 2.2) / H };
      const num2 = (s.number ?? "").trim();
      draw(d, num2 ? [{ x: d.textX * W, y: numTop, w: numSize * 4, h: numSize * 1.6 }] : []);
      if (num2)
        drawNote(ctx, num2, d.textX * W, numTop, W * 0.3, numSize, fonts2.mono, C.muted, false);
      break;
    }
    case "bullets": {
      const items = (s.items ?? "").split("|").map((x2) => x2.trim()).filter(Boolean);
      if (items.length > 6)
        throw new Error(`A bullets slide holds up to 6 points; it was given ${items.length}. Split it.`);
      const d = base({ headline: s.title ?? "", art: "none", note: "", note2: "" });
      const x = d.textX * W;
      const top = d.textY * H + headSize(d) * d.leading * 2 + 40 * u;
      const bottom = H - d.ruleFoot * u - 40 * u;
      const colW = W * 0.62;
      const size = Math.min(headSize(d) * 0.64, (bottom - top) / Math.max(1, items.length) / 1.9);
      const style = { family: fonts2.display, weight: 300, size, tracking: 0, leading: 1.25, color: C.ink };
      const fitted = items.map((it) => fit(ctx, it, style, colW - size * 1.6, 2, 0.7, "point"));
      const step = Math.min(size * 2.6, (bottom - top) / Math.max(1, items.length));
      draw(d);
      fitted.forEach((f, i) => {
        const y = top + i * step;
        drawNode(ctx, x + size * 0.36, y + f.style.size * 0.62, size * 0.3, C.node, C.bg, Math.PI / 6);
        drawFitted(ctx, f, x + size * 1.2, y);
      });
      break;
    }
    case "stat": {
      const d0 = base({ headline: "", note: "", note2: "" });
      const x = d0.textX * W;
      const statSize = headSize(d0) * 2.6;
      const top = d0.textY * H;
      const stat = fit(ctx, s.stat ?? "", { family: fonts2.display, weight: 300, size: statSize, tracking: -0.02, leading: 1, color: C.ink }, W * 0.3, 1, 0.5, "stat");
      const title = s.title ? fit(ctx, s.title, { family: fonts2.display, weight: 300, size: headSize(d0), tracking: 0, leading: 1.16, color: C.ink }, W * 0.3, 3, 0.6, "title") : void 0;
      const titleTop = top + stat.height + 24 * u;
      const noteTop = titleTop + (title?.height ?? 0) + 40 * u;
      const noteFs = Math.max(d0.noteSize * u, 9);
      const keep = [{ x, y: top, w: stat.width, h: stat.height }];
      if (title)
        keep.push({ x, y: titleTop, w: title.width, h: title.height });
      if (s.body)
        keep.push({ x, y: noteTop, w: W * 0.3, h: noteFs * 6 });
      draw(d0, keep);
      drawFitted(ctx, stat, x, top);
      if (title)
        drawFitted(ctx, title, x, titleTop);
      if (s.body)
        drawNote(ctx, s.body, x, noteTop, W * 0.28, noteFs, fonts2.mono, C.ink);
      break;
    }
    case "quote": {
      const d = base({ headline: "", hideWords: true, art: "none", note: "", note2: "" });
      const x = d.textX * W;
      const top = d.textY * H;
      const q = fit(ctx, `\u201C${s.quote ?? ""}\u201D`, { family: fonts2.display, weight: 300, size: headSize(d) * 1.1, tracking: 0, leading: 1.16, color: C.ink }, W * 0.66, 5, 0.5, "quote");
      draw(d);
      drawFitted(ctx, q, x, top);
      if (s.attribution)
        drawNote(ctx, s.attribution, x, top + q.height + 48 * u, W * 0.5, Math.max(d.noteSize * u * 1.2, 9), fonts2.mono, C.muted, false);
      break;
    }
  }
}
function renderSlide(slide, opts = { png: true }) {
  const out = { width: W * (opts.scale ?? 1), height: H * (opts.scale ?? 1) };
  if (opts.png !== false) {
    const s = surface(W, H, { scale: opts.scale ?? 1 });
    drawSlide(s.ctx, slide);
    out.png = toPng(s, { opaque: true });
    const px = pixelsOf(s).data;
    const rgb = Buffer.alloc(px.length / 4 * 3);
    for (let i = 0, j = 0; i < px.length; i += 4, j += 3) {
      rgb[j] = px[i];
      rgb[j + 1] = px[i + 1];
      rgb[j + 2] = px[i + 2];
    }
    out.rgb = rgb;
  }
  if (opts.svg) {
    const s = surface(W, H, { svg: true });
    drawSlide(s.ctx, slide, brandFonts(), { svg: true });
    out.svg = toSvg(s);
  }
  return out;
}

// dist/assets/merch.js
import { readFileSync as readFileSync7 } from "node:fs";
var PX_PER_IN = 300;
var doc4;
var merchDoc = () => doc4 ??= JSON.parse(readFileSync7(pkgPath("brand", "assets", "merch.json"), "utf8"));
var merchItems = () => merchDoc().items;
var findItem = (id) => {
  const name = pick("item", id, merchItems().map((i) => i.id));
  return merchItems().find((i) => i.id === name);
};
function merchCatalog() {
  return {
    items: merchItems().map((i) => ({
      id: i.id,
      name: i.name,
      trim: { width: i.size[0], height: i.size[1], unit: "in" },
      bleed: i.bleed,
      safe: i.safe,
      method: i.method,
      variants: i.variants,
      pixels: { width: Math.round((i.size[0] + 2 * i.bleed) * PX_PER_IN), height: Math.round((i.size[1] + 2 * i.bleed) * PX_PER_IN), dpi: PX_PER_IN },
      dieCut: Boolean(i.cut),
      slots: [...new Set(i.layers.flatMap((l) => l.type === "text" ? [l.slot] : []))],
      picture: i.layers.some((l) => l.type === "art" && l.picture),
      source: i.source
    })),
    variants: Object.entries(merchDoc().variants).map(([id, v]) => ({ id, ...v })),
    note: "Sizes are common vendor print areas (conventions, not a standard): confirm with the vendor template before ordering."
  };
}
function variantColors(v) {
  if (v.one) {
    const c2 = tokenColor(v.one, v.mode ?? "light");
    return { bg: "rgba(0, 0, 0, 0)", ink: c2, muted: c2, line: c2, grid: tokenAlpha(v.one, 0.85, v.mode ?? "light"), node: c2, dark: v.mode === "dark", mark: c2 };
  }
  const c = colorsOf(v.theme);
  return { ...c, mark: c.node };
}
function drawItem(ctx, item, req = {}) {
  const variant = pick(`variant for ${item.id}`, req.variant ?? item.variants[0], item.variants);
  const v = merchDoc().variants[variant];
  const c = variantColors(v);
  const o = item.bleed * PX_PER_IN;
  const W2 = (item.size[0] + 2 * item.bleed) * PX_PER_IN;
  const H2 = (item.size[1] + 2 * item.bleed) * PX_PER_IN;
  const px = (b) => ({ x: b[0] * PX_PER_IN + o, y: b[1] * PX_PER_IN + o, w: b[2] * PX_PER_IN, h: b[3] * PX_PER_IN });
  const takes = new Set(item.layers.flatMap((l) => l.type === "text" ? [l.slot] : []));
  for (const k of Object.keys(req.slots ?? {}))
    if (!takes.has(k))
      throw new Error(`${item.id} does not draw --${k}.${takes.size ? ` It takes ${[...takes].map((s) => `--${s}`).join(", ")}.` : " It takes no text."}`);
  if (req.picture && !item.layers.some((l) => l.type === "art" && l.picture))
    throw new Error(`${item.id} holds no picture; --image goes with ${merchItems().filter((i) => i.layers.some((l) => l.type === "art" && l.picture)).map((i) => i.id).join(", ")}.`);
  const slots = { ...merchDoc().slots, ...req.slots };
  const fonts2 = brandFonts();
  const u = PX_PER_IN / 100;
  if (v.ground) {
    ctx.fillStyle = c.bg;
    ctx.fillRect(0, 0, W2, H2);
  }
  const keep = [];
  const texts = [];
  for (const l of item.layers) {
    if (l.type === "logo")
      keep.push(px(l.box));
    else if (l.type === "text") {
      const b = px(l.box);
      const value = slots[l.slot] ?? "";
      if (!value.trim())
        continue;
      const style = l.face === "mono" ? { family: fonts2.mono, weight: 400, size: l.size * PX_PER_IN, tracking: 0.08, leading: 1.4, color: c.ink, caps: true } : { family: fonts2.display, weight: 300, size: l.size * PX_PER_IN, tracking: 0, leading: 1.16, color: c.ink };
      const f = fit(ctx, value, style, b.w, l.maxLines ?? 2, 0.6, `${item.id} ${l.slot}`);
      texts.push({ f, box: b });
      keep.push({ x: b.x, y: b.y, w: f.width, h: f.height });
    }
  }
  const hole = v.ground ? c.bg : CUT;
  for (const l of item.layers) {
    if (l.type === "rules") {
      const b = px(l.box);
      const inset = Math.min(b.w, b.h) * 0.075;
      ctx.save();
      ctx.translate(b.x, b.y);
      drawRules(ctx, u, b.w, b.h, inset, Math.min(b.w, b.h) * 0.14, { top: true, bottom: true, left: true }, c.grid);
      ctx.restore();
    } else if (l.type === "art") {
      const b = px(l.box);
      if (l.picture && req.picture) {
        const p = req.picture;
        const k = Math.max(b.w / p.width, b.h / p.height);
        ctx.save();
        ctx.beginPath();
        ctx.rect(b.x, b.y, b.w, b.h);
        ctx.clip();
        ctx.drawImage(p.canvas, b.x + (b.w - p.width * k) / 2, b.y + (b.h - p.height * k) / 2, p.width * k, p.height * k);
        ctx.restore();
        drawCorners(ctx, b, 0.16 * PX_PER_IN, 0.01 * PX_PER_IN, c.ink);
        continue;
      }
      ctx.save();
      ctx.beginPath();
      ctx.rect(b.x, b.y, b.w, b.h);
      ctx.clip();
      const seed = req.seed ?? l.seed;
      const nodeSize = Math.min(b.w, b.h) * 0.025 / u;
      if (l.art === "globe")
        drawGlobe(ctx, { cx: b.x + b.w / 2, cy: b.y + b.h * 0.98, r: b.w * 0.46, tilt: 26, seed, nodes: 5, nodeSize, ring: true, pole: true }, u, W2, b.y + b.h, c.grid, c.mark, hole, keep);
      else
        drawCube(ctx, { x: b.x + b.w * 0.5, y: b.y + b.h * 0.9, size: Math.min(b.w * 0.36, b.h * 0.36), seed, nodes: 4, nodeSize }, u, W2, b.y + b.h, c.grid, c.mark, hole, keep);
      ctx.restore();
    }
  }
  for (const l of item.layers) {
    if (l.type !== "logo")
      continue;
    const b = px(l.box);
    if (l.part === "mark") {
      const h = Math.min(b.h, b.w / markRatio());
      drawMark(ctx, b.x + (b.w - h * markRatio()) / 2, b.y + (b.h - h) / 2, h, c.mark);
    } else {
      const h = Math.min(b.h, b.w / logoRatio());
      drawLogo(ctx, b.x + (b.w - h * logoRatio()) / 2, b.y + (b.h - h) / 2, h, c.mark, c.ink);
    }
  }
  for (const t of texts)
    drawFitted(ctx, t.f, t.box.x, t.box.y, t.box.w);
  if (req.guides) {
    ctx.save();
    ctx.strokeStyle = tokenColor("orange");
    ctx.lineWidth = 3;
    if (item.bleed)
      ctx.strokeRect(o, o, item.size[0] * PX_PER_IN, item.size[1] * PX_PER_IN);
    const s = item.safe * PX_PER_IN;
    ctx.setLineDash([18, 12]);
    ctx.strokeRect(o + s, o + s, item.size[0] * PX_PER_IN - 2 * s, item.size[1] * PX_PER_IN - 2 * s);
    ctx.restore();
  }
  return { variant, width: W2, height: H2 };
}
function cutPath(item) {
  if (!item.cut)
    return "";
  const o = item.bleed * PX_PER_IN;
  const w = item.size[0] * PX_PER_IN;
  const h = item.size[1] * PX_PER_IN;
  const p = h / 2;
  const d = `M${o + p} ${o}H${o + w - p}L${o + w} ${o + h / 2}L${o + w - p} ${o + h}H${o + p}L${o} ${o + h / 2}Z`;
  return `<g id="CutContour"><path d="${d}" fill="none" stroke="#FF00FF" stroke-width="3"/></g>`;
}
function drawCut(ctx, item) {
  if (!item.cut)
    return;
  const o = item.bleed * PX_PER_IN;
  hexPill(ctx, o, o, item.size[0] * PX_PER_IN, item.size[1] * PX_PER_IN);
}
function renderItem(item, req = {}) {
  const widthIn = item.size[0] + 2 * item.bleed;
  const heightIn = item.size[1] + 2 * item.bleed;
  const W2 = Math.round(widthIn * PX_PER_IN);
  const H2 = Math.round(heightIn * PX_PER_IN);
  const dpi = req.dpi ?? PX_PER_IN;
  const out = { variant: "", width: Math.round(widthIn * dpi), height: Math.round(heightIn * dpi), widthIn, heightIn, dpi };
  if (req.png !== false) {
    const s = surface(W2, H2, { scale: dpi / PX_PER_IN });
    out.variant = drawItem(s.ctx, item, req).variant;
    if (req.guides && item.cut) {
      s.ctx.save();
      drawCut(s.ctx, item);
      s.ctx.strokeStyle = tokenColor("orange");
      s.ctx.lineWidth = 3;
      s.ctx.stroke();
      s.ctx.restore();
    }
    out.png = toPng(s, { dpi });
  }
  if (req.svg) {
    const s = surface(W2, H2, { svg: true });
    out.variant = drawItem(s.ctx, item, req).variant;
    out.svg = toSvg(s, { widthIn, heightIn }).replace(/<\/svg>\s*$/, `${cutPath(item)}</svg>
`);
  }
  return out;
}

// dist/assets/video.js
import { spawn, spawnSync } from "node:child_process";
import { mkdirSync as mkdirSync2, readFileSync as readFileSync8 } from "node:fs";
import { dirname as dirname3, join as join3 } from "node:path";
var doc5;
var videoDoc = () => doc5 ??= JSON.parse(readFileSync8(pkgPath("brand", "assets", "video.json"), "utf8"));
var videoTemplates = () => Object.keys(videoDoc().templates);
function hasFfmpeg() {
  if (process.env.DS_NO_FFMPEG)
    return false;
  return spawnSync("ffmpeg", ["-version"], { stdio: "ignore" }).status === 0;
}
function videoCatalog() {
  const d = videoDoc();
  return {
    templates: videoTemplates().map((id) => ({ id, ...d.templates[id] })),
    sizes: Object.entries(d.sizes).map(([id, [width, height]]) => ({ id, width, height })),
    fps: d.fps,
    curves: d.curves,
    themes: themeNames(),
    formats: ["mp4", "webm", "frames", "all"],
    encoder: "ffmpeg (H.264 MP4, VP9 WebM) when installed; otherwise PNG frames."
  };
}
function bezier([x1, y1, x2, y2]) {
  const at = (a, b, t) => 3 * a * (1 - t) ** 2 * t + 3 * b * (1 - t) * t ** 2 + t ** 3;
  return (x) => {
    if (x <= 0)
      return 0;
    if (x >= 1)
      return 1;
    let lo = 0;
    let hi = 1;
    for (let i = 0; i < 40; i++) {
      const mid = (lo + hi) / 2;
      if (at(x1, x2, mid) < x)
        lo = mid;
      else
        hi = mid;
    }
    return at(y1, y2, (lo + hi) / 2);
  };
}
var clamp01 = (n) => Math.max(0, Math.min(1, n));
function videoDesign(o) {
  const t = videoDoc().templates[pick("video template", o.template, videoTemplates())];
  const [w, h] = videoDoc().sizes[pick("size", o.size, Object.keys(videoDoc().sizes))];
  return { ...designFor(t.from, "custom", { w, h }), ...o.theme ? { theme: pick("theme", o.theme, themeNames()) } : {}, ...o.seed ? { seed: o.seed } : {}, ...o.set ?? {} };
}
function drawVideoFrame(ctx, o, time) {
  const v = videoDoc();
  const id = pick("video template", o.template, videoTemplates());
  const t = v.templates[id];
  const seconds = o.seconds ?? t.seconds;
  const d = videoDesign(o);
  const fonts2 = brandFonts();
  const march = Math.round(seconds / 8 * 2) * (time / seconds);
  const turnCurve = bezier(v.curves.turn);
  const beat = time / 4;
  const turn = (Math.floor(beat) + turnCurve(clamp01(beat % 1 / 0.15))) * (Math.PI / 3);
  if (id === "loader") {
    const fill = bezier(v.curves.fill)(clamp01(time / 1.2));
    const target = d.progress;
    drawDesign(ctx, { ...d, progress: Math.round((4 + (target - 4) * fill) * 10) / 10 }, fonts2, { motion: { march, turn } });
    return;
  }
  if (id === "logo") {
    drawDesign(ctx, { ...d, logo: false }, fonts2, { motion: { march, turn } });
    const { w: W2, h: H2 } = frameOf(d);
    const u = unitOf(d);
    const C = colorsOf(d.theme);
    const pop = bezier(v.curves.pop)(clamp01(time / 0.48));
    const lh = d.logoSize * u;
    const lw = lh * logoRatio();
    const x = d.logoX * W2 - lw / 2;
    const y = d.logoY * H2;
    ctx.save();
    ctx.globalAlpha = pop;
    ctx.translate(x + lw / 2, y + lh / 2);
    ctx.scale(0.92 + 0.08 * pop, 0.92 + 0.08 * pop);
    drawLogo(ctx, -lw / 2, -lh / 2, lh, d.lockup === "ink" ? C.ink : C.node, C.ink);
    ctx.restore();
    return;
  }
  drawDesign(ctx, d, fonts2, { motion: { march, turn } });
}
function* videoFrames(o) {
  const seconds = o.seconds ?? videoDoc().templates[o.template].seconds;
  const d = videoDesign(o);
  const { w, h } = frameOf(d);
  const count = Math.round(seconds * o.fps);
  for (let i = 0; i < count; i++) {
    const s = surface(w, h);
    drawVideoFrame(s.ctx, o, i / o.fps);
    yield { index: i, rgba: pixelsOf(s).data, png: () => toPng(s, { opaque: true }) };
  }
}
function videoStill(o, time) {
  const { w, h } = frameOf(videoDesign(o));
  const s = surface(w, h);
  drawVideoFrame(s.ctx, o, time);
  return { png: toPng(s, { opaque: true }), width: w, height: h };
}
async function encode(frames, o) {
  for (const out of o.outputs)
    mkdirSync2(dirname3(out.path), { recursive: true });
  const args = ["-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgba", "-s", `${o.width}x${o.height}`, "-r", String(o.fps), "-i", "-"];
  for (const out of o.outputs) {
    args.push("-map_metadata", "-1", "-fflags", "+bitexact", "-flags:v", "+bitexact");
    if (out.format === "mp4")
      args.push("-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-threads", "1", "-movflags", "+faststart", out.path);
    else
      args.push("-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "30", "-pix_fmt", "yuv420p", "-row-mt", "0", "-threads", "1", out.path);
  }
  const ff = spawn("ffmpeg", args, { stdio: ["pipe", "ignore", "pipe"] });
  let err = "";
  ff.stderr.on("data", (d) => err += d);
  const done = new Promise((res) => ff.on("close", (code2) => res(code2 ?? 1)));
  let closed = false;
  ff.stdin.on("error", () => closed = true);
  ff.on("close", () => closed = true);
  for (const f of frames) {
    if (closed)
      break;
    if (!ff.stdin.write(f))
      await Promise.race([new Promise((r) => ff.stdin.once("drain", r)), done]);
  }
  ff.stdin.end();
  const code = await done;
  if (code !== 0)
    throw new Error(`ffmpeg failed: ${err.trim() || `exit ${code}`}`);
  return o.outputs.map((x) => ({ path: x.path, format: x.format }));
}

// dist/assets/pdf.js
import { deflateSync as deflateSync2 } from "node:zlib";
function imagesToPdf(pages, pageWidthPt) {
  if (!pages.length)
    throw new Error("A PDF needs at least one page.");
  const objects = [];
  const add2 = (body) => {
    objects.push(typeof body === "string" ? Buffer.from(body, "latin1") : body);
    return objects.length;
  };
  add2("<< /Type /Catalog /Pages 2 0 R >>");
  add2("");
  const kids = [];
  for (const page of pages) {
    const ptW = pageWidthPt;
    const ptH = Math.round(pageWidthPt * page.height / page.width * 100) / 100;
    const data = deflateSync2(page.rgb, { level: 6 });
    const img = add2(Buffer.concat([Buffer.from(`<< /Type /XObject /Subtype /Image /Width ${page.width} /Height ${page.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode /Length ${data.length} >>
stream
`, "latin1"), data, Buffer.from("\nendstream", "latin1")]));
    const content = `q ${ptW} 0 0 ${ptH} 0 0 cm /Im0 Do Q`;
    const contents = add2(`<< /Length ${content.length} >>
stream
${content}
endstream`);
    kids.push(add2(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${ptW} ${ptH}] /Resources << /XObject << /Im0 ${img} 0 R >> >> /Contents ${contents} 0 R >>`));
  }
  objects[1] = Buffer.from(`<< /Type /Pages /Kids [${kids.map((k) => `${k} 0 R`).join(" ")}] /Count ${kids.length} >>`, "latin1");
  const parts = [Buffer.from("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n", "latin1")];
  const offsets = [];
  let at = parts[0].length;
  objects.forEach((body, i) => {
    const head = Buffer.from(`${i + 1} 0 obj
`, "latin1");
    const tail = Buffer.from("\nendobj\n", "latin1");
    offsets.push(at);
    parts.push(head, body, tail);
    at += head.length + body.length + tail.length;
  });
  const xref = [`xref
0 ${objects.length + 1}
0000000000 65535 f 
`, ...offsets.map((o) => `${String(o).padStart(10, "0")} 00000 n 
`)].join("");
  parts.push(Buffer.from(`${xref}trailer
<< /Size ${objects.length + 1} /Root 1 0 R >>
startxref
${at}
%%EOF
`, "latin1"));
  return Buffer.concat(parts);
}
export {
  PX_PER_IN,
  TEMPLATES,
  bezier,
  brandFonts,
  colorsOf,
  compactSvg,
  deckCatalog,
  designFor,
  designOf,
  display,
  drawCorners,
  drawCube,
  drawDesign,
  drawFitted,
  drawGlobe,
  drawGrain,
  drawItem,
  drawLoader,
  drawLogo,
  drawMark,
  drawNode,
  drawNote,
  drawRules,
  drawSlide,
  drawVideoFrame,
  drawWordmark,
  encode,
  encodePng,
  findItem,
  fit,
  frameOf,
  hasFfmpeg,
  hexPill,
  imageCatalog,
  imageDoc,
  imageSizes,
  imagesToPdf,
  layoutFor,
  lockupNames,
  logoRatio,
  markRatio,
  merchCatalog,
  merchItems,
  mulberry,
  num,
  pick,
  pictureFrom,
  pixelsOf,
  readPicture,
  renderDesign,
  renderItem,
  renderSlide,
  scratch,
  setFont,
  sizeId,
  slideTypes,
  suggest,
  surface,
  themeNames,
  toPng,
  toSvg,
  tokenAlpha,
  tokenColor,
  unknown,
  videoCatalog,
  videoFrames,
  videoStill,
  videoTemplates,
  wrap,
  write
};
