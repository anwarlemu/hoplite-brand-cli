import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { pkgPath } from '../lib/paths.js';
import { brandFonts, pixelsOf, surface, toPng, type Ctx } from './canvas.js';
import { pick, write } from './io.js';
import { drawLogo, logoRatio } from './logo.js';
import { colorsOf, designFor, drawDesign, frameOf, themeNames, unitOf, type Design, type Template } from './og.js';

// Video: short motion pieces drawn on the canvas from the share image templates (brand/assets/video.json), moving the
// way the brand's website moves. Every frame is a pure function of its time, so the same inputs give the same frames.
// ffmpeg encodes MP4 (H.264) and WebM (VP9) when it is on the PATH; without it, the frames are written as PNG.

export type VideoTemplate = 'globe' | 'cube' | 'horizon' | 'loader' | 'logo';
type Curve = [number, number, number, number];
type VideoDoc = { fps: number; sizes: Record<string, [number, number]>; curves: Record<'turn' | 'fill' | 'pop' | 'draw', Curve>; templates: Record<VideoTemplate, { name: string; from: Template; seconds: number; loop: boolean; description: string }> };

let doc: VideoDoc | undefined;
export const videoDoc = (): VideoDoc => (doc ??= JSON.parse(readFileSync(pkgPath('brand', 'assets', 'video.json'), 'utf8')) as VideoDoc);
export const videoTemplates = () => Object.keys(videoDoc().templates) as VideoTemplate[];

export function hasFfmpeg(): boolean {
	if (process.env.DS_NO_FFMPEG) return false;
	return spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' }).status === 0;
}

export function videoCatalog() {
	const d = videoDoc();
	return {
		templates: videoTemplates().map((id) => ({ id, ...d.templates[id] })),
		sizes: Object.entries(d.sizes).map(([id, [width, height]]) => ({ id, width, height })),
		fps: d.fps,
		curves: d.curves,
		themes: themeNames(),
		formats: ['mp4', 'webm', 'frames', 'all'],
		encoder: 'ffmpeg (H.264 MP4, VP9 WebM) when installed; otherwise PNG frames.',
	};
}

/** A CSS cubic-bezier as a function of progress (0 to 1). */
export function bezier([x1, y1, x2, y2]: Curve) {
	const at = (a: number, b: number, t: number) => 3 * a * (1 - t) ** 2 * t + 3 * b * (1 - t) * t ** 2 + t ** 3;
	return (x: number) => {
		if (x <= 0) return 0;
		if (x >= 1) return 1;
		let lo = 0;
		let hi = 1;
		for (let i = 0; i < 40; i++) {
			const mid = (lo + hi) / 2;
			if (at(x1, x2, mid) < x) lo = mid;
			else hi = mid;
		}
		return at(y1, y2, (lo + hi) / 2);
	};
}
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

export type VideoOptions = { template: VideoTemplate; size: string; theme?: string; seed?: number; seconds?: number; set?: Partial<Design> };

/** The design a video draws: its template at the video size. */
export function videoDesign(o: VideoOptions): Design {
	const t = videoDoc().templates[pick('video template', o.template, videoTemplates())];
	const [w, h] = videoDoc().sizes[pick('size', o.size, Object.keys(videoDoc().sizes))]!;
	return { ...designFor(t.from, 'custom', { w, h }), ...(o.theme ? { theme: pick('theme', o.theme, themeNames()) } : {}), ...(o.seed ? { seed: o.seed } : {}), ...(o.set ?? {}) };
}

/** One frame at `time` seconds. */
export function drawVideoFrame(ctx: Ctx, o: VideoOptions, time: number) {
	const v = videoDoc();
	const id = pick('video template', o.template, videoTemplates());
	const t = v.templates[id];
	const seconds = o.seconds ?? t.seconds;
	const d = videoDesign(o);
	const fonts = brandFonts();
	// Dashes march two of their periods per 8 s (the site's 8 s linear march), a whole number per loop.
	const march = Math.round((seconds / 8) * 2) * (time / seconds);
	// Nodes turn 60deg in the first 15% of every 4 s, then rest.
	const turnCurve = bezier(v.curves.turn);
	const beat = time / 4;
	const turn = (Math.floor(beat) + turnCurve(clamp01((beat % 1) / 0.15))) * (Math.PI / 3);
	if (id === 'loader') {
		const fill = bezier(v.curves.fill)(clamp01(time / 1.2));
		const target = d.progress;
		drawDesign(ctx, { ...d, progress: Math.round((4 + (target - 4) * fill) * 10) / 10 }, fonts, { motion: { march, turn } });
		return;
	}
	if (id === 'logo') {
		drawDesign(ctx, { ...d, logo: false }, fonts, { motion: { march, turn } });
		const { w: W, h: H } = frameOf(d);
		const u = unitOf(d);
		const C = colorsOf(d.theme);
		const pop = bezier(v.curves.pop)(clamp01(time / 0.48));
		const lh = d.logoSize * u;
		const lw = lh * logoRatio();
		const x = d.logoX * W - lw / 2;
		const y = d.logoY * H;
		ctx.save();
		ctx.globalAlpha = pop;
		ctx.translate(x + lw / 2, y + lh / 2);
		ctx.scale(0.92 + 0.08 * pop, 0.92 + 0.08 * pop);
		drawLogo(ctx, -lw / 2, -lh / 2, lh, d.lockup === 'ink' ? C.ink : C.node, C.ink);
		ctx.restore();
		return;
	}
	drawDesign(ctx, d, fonts, { motion: { march, turn } });
}

/** The frames as straight RGBA buffers, one at a time. */
export function* videoFrames(o: VideoOptions & { fps: number }): Generator<{ index: number; rgba: Buffer; png: () => Buffer }> {
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

/** One still frame as PNG. */
export function videoStill(o: VideoOptions, time: number): { png: Buffer; width: number; height: number } {
	const { w, h } = frameOf(videoDesign(o));
	const s = surface(w, h);
	drawVideoFrame(s.ctx, o, time);
	return { png: toPng(s, { opaque: true }), width: w, height: h };
}

export type Encoded = { path: string; format: string };

/** Pipes raw RGBA frames into one ffmpeg run that writes each asked format. */
export async function encode(frames: Iterable<Buffer>, o: { width: number; height: number; fps: number; outputs: { path: string; format: 'mp4' | 'webm' }[] }): Promise<Encoded[]> {
	for (const out of o.outputs) mkdirSync(dirname(out.path), { recursive: true });
	const args = ['-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${o.width}x${o.height}`, '-r', String(o.fps), '-i', '-'];
	for (const out of o.outputs) {
		args.push('-map_metadata', '-1', '-fflags', '+bitexact', '-flags:v', '+bitexact');
		if (out.format === 'mp4') args.push('-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-threads', '1', '-movflags', '+faststart', out.path);
		else args.push('-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '30', '-pix_fmt', 'yuv420p', '-row-mt', '0', '-threads', '1', out.path);
	}
	const ff = spawn('ffmpeg', args, { stdio: ['pipe', 'ignore', 'pipe'] });
	let err = '';
	ff.stderr.on('data', (d) => (err += d));
	const done = new Promise<number>((res) => ff.on('close', (code) => res(code ?? 1)));
	let closed = false;
	ff.stdin.on('error', () => (closed = true));
	ff.on('close', () => (closed = true));
	for (const f of frames) {
		if (closed) break;
		if (!ff.stdin.write(f)) await Promise.race([new Promise((r) => ff.stdin.once('drain', r)), done]);
	}
	ff.stdin.end();
	const code = await done;
	if (code !== 0) throw new Error(`ffmpeg failed: ${err.trim() || `exit ${code}`}`);
	return o.outputs.map((x) => ({ path: x.path, format: x.format }));
}

/** Writes a PNG frame into a folder (the fallback without ffmpeg). */
export function writeFrame(dir: string, index: number, png: Buffer) {
	const path = join(dir, `frame-${String(index).padStart(5, '0')}.png`);
	write(path, png);
	return path;
}
