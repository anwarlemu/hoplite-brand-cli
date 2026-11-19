import { readFileSync } from 'node:fs';
import { Path2D } from '@napi-rs/canvas';
import { pkgPath } from '../lib/paths.js';
import type { Ctx } from './canvas.js';

// The approved logo (brand/assets/logo.json): the mark and the wordmark as paths, drawn at any height in the colors a
// lockup names. Nothing else draws the logo, so every asset carries the same one.

type LogoDoc = {
	width: number;
	height: number;
	mark: { width: number; paths: string[] };
	wordmark: { x: number; paths: string[] };
	lockups: Record<string, { mark?: string; word?: string; part?: string; description: string }>;
};

let doc: LogoDoc | undefined;
export const logoDoc = () => (doc ??= JSON.parse(readFileSync(pkgPath('brand', 'assets', 'logo.json'), 'utf8')) as LogoDoc);
let markP: Path2D | undefined;
let wordP: Path2D | undefined;
const markPath = () => (markP ??= join(logoDoc().mark.paths));
const wordPath = () => (wordP ??= join(logoDoc().wordmark.paths));
function join(paths: string[]) {
	const p = new Path2D();
	for (const d of paths) p.addPath(new Path2D(d));
	return p;
}

/** Width over height of the whole lockup. */
export const logoRatio = () => logoDoc().width / logoDoc().height;
/** Width over height of the mark alone. */
export const markRatio = () => logoDoc().mark.width / logoDoc().height;
export const lockupNames = () => Object.keys(logoDoc().lockups);

/** The lockup `h` tall with its top left at (x, y): the mark in `mark`, the wordmark in `word`. Returns its width. */
export function drawLogo(ctx: Ctx, x: number, y: number, h: number, mark: string, word: string): number {
	const l = logoDoc();
	const k = h / l.height;
	ctx.save();
	ctx.translate(x, y);
	ctx.scale(k, k);
	ctx.fillStyle = mark;
	ctx.fill(markPath(), 'evenodd');
	ctx.fillStyle = word;
	ctx.fill(wordPath());
	ctx.restore();
	return l.width * k;
}

/** The mark alone, `h` tall with its top left at (x, y). Returns its width. */
export function drawMark(ctx: Ctx, x: number, y: number, h: number, color: string): number {
	const l = logoDoc();
	const k = h / l.height;
	ctx.save();
	ctx.translate(x, y);
	ctx.scale(k, k);
	ctx.fillStyle = color;
	ctx.fill(markPath(), 'evenodd');
	ctx.restore();
	return l.mark.width * k;
}

/** The wordmark alone, as the lockup sets it, `h` being the lockup's height; (x, y) is where the lockup's top left
 * would be. Returns the wordmark's width. */
export function drawWordmark(ctx: Ctx, x: number, y: number, h: number, color: string): number {
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
