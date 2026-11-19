import { readFileSync } from 'node:fs';
import { pkgPath } from '../lib/paths.js';
import { brandFonts, surface, toPng, toSvg, tokenAlpha, tokenColor, type Ctx } from './canvas.js';
import { pick } from './io.js';
import { drawLogo, drawMark, logoRatio, markRatio } from './logo.js';
import { colorsOf, type Colors } from './og.js';
import type { Picture } from './picture.js';
import { CUT, drawCorners, drawCube, drawGlobe, drawRules, hexPill, type Rect } from './scene.js';
import { drawFitted, fit } from './text.js';

// Merch print files (brand/assets/merch.json): each item's trim, bleed and safe area in inches, and layers of the
// lockup, the brand drawings, the dashed rules and words, in inches from the trim. A file is the item at 300 pixels per
// inch with the bleed around it: SVG at physical size (inches on the root) and PNG at the asked dpi. Colors come only
// from the variant. No mockups.

export const PX_PER_IN = 300;

type Box = [number, number, number, number];
type Layer =
	| { type: 'logo'; part: 'full' | 'mark'; box: Box }
	| { type: 'art'; art: 'globe' | 'cube'; box: Box; seed: number; picture?: boolean }
	| { type: 'rules'; box: Box }
	| { type: 'text'; slot: string; box: Box; size: number; face: 'display' | 'mono'; maxLines?: number };

export type MerchItem = { id: string; name: string; size: [number, number]; bleed: number; safe: number; method: string; source: string; cut?: { shape: 'hex' }; variants: string[]; layers: Layer[] };
type Variant = { theme?: string; one?: string; mode?: 'light' | 'dark'; ground: boolean };
type MerchDoc = { dpi: number; slots: Record<string, string>; variants: Record<string, Variant>; items: MerchItem[] };

let doc: MerchDoc | undefined;
export const merchDoc = (): MerchDoc => (doc ??= JSON.parse(readFileSync(pkgPath('brand', 'assets', 'merch.json'), 'utf8')) as MerchDoc);
export const merchItems = () => merchDoc().items;
export const findItem = (id: string): MerchItem => {
	const name = pick('item', id, merchItems().map((i) => i.id));
	return merchItems().find((i) => i.id === name)!;
};

export function merchCatalog() {
	return {
		items: merchItems().map((i) => ({
			id: i.id,
			name: i.name,
			trim: { width: i.size[0], height: i.size[1], unit: 'in' },
			bleed: i.bleed,
			safe: i.safe,
			method: i.method,
			variants: i.variants,
			pixels: { width: Math.round((i.size[0] + 2 * i.bleed) * PX_PER_IN), height: Math.round((i.size[1] + 2 * i.bleed) * PX_PER_IN), dpi: PX_PER_IN },
			dieCut: Boolean(i.cut),
			slots: [...new Set(i.layers.flatMap((l) => (l.type === 'text' ? [l.slot] : [])))],
			picture: i.layers.some((l) => l.type === 'art' && l.picture),
			source: i.source,
		})),
		variants: Object.entries(merchDoc().variants).map(([id, v]) => ({ id, ...v })),
		note: 'Sizes are common vendor print areas (conventions, not a standard): confirm with the vendor template before ordering.',
	};
}

export type MerchRequest = { variant?: string; slots?: Record<string, string>; picture?: Picture | null; guides?: boolean; seed?: number };

/** Colors for a variant: a theme's, or one brand color for everything (the accent keeps the horse orange). */
function variantColors(v: Variant): Colors & { mark: string } {
	if (v.one) {
		const c = tokenColor(v.one, v.mode ?? 'light');
		return { bg: 'rgba(0, 0, 0, 0)', ink: c, muted: c, line: c, grid: tokenAlpha(v.one, 0.85, v.mode ?? 'light'), node: c, dark: v.mode === 'dark', mark: c };
	}
	const c = colorsOf(v.theme!);
	return { ...c, mark: c.node };
}

/** Draws an item on a context in its own pixels (300 per inch, bleed included). */
export function drawItem(ctx: Ctx, item: MerchItem, req: MerchRequest = {}) {
	const variant = pick(`variant for ${item.id}`, req.variant ?? item.variants[0]!, item.variants);
	const v = merchDoc().variants[variant]!;
	const c = variantColors(v);
	const o = item.bleed * PX_PER_IN;
	const W = (item.size[0] + 2 * item.bleed) * PX_PER_IN;
	const H = (item.size[1] + 2 * item.bleed) * PX_PER_IN;
	const px = (b: Box): Rect => ({ x: b[0] * PX_PER_IN + o, y: b[1] * PX_PER_IN + o, w: b[2] * PX_PER_IN, h: b[3] * PX_PER_IN });
	const takes = new Set(item.layers.flatMap((l) => (l.type === 'text' ? [l.slot] : [])));
	for (const k of Object.keys(req.slots ?? {})) if (!takes.has(k)) throw new Error(`${item.id} does not draw --${k}.${takes.size ? ` It takes ${[...takes].map((s) => `--${s}`).join(', ')}.` : ' It takes no text.'}`);
	if (req.picture && !item.layers.some((l) => l.type === 'art' && l.picture)) throw new Error(`${item.id} holds no picture; --image goes with ${merchItems().filter((i) => i.layers.some((l) => l.type === 'art' && l.picture)).map((i) => i.id).join(', ')}.`);
	const slots = { ...merchDoc().slots, ...req.slots };
	const fonts = brandFonts();
	// A unit here is 1/100 in, so the drawings' strokes and nodes read at print size.
	const u = PX_PER_IN / 100;
	if (v.ground) {
		ctx.fillStyle = c.bg;
		ctx.fillRect(0, 0, W, H);
	}
	const keep: Rect[] = [];
	const texts: { f: ReturnType<typeof fit>; box: Rect }[] = [];
	for (const l of item.layers) {
		if (l.type === 'logo') keep.push(px(l.box));
		else if (l.type === 'text') {
			const b = px(l.box);
			const value = slots[l.slot] ?? '';
			if (!value.trim()) continue;
			const style = l.face === 'mono' ? { family: fonts.mono, weight: 400, size: l.size * PX_PER_IN, tracking: 0.08, leading: 1.4, color: c.ink, caps: true } : { family: fonts.display, weight: 300, size: l.size * PX_PER_IN, tracking: 0, leading: 1.16, color: c.ink };
			const f = fit(ctx, value, style, b.w, l.maxLines ?? 2, 0.6, `${item.id} ${l.slot}`);
			texts.push({ f, box: b });
			keep.push({ x: b.x, y: b.y, w: f.width, h: f.height });
		}
	}
	const hole = v.ground ? c.bg : CUT;
	for (const l of item.layers) {
		if (l.type === 'rules') {
			const b = px(l.box);
			const inset = Math.min(b.w, b.h) * 0.075;
			ctx.save();
			ctx.translate(b.x, b.y);
			drawRules(ctx, u, b.w, b.h, inset, Math.min(b.w, b.h) * 0.14, { top: true, bottom: true, left: true }, c.grid);
			ctx.restore();
		} else if (l.type === 'art') {
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
			if (l.art === 'globe') drawGlobe(ctx, { cx: b.x + b.w / 2, cy: b.y + b.h * 0.98, r: b.w * 0.46, tilt: 26, seed, nodes: 5, nodeSize, ring: true, pole: true }, u, W, b.y + b.h, c.grid, c.mark, hole, keep);
			else drawCube(ctx, { x: b.x + b.w * 0.5, y: b.y + b.h * 0.9, size: Math.min(b.w * 0.36, b.h * 0.36), seed, nodes: 4, nodeSize }, u, W, b.y + b.h, c.grid, c.mark, hole, keep);
			ctx.restore();
		}
	}
	for (const l of item.layers) {
		if (l.type !== 'logo') continue;
		const b = px(l.box);
		if (l.part === 'mark') {
			const h = Math.min(b.h, b.w / markRatio());
			drawMark(ctx, b.x + (b.w - h * markRatio()) / 2, b.y + (b.h - h) / 2, h, c.mark);
		} else {
			const h = Math.min(b.h, b.w / logoRatio());
			drawLogo(ctx, b.x + (b.w - h * logoRatio()) / 2, b.y + (b.h - h) / 2, h, c.mark, c.ink);
		}
	}
	for (const t of texts) drawFitted(ctx, t.f, t.box.x, t.box.y, t.box.w);
	if (req.guides) {
		ctx.save();
		ctx.strokeStyle = tokenColor('orange');
		ctx.lineWidth = 3;
		if (item.bleed) ctx.strokeRect(o, o, item.size[0] * PX_PER_IN, item.size[1] * PX_PER_IN);
		const s = item.safe * PX_PER_IN;
		ctx.setLineDash([18, 12]);
		ctx.strokeRect(o + s, o + s, item.size[0] * PX_PER_IN - 2 * s, item.size[1] * PX_PER_IN - 2 * s);
		ctx.restore();
	}
	return { variant, width: W, height: H };
}

/** The die line (the cutter's CutContour spot path) for an item with a cut: in the SVG only, never printed. */
function cutPath(item: MerchItem): string {
	if (!item.cut) return '';
	const o = item.bleed * PX_PER_IN;
	const w = item.size[0] * PX_PER_IN;
	const h = item.size[1] * PX_PER_IN;
	const p = h / 2;
	const d = `M${o + p} ${o}H${o + w - p}L${o + w} ${o + h / 2}L${o + w - p} ${o + h}H${o + p}L${o} ${o + h / 2}Z`;
	return `<g id="CutContour"><path d="${d}" fill="none" stroke="#FF00FF" stroke-width="3"/></g>`;
}

/** The die line drawn for proofing (guides). */
export function drawCut(ctx: Ctx, item: MerchItem) {
	if (!item.cut) return;
	const o = item.bleed * PX_PER_IN;
	hexPill(ctx, o, o, item.size[0] * PX_PER_IN, item.size[1] * PX_PER_IN);
}

export type MerchRender = { png?: Buffer; svg?: string; variant: string; width: number; height: number; widthIn: number; heightIn: number; dpi: number };

/** An item as print files: SVG at physical size (with the die line, if any) and PNG at `dpi` (72 to 600). */
export function renderItem(item: MerchItem, req: MerchRequest & { png?: boolean; svg?: boolean; dpi?: number } = {}): MerchRender {
	const widthIn = item.size[0] + 2 * item.bleed;
	const heightIn = item.size[1] + 2 * item.bleed;
	const W = Math.round(widthIn * PX_PER_IN);
	const H = Math.round(heightIn * PX_PER_IN);
	const dpi = req.dpi ?? PX_PER_IN;
	const out: MerchRender = { variant: '', width: Math.round(widthIn * dpi), height: Math.round(heightIn * dpi), widthIn, heightIn, dpi };
	if (req.png !== false) {
		const s = surface(W, H, { scale: dpi / PX_PER_IN });
		out.variant = drawItem(s.ctx, item, req).variant;
		if (req.guides && item.cut) {
			s.ctx.save();
			drawCut(s.ctx, item);
			s.ctx.strokeStyle = tokenColor('orange');
			s.ctx.lineWidth = 3;
			s.ctx.stroke();
			s.ctx.restore();
		}
		out.png = toPng(s, { dpi });
	}
	if (req.svg) {
		const s = surface(W, H, { svg: true });
		out.variant = drawItem(s.ctx, item, req).variant;
		out.svg = toSvg(s, { widthIn, heightIn }).replace(/<\/svg>\s*$/, `${cutPath(item)}</svg>\n`);
	}
	return out;
}
