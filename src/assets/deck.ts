import { readFileSync } from 'node:fs';
import { pkgPath } from '../lib/paths.js';
import { brandFonts, pixelsOf, surface, toPng, toSvg, type Ctx, type Fonts } from './canvas.js';
import { pick } from './io.js';
import { colorsOf, designFor, drawDesign, themeNames, unitOf, type Design, type Template } from './og.js';
import type { Picture } from './picture.js';
import { drawNode, drawNote, type Rect } from './scene.js';
import { drawFitted, fit } from './text.js';

// Deck slides at 1920 by 1080 (brand/assets/deck.json). Each type is laid out from one of the share image templates at
// this size, with the slide's own words added on the same measure: the title in light Chakra Petch, notes and
// attributions in Kode Mono capitals, cog nodes as bullets, and the rules, drawings and lockup the template draws.

export type SlideType = 'cover' | 'section' | 'statement' | 'bullets' | 'stat' | 'quote' | 'image' | 'end';
type SlideDoc = { name: string; from: Template; description: string; theme: string; slots: Record<string, string> };
type DeckDoc = { width: number; height: number; slides: Record<SlideType, SlideDoc> };

let doc: DeckDoc | undefined;
export const deckDoc = (): DeckDoc => (doc ??= JSON.parse(readFileSync(pkgPath('brand', 'assets', 'deck.json'), 'utf8')) as DeckDoc);
export const slideTypes = () => Object.keys(deckDoc().slides) as SlideType[];

export type Slide = { type: string; theme?: string; seed?: number; picture?: Picture | null } & Record<string, unknown>;

export function deckCatalog() {
	const d = deckDoc();
	return {
		size: { width: d.width, height: d.height },
		slides: slideTypes().map((id) => ({ id, name: d.slides[id].name, from: d.slides[id].from, description: d.slides[id].description, theme: d.slides[id].theme, slots: d.slides[id].slots })),
		themes: themeNames(),
	};
}

const RESERVED = ['type', 'theme', 'seed', 'picture', 'image'];

/** The slots a slide type takes, with what it was given over its opening copy. Unknown slots throw. */
export function slotsFor(type: SlideType, given: Record<string, unknown>): Record<string, string> {
	const def = deckDoc().slides[type].slots;
	const out: Record<string, string> = { ...def };
	for (const [k, v] of Object.entries(given)) {
		if (RESERVED.includes(k)) continue;
		if (!(k in def)) throw new Error(`A ${type} slide does not take "${k}". It takes ${Object.keys(def).map((s) => `"${s}"`).join(', ')}.`);
		if (Array.isArray(v) && v.every((x) => typeof x === 'string')) out[k] = v.join(' | ');
		else if (typeof v === 'string') out[k] = v;
		else throw new Error(`A ${type} slide's "${k}" takes text.`);
	}
	return out;
}

const W = 1920;
const H = 1080;

/** Draws one slide on a 1920 by 1080 context. */
export function drawSlide(ctx: Ctx, slide: Slide, fonts: Fonts = brandFonts(), opts: { svg?: boolean } = {}) {
	const type = pick('slide type', slide.type, slideTypes());
	const def = deckDoc().slides[type];
	const s = slotsFor(type, slide);
	const theme = slide.theme ? pick('theme', slide.theme, themeNames()) : def.theme;
	const C = colorsOf(theme);
	const base = (over: Partial<Design>): Design => ({ ...designFor(def.from, 'custom', { w: W, h: H }), theme, ...(slide.seed ? { seed: slide.seed } : {}), ...over });
	const u = unitOf({ size: 'custom', w: W, h: H });
	const draw = (d: Design, keep: Rect[] = [], picture: Picture | null = null) => drawDesign(ctx, d, fonts, { svg: opts.svg, keep, picture });
	const headSize = (d: Design) => d.textSize * u;

	switch (type) {
		case 'cover':
			draw(base({ headline: s.title ?? '', note: s.body ?? '', note2: s.note2 ?? '' }));
			break;
		case 'image':
			draw(base({ headline: s.title ?? '', note: s.body ?? '', note2: '' }), [], slide.picture ?? null);
			break;
		case 'statement':
			draw(base({ headline: s.title ?? '' }));
			break;
		case 'end':
			draw(base({ footLeft: s.url ?? '', footRight: s.tagline ?? '' }));
			break;
		case 'section': {
			const d0 = base({ headline: s.title ?? '', note: '', note2: '' });
			const numSize = headSize(d0) * 0.42;
			const numTop = d0.textY * H;
			const d = { ...d0, textY: (numTop + numSize * 2.2) / H };
			const num = (s.number ?? '').trim();
			draw(d, num ? [{ x: d.textX * W, y: numTop, w: numSize * 4, h: numSize * 1.6 }] : []);
			if (num) drawNote(ctx, num, d.textX * W, numTop, W * 0.3, numSize, fonts.mono, C.muted, false);
			break;
		}
		case 'bullets': {
			const items = (s.items ?? '').split('|').map((x) => x.trim()).filter(Boolean);
			if (items.length > 6) throw new Error(`A bullets slide holds up to 6 points; it was given ${items.length}. Split it.`);
			const d = base({ headline: s.title ?? '', art: 'none', note: '', note2: '' });
			const x = d.textX * W;
			const top = d.textY * H + headSize(d) * d.leading * 2 + 40 * u;
			const bottom = H - d.ruleFoot * u - 40 * u;
			const colW = W * 0.62;
			const size = Math.min(headSize(d) * 0.64, (bottom - top) / Math.max(1, items.length) / 1.9);
			const style = { family: fonts.display, weight: 300, size, tracking: 0, leading: 1.25, color: C.ink };
			const fitted = items.map((it) => fit(ctx, it, style, colW - size * 1.6, 2, 0.7, 'point'));
			const step = Math.min(size * 2.6, (bottom - top) / Math.max(1, items.length));
			draw(d);
			fitted.forEach((f, i) => {
				const y = top + i * step;
				drawNode(ctx, x + size * 0.36, y + f.style.size * 0.62, size * 0.3, C.node, C.bg, Math.PI / 6);
				drawFitted(ctx, f, x + size * 1.2, y);
			});
			break;
		}
		case 'stat': {
			const d0 = base({ headline: '', note: '', note2: '' });
			const x = d0.textX * W;
			const statSize = headSize(d0) * 2.6;
			const top = d0.textY * H;
			const stat = fit(ctx, s.stat ?? '', { family: fonts.display, weight: 300, size: statSize, tracking: -0.02, leading: 1.0, color: C.ink }, W * 0.3, 1, 0.5, 'stat');
			const title = s.title ? fit(ctx, s.title, { family: fonts.display, weight: 300, size: headSize(d0), tracking: 0, leading: 1.16, color: C.ink }, W * 0.3, 3, 0.6, 'title') : undefined;
			const titleTop = top + stat.height + 24 * u;
			const noteTop = titleTop + (title?.height ?? 0) + 40 * u;
			const noteFs = Math.max(d0.noteSize * u, 9);
			const keep: Rect[] = [{ x, y: top, w: stat.width, h: stat.height }];
			if (title) keep.push({ x, y: titleTop, w: title.width, h: title.height });
			if (s.body) keep.push({ x, y: noteTop, w: W * 0.3, h: noteFs * 6 });
			draw(d0, keep);
			drawFitted(ctx, stat, x, top);
			if (title) drawFitted(ctx, title, x, titleTop);
			if (s.body) drawNote(ctx, s.body, x, noteTop, W * 0.28, noteFs, fonts.mono, C.ink);
			break;
		}
		case 'quote': {
			const d = base({ headline: '', hideWords: true, art: 'none', note: '', note2: '' });
			const x = d.textX * W;
			const top = d.textY * H;
			const q = fit(ctx, `“${s.quote ?? ''}”`, { family: fonts.display, weight: 300, size: headSize(d) * 1.1, tracking: 0, leading: 1.16, color: C.ink }, W * 0.66, 5, 0.5, 'quote');
			draw(d);
			drawFitted(ctx, q, x, top);
			if (s.attribution) drawNote(ctx, s.attribution, x, top + q.height + 48 * u, W * 0.5, Math.max(d.noteSize * u * 1.2, 9), fonts.mono, C.muted, false);
			break;
		}
	}
}

export type SlideRender = { png?: Buffer; svg?: string; rgb?: Buffer; width: number; height: number };

/** One slide as PNG (and the RGB pixels a PDF page wants) and SVG. */
export function renderSlide(slide: Slide, opts: { png?: boolean; svg?: boolean; scale?: number } = { png: true }): SlideRender {
	const out: SlideRender = { width: W * (opts.scale ?? 1), height: H * (opts.scale ?? 1) };
	if (opts.png !== false) {
		const s = surface(W, H, { scale: opts.scale ?? 1 });
		drawSlide(s.ctx, slide);
		out.png = toPng(s, { opaque: true });
		const px = pixelsOf(s).data;
		const rgb = Buffer.alloc((px.length / 4) * 3);
		for (let i = 0, j = 0; i < px.length; i += 4, j += 3) {
			rgb[j] = px[i]!;
			rgb[j + 1] = px[i + 1]!;
			rgb[j + 2] = px[i + 2]!;
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
