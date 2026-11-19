import { readFileSync } from 'node:fs';
import { pkgPath } from '../lib/paths.js';
import { unknownName } from '../lib/names.js';
import { brandFonts, surface, toPng, toSvg, tokenAlpha, type Ctx } from '../assets/canvas.js';
import { colorsOf } from '../assets/og.js';
import type { Picture } from '../assets/picture.js';
import { SvgRecorder } from './svg.js';
import { CUT, drawCorners, drawCube, drawGlobe, drawLoader, drawNode, drawRules } from '../assets/scene.js';

// `illustrate`: the brand's drawing style as code (brand/illustrate.json, rules in brand/illustration.md). A subject
// is drawn with the same functions as the share images, on a palette (a theme's ground or none), from a seed, so the
// same subject, settings and seed always give the same file. SVG keeps every line and node a vector shape.

type SubjectDoc = { kind: string; $source: string; size: [number, number]; picture: boolean };
type PaletteDoc = { theme: string; transparent?: boolean; $source: string };
type IllustrateDoc = { subjects: Record<string, SubjectDoc>; palettes: Record<string, PaletteDoc> };

let doc: IllustrateDoc | undefined;
export const illustrateData = (): IllustrateDoc => (doc ??= JSON.parse(readFileSync(pkgPath('brand', 'illustrate.json'), 'utf8')) as IllustrateDoc);

export type Settings = { width: number; height: number; palette: string; seed: number; nodes: number; tilt: number; progress: number; shade: number; label: string };

export function settingsFor(subject: string, given: Partial<Settings> = {}): Settings {
	const d = illustrateData();
	const s = d.subjects[subject];
	if (!s) throw unknownName('subject', subject, Object.keys(d.subjects));
	const out: Settings = { width: s.size[0], height: s.size[1], palette: 'light', seed: 3, nodes: subject === 'cube' ? 5 : 6, tilt: subject === 'dome' ? 26 : 22, progress: 58, shade: 0, label: 'Loading', ...Object.fromEntries(Object.entries(given).filter(([, v]) => v !== undefined)) };
	if (!d.palettes[out.palette]) throw unknownName('palette', out.palette, Object.keys(d.palettes));
	for (const [k, min, max] of [['width', 160, 4000], ['height', 160, 4000], ['seed', 1, 1_000_000_000], ['nodes', 0, 12], ['tilt', 0, 90], ['progress', 0, 100], ['shade', 0, 92]] as const) {
		const v = out[k];
		if (!Number.isFinite(v) || v < min || v > max) throw new Error(`--${k} takes ${min} to ${max}, not ${v}.`);
	}
	return out;
}

/** Draws a subject on a context in its own pixels. */
export function drawSubject(ctx: Ctx, subject: string, st: Settings, picture?: Picture | null) {
	const pal = illustrateData().palettes[st.palette]!;
	const C = colorsOf(pal.theme);
	const W = st.width;
	const H = st.height;
	const S = Math.min(W, H);
	const u = Math.sqrt((W * H) / (1200 * 630));
	const hole = pal.transparent ? CUT : C.bg;
	if (!pal.transparent) {
		ctx.fillStyle = C.bg;
		ctx.fillRect(0, 0, W, H);
	}
	const nodeSize = (S * 0.024) / u;
	switch (subject) {
		case 'globe':
			drawGlobe(ctx, { cx: W / 2, cy: H / 2, r: S * 0.42, tilt: st.tilt, seed: st.seed, nodes: st.nodes, nodeSize, ring: false, pole: false }, u, W, H, C.grid, C.node, hole, []);
			break;
		case 'dome': {
			const r = W * 0.46;
			drawGlobe(ctx, { cx: W / 2, cy: H * 0.32 + r * 1.035, r, tilt: st.tilt, seed: st.seed, nodes: st.nodes, nodeSize, ring: true, pole: true }, u, W, H, C.grid, C.node, hole, []);
			break;
		}
		case 'cube': {
			const size = S * 0.36;
			drawCube(ctx, { x: W / 2, y: H / 2 + size * 1.0, size, seed: st.seed, nodes: st.nodes, nodeSize }, u, W, H, C.grid, C.node, hole, []);
			break;
		}
		case 'node':
			drawNode(ctx, W / 2, H / 2, S * 0.34, C.node, hole);
			break;
		case 'loader':
			drawLoader(ctx, W * 0.08, H * 0.42, W * 0.84, st.progress, st.label, brandFonts().mono, C.ink, C.node, hole);
			break;
		case 'window': {
			if (!picture) throw new Error('The window subject frames a picture: pass --image <file>.');
			const inset = S * 0.075;
			const box = { x: inset * 1.6, y: inset * 1.6, w: W - inset * 3.2, h: H - inset * 3.2 };
			const k = Math.max(box.w / picture.width, box.h / picture.height);
			ctx.save();
			ctx.beginPath();
			ctx.rect(box.x, box.y, box.w, box.h);
			ctx.clip();
			ctx.drawImage(picture.canvas, box.x + (box.w - picture.width * k) / 2, box.y + (box.h - picture.height * k) / 2, picture.width * k, picture.height * k);
			if (st.shade > 0) {
				ctx.fillStyle = tokenAlpha('bg-dark', st.shade / 100, 'dark');
				ctx.fillRect(box.x, box.y, box.w, box.h);
			}
			ctx.restore();
			drawRules(ctx, u, W, H, inset, inset, { top: true, bottom: true, left: true }, C.grid);
			drawCorners(ctx, box, 16 * u, Math.max(1, u), C.ink);
			drawNode(ctx, box.x + box.w, box.y + box.h, nodeSize * u, C.node, hole);
			break;
		}
		default:
			throw unknownName('subject', subject, Object.keys(illustrateData().subjects));
	}
}

export type Built = { subject: string; kind: string; source: string; settings: Settings; svg?: string; png?: Buffer; width: number; height: number };

/** Builds a subject (or `window` with a picture) as SVG and/or PNG. */
export function buildIllustration(o: { subject?: string; picture?: Picture | null; settings?: Partial<Settings>; svg?: boolean; png?: boolean; scale?: number }): Built {
	const subject = o.subject ?? (o.picture ? 'window' : '');
	if (!subject) throw new Error(`Name a subject (${Object.keys(illustrateData().subjects).join(', ')}) or pass --image <file>.`);
	const def = illustrateData().subjects[subject];
	if (!def) throw unknownName('subject', subject, Object.keys(illustrateData().subjects));
	if (o.picture && !def.picture) throw new Error(`The ${subject} subject takes no picture; --image goes with window.`);
	const st = settingsFor(subject, o.settings);
	const out: Built = { subject, kind: def.kind, source: def.$source, settings: st, width: st.width, height: st.height };
	if (o.svg !== false) {
		// Line drawings record as native SVG (dashes stay stroke-dasharray); text and pictures go through Skia's SVG.
		if (['globe', 'dome', 'cube', 'node'].includes(subject)) {
			const rec = new SvgRecorder(st.width, st.height);
			drawSubject(rec.ctx, subject, st, o.picture);
			out.svg = rec.toString();
		} else {
			const s = surface(st.width, st.height, { svg: true });
			drawSubject(s.ctx, subject, st, o.picture);
			out.svg = toSvg(s);
		}
	}
	if (o.png !== false) {
		const s = surface(st.width, st.height, { scale: o.scale ?? 2 });
		drawSubject(s.ctx, subject, st, o.picture);
		out.png = toPng(s);
	}
	return out;
}
