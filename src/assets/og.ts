import { readFileSync } from 'node:fs';
import { pkgPath } from '../lib/paths.js';
import { tokenAlpha, tokenColor, type Ctx, type Fonts } from './canvas.js';
import { pick } from './io.js';
import { drawLogo, drawMark, logoDoc, logoRatio } from './logo.js';
import type { Picture } from './picture.js';
import { drawCorners, drawCube, drawGlobe, drawGrain, drawLoader, drawNote, drawRules, type Motion, type Rect } from './scene.js';

// A share image or social post, ported from the brand's own social tool (agd-playground hoplite-og draw.ts: layoutFor
// and the parts of drawDesign its templates use). Every position is a share of the frame and every size a unit that
// grows with its area, so a template redraws at any size. Colors and copy come from brand/assets/image.json.

export type Template = 'globe' | 'cube' | 'horizon' | 'banner' | 'loader' | 'logo' | 'partner';
export const TEMPLATES: Template[] = ['globe', 'cube', 'horizon', 'banner', 'loader', 'logo', 'partner'];

type ThemeDoc = { label: string; mode: 'light' | 'dark'; bg: string; ink: string; muted: string; line: [string, number]; grid: [string, number]; node: string; description: string };
type SizeDoc = { label: string; w: number; h: number; group: string; aliases?: string[] };
type TemplateDoc = { label: string; description: string; copy: Record<string, string>; picture: boolean };
export type ImageDoc = { themes: Record<string, ThemeDoc>; notes: string[]; sizes: Record<string, SizeDoc>; social: string[]; foot: { left: string; right: string }; templates: Record<Template, TemplateDoc> };

let doc: ImageDoc | undefined;
export const imageDoc = (): ImageDoc => (doc ??= JSON.parse(readFileSync(pkgPath('brand', 'assets', 'image.json'), 'utf8')) as ImageDoc);
export const themeNames = () => Object.keys(imageDoc().themes);

export type Design = {
	template: Template;
	size: string;
	w: number;
	h: number;
	theme: string;
	lockup: 'accent' | 'ink';
	headline: string;
	/** The first note (the tool's line under the headline, set as a note). */
	note: string;
	note2: string;
	footLeft: string;
	footRight: string;
	partnerName: string;
	progress: number;
	loaderLabel: string;
	seed: number;
	grain: number;
	shade: number;
	/** Layout, from layoutFor; flags may move the words. */
	align: 'left' | 'center';
	textX: number;
	textY: number;
	textSize: number;
	textWidth: number;
	textFit: number;
	leading: number;
	hideWords: boolean;
	noteX: number;
	noteY: number;
	note2X: number;
	note2Y: number;
	note2Right: boolean;
	noteWidth: number;
	noteSize: number;
	art: 'none' | 'globe' | 'cube' | 'loader';
	artX: number;
	artY: number;
	artSize: number;
	artTilt: number;
	artNodes: number;
	nodeSize: number;
	artRing: boolean;
	artPole: boolean;
	rules: boolean;
	ruleTop: boolean;
	ruleBottom: boolean;
	ruleLeft: boolean;
	ruleInset: number;
	ruleFoot: number;
	loaderX: number;
	loaderY: number;
	loaderW: number;
	logo: boolean;
	logoX: number;
	logoY: number;
	logoSize: number;
	logoAnchor: 'left' | 'center' | 'right';
	foot: boolean;
	footSize: number;
	footInset: number;
	footTracking: number;
	minText: number;
};

export const clampDim = (n: number) => Math.round(Math.min(4000, Math.max(160, n || 0)));

export function frameOf(d: Pick<Design, 'size' | 'w' | 'h'>) {
	const s = imageDoc().sizes[d.size];
	return s ? { w: s.w, h: s.h } : { w: clampDim(d.w), h: clampDim(d.h) };
}

/** One unit: a pixel of the 1200 by 630 link preview, grown with the area. */
export function unitOf(d: Pick<Design, 'size' | 'w' | 'h'>) {
	const { w, h } = frameOf(d);
	return Math.sqrt((w * h) / (1200 * 630));
}

type At = { size: string; w: number; h: number };

/** Where a template puts everything at a size: the tool's layoutFor, read off the brand's 960 by 1200 posts, its X
 * header and its 16:9 banner (a dashed rule 6% in from the top and the left and one a tenth up from the foot, the
 * headline in light Chakra Petch inside them, notes in small mono capitals, the lockup in the band under the rule). */
export function layoutFor(t: Template, at: At): Omit<Design, 'template' | 'theme' | 'lockup' | 'headline' | 'note' | 'note2' | 'footLeft' | 'footRight' | 'partnerName' | 'progress' | 'loaderLabel' | 'seed' | 'shade'> {
	const { w: W, h: H } = frameOf(at);
	const u = unitOf(at);
	const wide = W / H >= 1.4;
	const banner = W / H >= 2.4;
	const portrait = !wide;
	const inset = portrait ? W * 0.059 : Math.min(W, H) * 0.075;
	const foot = portrait ? H * 0.1 : H * 0.14;
	const textX = (inset + (portrait ? W * 0.045 : inset * 0.75)) / W;
	const hd = portrait ? W * 0.056 : banner ? H * 0.085 : H * 0.068;
	const note = Math.max(9, portrait ? W * 0.0112 : H * 0.0175);
	const nodePx = portrait ? W * 0.02 : H * 0.028;
	const lockPx = portrait ? W * 0.034 : H * 0.052;
	const right = portrait ? W * 0.045 : inset;
	const lockBR = { logo: true, logoSize: lockPx / u, logoAnchor: 'right' as const, logoX: (W - right) / W, logoY: (H - foot / 2 - lockPx / 2) / H };
	const hp = {
		size: at.size,
		w: W,
		h: H,
		grain: 100,
		align: 'left' as const,
		textX,
		textY: (inset + hd * 0.72) / H,
		textSize: hd / u,
		textWidth: portrait ? 0.7 : 0.52,
		textFit: portrait ? 0.24 : 0.36,
		leading: 1.16,
		hideWords: false,
		noteX: textX,
		noteY: 0.4,
		note2X: (W - right) / W,
		note2Y: 0.4,
		note2Right: true,
		noteWidth: portrait ? 0.18 : 0.17,
		noteSize: note / u,
		art: 'none' as Design['art'],
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
		logoAnchor: 'left' as Design['logoAnchor'],
		foot: false,
		footSize: 20,
		footInset: (W * 0.05) / u,
		footTracking: 260,
		minText: 10,
	};
	/* The dome of a globe rising from the foot: its top `top` down the image. */
	const dome = (top: number, r: number, cx = 0.5) => ({ artX: cx, artSize: r, artY: top + (r * W * 1.035) / H });
	const footLine = { foot: true, footTracking: 260, footSize: (portrait ? W * 0.016 : H * 0.0135) / u, footInset: (portrait ? W * 0.06 : W * 0.05) / u };
	switch (t) {
		case 'globe':
			return { ...hp, ...lockBR, noteY: portrait ? 0.272 : 0.4, art: 'globe', artTilt: 16, ...dome(portrait ? 0.4 : 0.47, portrait ? 1.06 : 0.62, 0.54) };
		case 'cube':
			return { ...hp, ...lockBR, noteY: portrait ? 0.45 : 0.42, note2Y: portrait ? 0.81 : 0.66, note2Right: false, note2X: textX, art: 'cube', artX: portrait ? 0.73 : 0.7, artY: portrait ? 1.04 : 1.1, artSize: portrait ? 0.54 : 0.26, artNodes: 5 };
		case 'horizon':
			return { ...hp, rules: false, align: 'center', textX: 0.5, textY: portrait ? 0.14 : 0.18, textWidth: portrait ? 0.82 : 0.44, textSize: (portrait ? W * 0.07 : H * 0.062) / u, art: 'globe', artTilt: portrait ? 34 : 26, artRing: true, artPole: true, artNodes: 6, ...dome(portrait ? 0.42 : 0.48, portrait ? 0.92 : 0.75), ...footLine };
		case 'banner':
			return portrait
				? { ...hp, ruleTop: false, ruleLeft: false, textY: 0.66, noteY: 0.86, noteWidth: 0.6, art: 'globe', artTilt: 22, artX: 0.5, artY: 0.28, artSize: 0.3, artNodes: 3 }
				: { ...hp, ruleTop: false, ruleLeft: false, ruleFoot: (H * 0.125) / u, textX: 0.655, textY: banner ? 0.31 : 0.3, textWidth: 0.32, textFit: 0.56, noteX: 0.655, noteY: 0.6, noteWidth: 0.3, art: 'globe', artTilt: 22, artX: 0.2, artY: 0.5, artSize: banner ? 0.17 : 0.24, artNodes: 2 };
		case 'loader':
			return { ...hp, ...lockBR, noteY: portrait ? 0.272 : 0.4, art: 'loader', loaderX: textX, loaderY: portrait ? 0.56 : 0.68, loaderW: 1 - textX - right / W };
		case 'logo': {
			const lw = (portrait ? 0.62 : 0.4) * W;
			const lh = lw / logoRatio();
			return { ...hp, rules: false, hideWords: true, logo: true, logoSize: lh / u, logoAnchor: 'center', logoX: 0.5, logoY: 0.3 - lh / 2 / H, art: 'globe', artTilt: portrait ? 34 : 26, artRing: true, artPole: true, ...dome(portrait ? 0.5 : 0.56, portrait ? 0.92 : 0.75), ...footLine };
		}
		case 'partner': {
			const lh = portrait ? W * 0.07 : H * 0.085;
			return { ...hp, rules: false, align: 'center', textX: 0.5, textY: portrait ? 0.3 : 0.36, textWidth: portrait ? 0.8 : 0.5, textSize: (portrait ? W * 0.05 : H * 0.052) / u, textFit: 0.2, logo: true, logoSize: lh / u, logoAnchor: 'center', logoX: 0.5, logoY: 0.16, art: 'globe', artTilt: 26, artRing: true, artPole: true, artNodes: 5, ...dome(portrait ? 0.56 : 0.62, portrait ? 0.92 : 0.75), ...footLine };
		}
	}
}

/** A template's opening design at a size: its layout, the light theme, its copy from image.json. */
export function designFor(t: Template, size = 'og', dims?: { w: number; h: number }): Design {
	const doc = imageDoc();
	const s = doc.sizes[size];
	const at = { size, w: dims?.w ?? s?.w ?? 1200, h: dims?.h ?? s?.h ?? 630 };
	const copy = doc.templates[t].copy;
	return {
		...layoutFor(t, at),
		template: t,
		theme: 'light',
		lockup: 'accent',
		headline: copy.headline ?? '',
		note: copy.note ?? '',
		note2: copy.note2 ?? '',
		footLeft: doc.foot.left,
		footRight: doc.foot.right,
		partnerName: copy.partnerName ?? '',
		progress: Number(copy.progress ?? 58),
		loaderLabel: copy.loaderLabel ?? 'Loading',
		seed: 3,
		shade: 0,
	};
}

export type Colors = { bg: string; ink: string; muted: string; line: string; grid: string; node: string; dark: boolean };

/** A theme's colors, resolved from tokens in its mode. */
export function colorsOf(theme: string): Colors {
	const t = imageDoc().themes[pick('theme', theme, themeNames())]!;
	const m = t.mode;
	return { bg: tokenColor(t.bg, m), ink: tokenColor(t.ink, m), muted: tokenColor(t.muted, m), line: tokenAlpha(t.line[0], t.line[1], m), grid: tokenAlpha(t.grid[0], t.grid[1], m), node: tokenColor(t.node, m), dark: m === 'dark' };
}

type Word = { text: string; hi: boolean };
/* "*phrase*" marks the accent; "\*" is a star to show. */
function parseLine(line: string): Word[] {
	const out: Word[] = [];
	let hi = false;
	const STAR = '\u0000';
	const parts = line.replaceAll('\\*', STAR).split('*');
	parts.forEach((chunk, i) => {
		if (i > 0) hi = !hi;
		for (const b of chunk.split(/\s+/)) if (b) out.push({ text: b.replaceAll(STAR, '*'), hi });
	});
	return out;
}

function wrapWords(ctx: Ctx, words: Word[], max: number) {
	const space = ctx.measureText(' ').width;
	const lines: { words: Word[]; w: number }[] = [];
	let cur: Word[] = [];
	let w = 0;
	for (const wd of words) {
		const ww = ctx.measureText(wd.text).width;
		const add = cur.length ? space + ww : ww;
		if (cur.length && w + add > max) {
			lines.push({ words: cur, w });
			cur = [wd];
			w = ww;
		} else {
			cur.push(wd);
			w += add;
		}
	}
	if (cur.length || !lines.length) lines.push({ words: cur, w });
	return lines;
}

/* The baseline of a line set at `size` with line height `lh`, as CSS sets it. */
function baselineIn(ctx: Ctx, lineTop: number, size: number, lh: number) {
	const m = ctx.measureText('Hg');
	const asc = m.fontBoundingBoxAscent || size * 0.9;
	const desc = m.fontBoundingBoxDescent || size * 0.22;
	return lineTop + (size * lh - (asc + desc)) / 2 + asc;
}

/** The headline: light display face, the accent phrase in the mark color. Returns its box. */
function drawWords(ctx: Ctx, d: Design, size: number, ink: string, accent: string, fonts: Fonts, dry = false): Rect {
	const { w: W, h: H } = frameOf(d);
	const maxW = d.textWidth * W;
	const ax = d.textX * W;
	let y = d.textY * H;
	const top = y;
	const xFor = (w: number) => (d.align === 'left' ? ax : ax - w / 2);
	ctx.font = `300 ${size}px ${fonts.display}`;
	ctx.letterSpacing = '0px';
	ctx.textAlign = 'left';
	ctx.textBaseline = 'alphabetic';
	const lines = d.headline.split('\n').flatMap((l) => wrapWords(ctx, parseLine(l), maxW));
	const space = ctx.measureText(' ').width;
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

/* The size that keeps the headline above textFit, never below 40% of the size asked for. */
function fittedSize(ctx: Ctx, d: Design, u: number, fonts: Fonts) {
	const H = frameOf(d).h;
	let size = d.textSize * u;
	if (d.textFit <= 0) return size;
	const limit = d.textFit * H - d.textY * H;
	if (limit <= 0) return size * 0.4;
	for (let i = 0; i < 6; i++) {
		const r = drawWords(ctx, d, size, '#000', '#000', fonts, true);
		if (r.h <= limit + 0.5) break;
		size = Math.max(d.textSize * u * 0.4, size * Math.max(0.6, Math.min(0.98, limit / r.h)));
	}
	return size;
}

/** The lockup (and a partner beside it, after a cross): its box. `draw` false only measures. */
function drawLockup(ctx: Ctx, d: Design, u: number, C: Colors, fonts: Fonts, partner: Picture | null, draw = true): Rect | null {
	if (!d.logo) return null;
	const { w: W, h: H } = frameOf(d);
	const lh = d.logoSize * u;
	const lw = lh * logoRatio();
	const pname = d.partnerName.trim();
	const hasPartner = d.template === 'partner' && (!!partner || !!pname);
	// The tool's partner row, in its lockup units (304 tall): a 74 gap, a 46 cross, the name at 0.62 of the height.
	const gap = (74 / 304) * lh;
	const times = (46 / 304) * lh;
	let pw = 0;
	let ph = lh * 0.82;
	if (hasPartner && partner) {
		pw = (ph * partner.width) / Math.max(1, partner.height);
		if (pw > lw * 1.6) {
			pw = lw * 1.6;
			ph = (pw * partner.height) / Math.max(1, partner.width);
		}
	} else if (hasPartner) {
		ctx.font = `400 ${lh * 0.62}px ${fonts.display}`;
		ctx.letterSpacing = '0px';
		pw = ctx.measureText(pname).width;
	}
	const total = hasPartner ? lw + gap * 2 + times + pw : lw;
	const x = d.logoAnchor === 'left' ? d.logoX * W : d.logoAnchor === 'center' ? d.logoX * W - total / 2 : d.logoX * W - total;
	const y = d.logoY * H;
	if (draw) {
		drawLogo(ctx, x, y, lh, d.lockup === 'ink' ? C.ink : C.node, C.ink);
		if (hasPartner) {
			const cy = y + lh / 2;
			const cx = x + lw + gap + times / 2;
			ctx.save();
			ctx.strokeStyle = C.ink;
			ctx.globalAlpha = 0.55;
			ctx.lineWidth = (6 / 304) * lh;
			ctx.lineCap = 'round';
			ctx.beginPath();
			ctx.moveTo(cx - times / 2, cy - times / 2);
			ctx.lineTo(cx + times / 2, cy + times / 2);
			ctx.moveTo(cx + times / 2, cy - times / 2);
			ctx.lineTo(cx - times / 2, cy + times / 2);
			ctx.stroke();
			ctx.restore();
			const px = cx + times / 2 + gap;
			if (partner) ctx.drawImage(partner.canvas, px, cy - ph / 2, pw, ph);
			else {
				ctx.fillStyle = C.ink;
				ctx.textBaseline = 'middle';
				ctx.textAlign = 'left';
				ctx.font = `400 ${lh * 0.62}px ${fonts.display}`;
				ctx.fillText(pname, px, cy + lh * 0.03);
			}
		}
	}
	return { x, y, w: total, h: lh };
}

/** The foot line: mono capitals at the left and right, footInset units in from the bottom and sides. */
function drawFoot(ctx: Ctx, d: Design, u: number, W: number, H: number, ink: string, fonts: Fonts) {
	const fs = Math.max(d.footSize * u, d.minText * u * 0.8);
	const inset = d.footInset * u;
	const mid = H - inset - fs * 0.5;
	const track = (d.footTracking / 1000) * fs;
	ctx.save();
	ctx.fillStyle = ink;
	ctx.font = `400 ${fs}px ${fonts.mono}`;
	ctx.letterSpacing = `${track}px`;
	ctx.textBaseline = 'middle';
	ctx.textAlign = 'left';
	if (d.footLeft.trim()) ctx.fillText(d.footLeft.toUpperCase(), inset, mid);
	ctx.textAlign = 'right';
	if (d.footRight.trim()) ctx.fillText(d.footRight.toUpperCase(), W - inset + track, mid);
	ctx.restore();
	ctx.letterSpacing = '0px';
}

/** Where a picture goes: the drawing's box inside the image (and inside the rules). */
export function artBox(d: Design): Rect | null {
	const { w: W, h: H } = frameOf(d);
	const u = unitOf(d);
	const rulesOn = d.rules && (d.ruleTop || d.ruleBottom || d.ruleLeft);
	const top = rulesOn && d.ruleTop ? d.ruleInset * u : 0;
	const left = rulesOn && d.ruleLeft ? d.ruleInset * u : 0;
	const bottom = rulesOn && d.ruleBottom ? H - d.ruleFoot * u : H;
	let r: Rect;
	if (d.art === 'globe') {
		const rad = d.artSize * W * 1.04;
		r = { x: d.artX * W - rad, y: d.artY * H - rad, w: rad * 2, h: rad * 2 };
	} else if (d.art === 'cube') {
		const e = d.artSize * W;
		r = { x: d.artX * W - e, y: d.artY * H - e * 2.2, w: e * 2, h: e * 2.35 };
	} else return null;
	const x0 = Math.max(left, r.x);
	const y0 = Math.max(top, r.y);
	const x1 = Math.min(W, r.x + r.w);
	const y1 = Math.min(bottom, r.y + r.h);
	return x1 - x0 > 4 && y1 - y0 > 4 ? { x: x0, y: y0, w: x1 - x0, h: y1 - y0 } : null;
}

export type Drawn = { text: Rect; notes: Rect[]; logo: Rect | null; art: Rect | null; loader: Rect | null; foot: Rect | null; frame: { w: number; h: number } };

/** Draws a design on a context already scaled to the frame's pixels. `svg` leaves the grain out. */
export function drawDesign(ctx: Ctx, d: Design, fonts: Fonts, opts: { picture?: Picture | null; partner?: Picture | null; svg?: boolean; motion?: Motion; keep?: Rect[] } = {}): Drawn {
	const { w: W, h: H } = frameOf(d);
	const u = unitOf(d);
	const C = colorsOf(d.theme);
	const motion = opts.motion ?? {};
	ctx.save();
	ctx.fillStyle = C.bg;
	ctx.fillRect(0, 0, W, H);
	const size = fittedSize(ctx, d, u, fonts);
	const laid = d.hideWords ? { x: 0, y: 0, w: 0, h: 0 } : drawWords(ctx, d, size, C.ink, C.node, fonts, true);
	if (!opts.svg) drawGrain(ctx, d.grain, C.dark);
	const noteFs = Math.max(d.noteSize * u, 9);
	const nw = d.noteWidth * W;
	const notes = d.hideWords
		? []
		: [drawNote(ctx, d.note, d.noteX * W, d.noteY * H, nw, noteFs, fonts.mono, '#000', true, true), drawNote(ctx, d.note2, d.note2Right ? d.note2X * W - nw : d.note2X * W, d.note2Y * H, nw, noteFs, fonts.mono, '#000', true, true)];
	const lockAt = drawLockup(ctx, d, u, C, fonts, opts.partner ?? null, false);
	const avoid: Rect[] = [laid, ...notes.filter((r) => r.w), ...(lockAt ? [lockAt] : []), ...(opts.keep ?? [])];
	if (d.foot) {
		const ffs = Math.max(d.footSize * u, d.minText * u * 0.8);
		avoid.push({ x: 0, y: H - d.footInset * u - ffs * 2.2, w: W, h: ffs * 2.6 + d.footInset * u });
	}
	const rulesOn = d.rules && (d.ruleTop || d.ruleBottom || d.ruleLeft);
	const ri = d.ruleInset * u;
	const rf = d.ruleFoot * u;
	const bottom = rulesOn && d.ruleBottom ? H - rf : H;
	const art = artBox(d);
	let loader: Rect | null = null;
	if (opts.picture && art) {
		const p = opts.picture;
		const k = Math.max(art.w / p.width, art.h / p.height);
		ctx.save();
		ctx.beginPath();
		ctx.rect(art.x, art.y, art.w, art.h);
		ctx.clip();
		ctx.drawImage(p.canvas, art.x + (art.w - p.width * k) / 2, art.y + (art.h - p.height * k) / 2, p.width * k, p.height * k);
		if (d.shade > 0) {
			ctx.fillStyle = tokenAlpha('bg-dark', Math.min(0.92, d.shade / 100), 'dark');
			ctx.fillRect(art.x, art.y, art.w, art.h);
		}
		ctx.restore();
		drawCorners(ctx, art, 16 * u, Math.max(1, u), C.ink);
	} else if (d.art === 'globe' || d.art === 'cube') {
		ctx.save();
		if (rulesOn) {
			ctx.beginPath();
			const top = d.ruleTop ? ri : 0;
			const left = d.ruleLeft ? ri : 0;
			ctx.rect(left, top, W - left, bottom - top);
			ctx.clip();
		}
		if (d.art === 'globe') drawGlobe(ctx, { cx: d.artX * W, cy: d.artY * H, r: d.artSize * W, tilt: d.artTilt, seed: d.seed, nodes: d.artNodes, nodeSize: d.nodeSize, ring: d.artRing, pole: d.artPole }, u, W, bottom, C.grid, C.node, C.bg, avoid, motion);
		else drawCube(ctx, { x: d.artX * W, y: d.artY * H, size: d.artSize * W, seed: d.seed, nodes: d.artNodes, nodeSize: d.nodeSize }, u, W, bottom, C.grid, C.node, C.bg, avoid, motion);
		ctx.restore();
	}
	if (rulesOn) drawRules(ctx, u, W, H, ri, rf, { top: d.ruleTop, bottom: d.ruleBottom, left: d.ruleLeft }, C.grid, motion.march ?? 0);
	if (d.art === 'loader') loader = drawLoader(ctx, d.loaderX * W, d.loaderY * H, d.loaderW * W, d.progress, d.loaderLabel, fonts.mono, C.ink, C.node, C.bg, motion);
	const text = d.hideWords ? { x: d.textX * W, y: d.textY * H, w: 0, h: 0 } : drawWords(ctx, d, size, C.ink, C.node, fonts);
	if (!d.hideWords) {
		if (notes[0]) drawNote(ctx, d.note, notes[0].x, notes[0].y, nw, noteFs, fonts.mono, C.ink);
		if (notes[1]) drawNote(ctx, d.note2, notes[1].x, notes[1].y, nw, noteFs, fonts.mono, C.ink);
	}
	const logo = drawLockup(ctx, d, u, C, fonts, opts.partner ?? null, true);
	if (d.foot) drawFoot(ctx, d, u, W, H, C.ink, fonts);
	ctx.restore();
	const footFs = Math.max(d.footSize * u, d.minText * u * 0.8);
	return {
		text,
		notes: notes.filter((n) => n.w && n.h),
		logo,
		art,
		loader,
		foot: d.foot ? { x: 0, y: H - d.footInset * u - footFs * 1.4, w: W, h: footFs * 1.8 } : null,
		frame: { w: W, h: H },
	};
}

export { drawMark, logoDoc };
