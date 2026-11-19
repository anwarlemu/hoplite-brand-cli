import { brandFonts, surface, toPng, toSvg } from './canvas.js';
import { pick, unknown } from './io.js';
import { lockupNames } from './logo.js';
import { clampDim, designFor, drawDesign, frameOf, imageDoc, TEMPLATES, themeNames, type Design, type Template } from './og.js';
import { readPicture, type Picture } from './picture.js';
import type { Motion } from './scene.js';

// Share images and social posts as an API: a request (template, size, copy, positions) becomes a design, and a design
// becomes PNG and SVG. The `image` command is a thin layer over this.

/** Every size id with its pixels and the names it also answers to. */
export function imageSizes(): { id: string; group: string; label: string; width: number; height: number; aliases: string[] }[] {
	return Object.entries(imageDoc().sizes).map(([id, s]) => ({ id, group: s.group, label: s.label, width: s.w, height: s.h, aliases: s.aliases ?? [] }));
}

/** A size as typed: an id (`og`, `story`), an alias (`x`, `16:9`), or `custom`. */
export function sizeId(typed: string): string {
	const t = typed.trim().toLowerCase();
	if (t === 'custom') return 'custom';
	const hit = imageSizes().find((s) => s.id === t || s.aliases.includes(t));
	if (!hit) throw unknown('size', typed, [...imageSizes().map((s) => s.id), 'custom']);
	return hit.id;
}

export type ImageRequest = { template: string; size?: string; width?: number; height?: number; set?: Partial<Design> };

/** The design a request draws: the template's opening design at the size, then the request's settings. */
export function designOf(req: ImageRequest): Design {
	const template = pick('template', req.template, TEMPLATES) as Template;
	const size = req.size ? sizeId(req.size) : 'og';
	if (size === 'custom' && (!req.width || !req.height)) throw new Error('A custom size needs --width and --height (160 to 4000).');
	if (size !== 'custom' && (req.width || req.height)) throw new Error(`--width and --height go with --size custom, not ${size}.`);
	const dims = size === 'custom' ? { w: clampDim(req.width!), h: clampDim(req.height!) } : undefined;
	const set = Object.fromEntries(Object.entries(req.set ?? {}).filter(([, v]) => v !== undefined)) as Partial<Design>;
	const d: Design = { ...designFor(template, size, dims), ...set };
	d.theme = pick('theme', d.theme, themeNames());
	d.lockup = pick('lockup', d.lockup, lockupNames().filter((l) => l !== 'mark')) as Design['lockup'];
	return d;
}

/** Reads a picture for a design (`none` or empty is no picture). */
export async function pictureAt(cwd: string, path: string | undefined, max = 1600): Promise<Picture | null> {
	if (!path || path === 'none') return null;
	return readPicture(cwd, path, max);
}

export type Rendered = { png?: Buffer; svg?: string; width: number; height: number };

/** Draws a design. `scale` multiplies the PNG's pixels; the SVG is at the frame size, without the raster grain. */
export function renderDesign(d: Design, pictures: { picture?: Picture | null; partner?: Picture | null } = {}, opts: { png?: boolean; svg?: boolean; scale?: number; motion?: Motion } = { png: true }): Rendered {
	if (pictures.picture && !imageDoc().templates[d.template].picture) throw new Error(`The ${d.template} template holds no picture; --image goes with ${TEMPLATES.filter((t) => imageDoc().templates[t].picture).join(', ')}.`);
	const L = frameOf(d);
	const scale = opts.scale ?? 1;
	const out: Rendered = { width: Math.round(L.w * scale), height: Math.round(L.h * scale) };
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

/** The text slots each template draws (its flags). */
export function slotsOf(t: Template): string[] {
	switch (t) {
		case 'globe':
		case 'cube':
			return ['headline', 'note', 'note2'];
		case 'banner':
			return ['headline', 'note'];
		case 'horizon':
			return ['headline', 'foot-left', 'foot-right'];
		case 'loader':
			return ['headline', 'note', 'progress', 'loader-label'];
		case 'logo':
			return ['foot-left', 'foot-right'];
		case 'partner':
			return ['headline', 'partner-name', 'foot-left', 'foot-right'];
	}
}

/** What `manifest` and `image --list` say about the templates. */
export function imageCatalog() {
	const doc = imageDoc();
	return {
		templates: TEMPLATES.map((id) => ({ id, name: doc.templates[id].label, description: doc.templates[id].description, slots: slotsOf(id), picture: doc.templates[id].picture ? 'image (any picture, in the drawing\'s place)' : 'none', partner: id === 'partner' ? 'partner (a logo file, only when passed)' : undefined })),
		sizes: [...imageSizes(), { id: 'custom', group: 'custom', label: 'Custom', width: 0, height: 0, aliases: [], note: '--width and --height, 160 to 4000' }],
		social: doc.social,
		themes: Object.entries(doc.themes).map(([id, t]) => ({ id, label: t.label, description: t.description })),
		lockups: lockupNames().filter((l) => l !== 'mark'),
		notes: doc.notes,
	};
}
