import { scratch, type Ctx } from './canvas.js';

// The brand's drawings, ported from its own social tool (agd-playground src/components/hoplite-og/scene.ts): a globe of
// thin dotted, dashed and solid circles; a wireframe cube cut into cells; the loader's bar; and on all of them the cog
// node, a hexagon in the mark color with a hexagon cut from its middle, lying flat on whatever surface it marks. Every
// drawing comes from a seed, so one seed always redraws the same drawing. Two additions for motion: `march` slides the
// dashes along their lines (the site's hero-globe-march) and `turn` rotates the nodes (the site's 60 degree cog turn).

export type Rect = { x: number; y: number; w: number; h: number };
/** A node hole color that cuts through to what is under it (print files on a transparent ground). */
export const CUT = 'cut';
export type LineStyle = 'dots' | 'dash' | 'long' | 'solid';
/** Motion state for a frame: `march` slides every dashed line by that many of its own dash periods (a whole number
 * over a loop meets the first frame again), `turn` rotates the nodes in radians (a sixth of a turn looks the same). */
export type Motion = { march?: number; turn?: number };

export function mulberry(seed: number) {
	let a = seed >>> 0 || 1;
	return () => {
		a |= 0;
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/** How each kind of line is stroked, at a unit u. */
function stroke(ctx: Ctx, style: LineStyle, u: number, color: string, alpha = 1, march = 0) {
	ctx.strokeStyle = color;
	ctx.globalAlpha = alpha;
	ctx.lineCap = style === 'dots' ? 'round' : 'butt';
	ctx.lineJoin = 'round';
	const period = style === 'dots' ? 5.2 : style === 'dash' ? 12.5 : style === 'long' ? 21 : 0;
	ctx.lineDashOffset = -march * period * u;
	if (style === 'dots') {
		ctx.lineWidth = Math.max(0.8, 1.7 * u);
		ctx.setLineDash([0.01, 5.2 * u]);
	} else if (style === 'dash') {
		ctx.lineWidth = Math.max(0.6, 1.25 * u);
		ctx.setLineDash([7 * u, 5.5 * u]);
	} else if (style === 'long') {
		ctx.lineWidth = Math.max(0.6, 1.25 * u);
		ctx.setLineDash([13 * u, 8 * u]);
	} else {
		ctx.lineWidth = Math.max(0.5, 0.9 * u);
		ctx.setLineDash([]);
		ctx.globalAlpha = alpha * 0.8;
	}
}

type V3 = [number, number, number];
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: V3): V3 => {
	const l = Math.hypot(a[0], a[1], a[2]) || 1;
	return [a[0] / l, a[1] / l, a[2] / l];
};

/** A cog node lying in a plane: center c, the plane's directions e1 (its points face along it) and e2, radius r. */
function nodeIn(ctx: Ctx, c: V3, e1: V3, e2: V3, r: number, to: (p: V3) => [number, number], fill: string, hole: string, turn = 0) {
	const ring = (k: number) =>
		Array.from({ length: 6 }, (_, i) => {
			const a = (i * Math.PI) / 3 + turn;
			return to(add(c, add(mul(e1, Math.cos(a) * r * k), mul(e2, Math.sin(a) * r * k))));
		});
	const path = (pts: [number, number][]) => {
		ctx.beginPath();
		pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
		ctx.closePath();
	};
	ctx.save();
	ctx.setLineDash([]);
	ctx.globalAlpha = 1;
	// One even-odd path: the hexagon with the hexagon cut from it, so on a transparent ground the hole stays open; on a
	// ground the hole is then painted in the ground's color, hiding the lines under it, as the tool draws it.
	ctx.beginPath();
	for (const pts of [ring(1), ring(0.42)]) {
		pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
		ctx.closePath();
	}
	ctx.fillStyle = fill;
	ctx.fill('evenodd');
	if (hole !== CUT) {
		path(ring(0.42));
		ctx.fillStyle = hole;
		ctx.fill();
	}
	ctx.restore();
}

/** A node seen face on: points left and right, flat top and bottom. */
export function drawNode(ctx: Ctx, x: number, y: number, r: number, fill: string, hole: string, turn = 0) {
	nodeIn(ctx, [x, y, 0], [1, 0, 0], [0, 1, 0], r, (p) => [p[0], p[1]], fill, hole, turn);
}

/** The stretched hexagon of the brand's pills and keys: points at the left and right. */
export function hexPill(ctx: Ctx, x: number, y: number, w: number, h: number) {
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

const overlaps = (x: number, y: number, pad: number, avoid: Rect[]) => avoid.some((r) => x > r.x - pad && x < r.x + r.w + pad && y > r.y - pad && y < r.y + r.h + pad);

export type GlobeOpts = { cx: number; cy: number; r: number; tilt: number; seed: number; nodes: number; nodeSize: number; ring: boolean; pole: boolean };
type Circle = { pts: (t: number) => V3; style: LineStyle; alpha: number };

/** A globe: its outline twice (dotted, then dashed just inside), meridians and a parallel or two, a great circle tipped
 * across it, all in the three kinds of line; nodes on whichever circles face us. */
export function drawGlobe(ctx: Ctx, o: GlobeOpts, u: number, W: number, H: number, line: string, node: string, hole: string, avoid: Rect[], motion: Motion = {}) {
	const rnd = mulberry(o.seed);
	const e = (o.tilt * Math.PI) / 180;
	const ce = Math.cos(e);
	const se = Math.sin(e);
	const march = motion.march ?? 0;
	const view = (p: V3) => {
		const y = p[1] * ce - p[2] * se;
		const z = p[1] * se + p[2] * ce;
		return { x: o.cx + p[0] * o.r, y: o.cy - z * o.r, depth: -y };
	};
	const to = (p: V3): [number, number] => {
		const v = view(p);
		return [v.x, v.y];
	};
	const styles: LineStyle[] = ['dots', 'dash', 'long', 'dots', 'dash'];
	const pick = <T>(a: T[]) => a[Math.floor(rnd() * a.length)]!;
	const circles: Circle[] = [];
	const nm = 3 + Math.floor(rnd() * 2);
	const lon0 = rnd() * Math.PI;
	for (let i = 0; i < nm; i++) {
		const lon = lon0 + (i / nm) * Math.PI + (rnd() - 0.5) * 0.35;
		const c = Math.cos(lon);
		const s = Math.sin(lon);
		circles.push({ pts: (t) => [Math.cos(t) * c, Math.cos(t) * s, Math.sin(t)], style: pick(styles), alpha: 0.9 });
	}
	const np = 1 + Math.floor(rnd() * 2);
	for (let i = 0; i < np; i++) {
		const lat = (0.15 + rnd() * 0.45) * (Math.PI / 2);
		circles.push({ pts: (t) => [Math.cos(lat) * Math.cos(t), Math.cos(lat) * Math.sin(t), Math.sin(lat)], style: pick(styles), alpha: 0.85 });
	}
	const ax = norm([rnd() - 0.5, rnd() - 0.5, 0.6 + rnd()]);
	const b1 = norm(cross(ax, [0, 0, 1]));
	const b2 = cross(ax, b1);
	const tip = 0.5 + rnd() * 0.6;
	const g1 = norm(add(mul(b1, Math.cos(tip)), mul(ax, Math.sin(tip))));
	circles.push({ pts: (t) => add(mul(g1, Math.cos(t)), mul(b2, Math.sin(t))), style: 'long', alpha: 0.9 });
	if (o.ring) {
		const lat = 0.62 * (Math.PI / 2);
		circles.push({ pts: (t) => [Math.cos(lat) * Math.cos(t), Math.cos(lat) * Math.sin(t), Math.sin(lat)], style: 'solid', alpha: 0.85 });
	}
	ctx.save();
	stroke(ctx, 'dots', u, line, 0.9, march);
	ctx.beginPath();
	ctx.arc(o.cx, o.cy, o.r * 1.035, 0, Math.PI * 2);
	ctx.stroke();
	stroke(ctx, 'long', u, line, 0.9, march);
	ctx.beginPath();
	ctx.arc(o.cx, o.cy, o.r, 0, Math.PI * 2);
	ctx.stroke();
	const N = 420;
	for (const c of circles) {
		stroke(ctx, c.style, u, line, c.alpha, march);
		ctx.beginPath();
		let pen = false;
		for (let i = 0; i <= N; i++) {
			const v = view(c.pts((i / N) * Math.PI * 2));
			if (v.depth < -0.02) {
				pen = false;
				continue;
			}
			if (pen) ctx.lineTo(v.x, v.y);
			else ctx.moveTo(v.x, v.y);
			pen = true;
		}
		ctx.stroke();
	}
	ctx.setLineDash([]);
	ctx.lineDashOffset = 0;
	ctx.globalAlpha = 1;
	const s = (o.nodeSize * u) / o.r;
	const placed: [number, number][] = [];
	const room = o.nodeSize * u * 5;
	const lay = (p: V3, along: V3, scale = 1) => {
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
		const c = circles[Math.floor(rnd() * circles.length)]!;
		const t = rnd() * Math.PI * 2;
		const p = c.pts(t);
		const v = view(p);
		if (v.depth < 0.22) continue;
		const pad = o.nodeSize * u * 2;
		if (v.x < pad || v.x > W - pad || v.y < pad || v.y > H - pad) continue;
		if (overlaps(v.x, v.y, pad * 1.5, avoid)) continue;
		if (placed.some(([x, y]) => Math.hypot(x - v.x, y - v.y) < room)) continue;
		const q = c.pts(t + 0.001);
		lay(p, [q[0] - p[0], q[1] - p[1], q[2] - p[2]]);
		placed.push([v.x, v.y]);
	}
	ctx.restore();
}

export type CubeOpts = { x: number; y: number; size: number; seed: number; nodes: number; nodeSize: number };

/** A wireframe cube cut into cells: a dotted ghost of it a little larger, its near edges dashed, its cells' lines solid
 * or dotted across the three faces we see, its hidden edges dotted; nodes on the cells' lines, lying in their faces. */
export function drawCube(ctx: Ctx, o: CubeOpts, u: number, W: number, H: number, line: string, node: string, hole: string, avoid: Rect[], motion: Motion = {}) {
	const rnd = mulberry(o.seed);
	const c30 = Math.cos(Math.PI / 6);
	const s30 = 0.5;
	const march = motion.march ?? 0;
	const to = (p: V3): [number, number] => [o.x + (p[0] - p[1]) * c30 * o.size, o.y - (p[0] + p[1]) * s30 * o.size - p[2] * o.size];
	const seg = (a: V3, b: V3, style: LineStyle, alpha = 0.9) => {
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
	const G: V3[] = [[-g, -g, -g], [1 + g, -g, -g], [-g, 1 + g, -g], [1 + g, 1 + g, -g], [-g, -g, 1 + g], [1 + g, -g, 1 + g], [-g, 1 + g, 1 + g], [1 + g, 1 + g, 1 + g]];
	for (const [a, b] of [[4, 5], [4, 6], [5, 7], [6, 7], [1, 5], [2, 6], [0, 1], [0, 2], [0, 4]] as [number, number][]) seg(G[a]!, G[b]!, 'dots', 0.75);
	for (const b of [[1, 1, 1], [0, 1, 0], [1, 0, 0]] as V3[]) seg([1, 1, 0], b, 'dots', 0.55);
	const kinds: LineStyle[] = ['solid', 'dots', 'dash', 'solid'];
	const pick = () => kinds[Math.floor(rnd() * kinds.length)]!;
	const lines: { a: V3; b: V3; face: 0 | 1 | 2 }[] = [];
	for (let i = 1; i < cells; i++) {
		const t = i / cells;
		lines.push({ a: [0, t, 0], b: [0, t, 1], face: 0 });
		lines.push({ a: [0, 0, t], b: [0, 1, t], face: 0 });
		lines.push({ a: [t, 0, 0], b: [t, 0, 1], face: 1 });
		lines.push({ a: [0, 0, t], b: [1, 0, t], face: 1 });
		lines.push({ a: [t, 0, 1], b: [t, 1, 1], face: 2 });
		lines.push({ a: [0, t, 1], b: [1, t, 1], face: 2 });
	}
	for (const l of lines) seg(l.a, l.b, pick(), 0.85);
	const E: [V3, V3][] = [
		[[0, 0, 1], [1, 0, 1]],
		[[0, 0, 1], [0, 1, 1]],
		[[1, 0, 1], [1, 1, 1]],
		[[0, 1, 1], [1, 1, 1]],
		[[1, 0, 0], [1, 0, 1]],
		[[0, 1, 0], [0, 1, 1]],
		[[0, 0, 0], [1, 0, 0]],
		[[0, 0, 0], [0, 1, 0]],
	];
	for (const [a, b] of E) seg(a, b, 'long', 0.95);
	seg([0, 0, 0], [0, 0, 1], 'solid', 1);
	ctx.setLineDash([]);
	ctx.lineDashOffset = 0;
	ctx.globalAlpha = 1;
	const placed: [number, number][] = [];
	const r = (o.nodeSize * u) / o.size;
	const room = o.nodeSize * u * 5;
	let tries = 0;
	while (placed.length < o.nodes && tries++ < 400) {
		const l = lines[Math.floor(rnd() * lines.length)]!;
		const t = 0.2 + rnd() * 0.6;
		const p: V3 = add(l.a, mul(add(l.b, mul(l.a, -1)), t));
		const [px, py] = to(p);
		const pad = o.nodeSize * u * 2;
		if (px < pad || px > W - pad || py < pad || py > H - pad) continue;
		if (overlaps(px, py, pad * 1.5, avoid)) continue;
		if (placed.some(([x, y]) => Math.hypot(x - px, y - py) < room)) continue;
		const along = norm(add(l.b, mul(l.a, -1)));
		const facing: V3 = l.face === 0 ? [1, 0, 0] : l.face === 1 ? [0, 1, 0] : [0, 0, 1];
		nodeIn(ctx, p, along, norm(cross(facing, along)), r, to, node, hole, motion.turn ?? 0);
		placed.push([px, py]);
	}
	ctx.restore();
}

/** The loader: the label spaced out at the left and the share at the right in the mono, a line in the mark color from a
 * tick to the node, the rest dashed to a tick at the end. */
export function drawLoader(ctx: Ctx, x: number, y: number, w: number, progress: number, label: string, mono: string, ink: string, red: string, hole: string, motion: Motion = {}): Rect {
	const p = Math.max(0, Math.min(100, progress)) / 100;
	const fs = Math.max(10, w * 0.034);
	ctx.save();
	ctx.fillStyle = ink;
	ctx.globalAlpha = 0.9;
	ctx.font = `400 ${fs}px ${mono}`;
	ctx.letterSpacing = `${fs * 0.55}px`;
	ctx.textBaseline = 'alphabetic';
	ctx.textAlign = 'left';
	ctx.fillText(label.toUpperCase(), x, y);
	ctx.letterSpacing = `${fs * 0.08}px`;
	ctx.textAlign = 'right';
	ctx.fillText(`${Math.round(p * 100)}%`, x + w, y);
	ctx.textAlign = 'left';
	ctx.letterSpacing = '0px';
	ctx.globalAlpha = 1;
	const by = y + fs * 3.2;
	const lw = Math.max(1, w * 0.0028);
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
	ctx.setLineDash([w * 0.012, w * 0.009]);
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

let grainTile: { canvas: ReturnType<typeof scratch>['canvas']; dark: boolean } | undefined;

/** Film grain over the ground: fine light specks on dark, dark on light (raster only; an SVG leaves it out). */
export function drawGrain(ctx: Ctx, amount: number, dark: boolean, scale = 1) {
	if (amount <= 0) return;
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
	const pat = ctx.createPattern(grainTile.canvas, 'repeat');
	if (!pat) return;
	ctx.save();
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.globalAlpha = (amount / 100) * (dark ? 0.09 : 0.03);
	ctx.fillStyle = pat;
	ctx.fillRect(0, 0, ctx.canvas.width / 1, ctx.canvas.height / 1);
	ctx.restore();
	void scale;
}

/** The frame's dashed rules: across the top and the foot, down the left. */
export function drawRules(ctx: Ctx, u: number, W: number, H: number, inset: number, foot: number, sides: { top: boolean; bottom: boolean; left: boolean }, color: string, march = 0) {
	ctx.save();
	ctx.strokeStyle = color;
	ctx.globalAlpha = 0.75;
	ctx.lineWidth = Math.max(0.6, 1.1 * u);
	ctx.setLineDash([9 * u, 7 * u]);
	ctx.lineDashOffset = -march * 16 * u;
	ctx.beginPath();
	if (sides.top) {
		ctx.moveTo(0, inset);
		ctx.lineTo(W, inset);
	}
	if (sides.bottom) {
		ctx.moveTo(sides.left ? inset : 0, H - foot);
		ctx.lineTo(W, H - foot);
	}
	if (sides.left) {
		ctx.moveTo(inset, 0);
		ctx.lineTo(inset, H);
	}
	ctx.stroke();
	ctx.restore();
}

/** A note in small mono capitals, set justified: every line but the last spread to the full measure. Returns its box. */
export function drawNote(ctx: Ctx, text: string, x: number, y: number, w: number, size: number, mono: string, color: string, justify = true, dry = false): Rect {
	const t = text.trim();
	if (!t) return { x, y, w: 0, h: 0 };
	ctx.save();
	ctx.font = `400 ${size}px ${mono}`;
	ctx.letterSpacing = `${size * 0.08}px`;
	ctx.fillStyle = color;
	ctx.textBaseline = 'alphabetic';
	ctx.textAlign = 'left';
	const lh = size * 1.62;
	const space = ctx.measureText(' ').width;
	let row = 0;
	for (const para of t.toUpperCase().split('\n')) {
		const words = para.split(/\s+/).filter(Boolean);
		const lines: string[][] = [];
		let cur: string[] = [];
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
		if (cur.length) lines.push(cur);
		lines.forEach((ln, i) => {
			const base = y + row * lh + size;
			row++;
			if (dry) return;
			const last = i === lines.length - 1;
			const widths = ln.map((wd) => ctx.measureText(wd).width);
			const total = widths.reduce((a, b) => a + b, 0);
			const gap = justify && !last && ln.length > 1 ? (w - total) / (ln.length - 1) : space;
			let px = x;
			ln.forEach((wd, j) => {
				ctx.fillText(wd, px, base);
				px += widths[j]! + gap;
			});
		});
	}
	ctx.restore();
	return { x, y, w, h: row * lh };
}

/** The site's corner ticks (.ds-corners): a 16px tick along each edge at every corner of a square frame, in `color`. */
export function drawCorners(ctx: Ctx, r: Rect, len: number, width: number, color: string) {
	ctx.save();
	ctx.fillStyle = color;
	for (const [x, y, dx, dy] of [[r.x, r.y, 1, 1], [r.x + r.w, r.y, -1, 1], [r.x, r.y + r.h, 1, -1], [r.x + r.w, r.y + r.h, -1, -1]] as [number, number, number, number][]) {
		ctx.fillRect(dx > 0 ? x : x - len, dy > 0 ? y : y - width, len, width);
		ctx.fillRect(dx > 0 ? x : x - width, dy > 0 ? y : y - len, width, len);
	}
	ctx.restore();
}
