import { join, resolve } from 'node:path';
import type { Command } from 'commander';
import { display, num, pick, write, type OutFile } from '../assets/io.js';
import { encode, hasFfmpeg, videoCatalog, videoDesign, videoDoc, videoFrames, videoStill, videoTemplates, writeFrame, type VideoTemplate } from '../assets/video.js';
import { cli } from '../lib/brand.js';
import { emit } from '../lib/output.js';
import { settingsFrom } from './image.js';

// `video`: short motion pieces (globe, cube, horizon, loader, logo) at square, vertical and landscape, as MP4 and WebM
// through ffmpeg or PNG frames, and a still frame for posters and reduced motion.

type Opts = Record<string, string | boolean | undefined> & { json?: boolean };

export function videoCommand(program: Command) {
	program
		.command('video [template]')
		.description('Motion pieces (globe, cube, horizon, loader, logo) at square, vertical and landscape: MP4 and WebM through ffmpeg, else PNG frames; --still for one frame')
		.option('-s, --size <size>', 'square (default), vertical or landscape')
		.option('--theme <name>', 'light (default), night or black')
		.option('--headline <text>', 'the headline (globe, cube, horizon, loader)')
		.option('--note <text>', 'globe, cube, loader: the first note')
		.option('--note2 <text>', 'globe, cube: the second note')
		.option('--progress <n>', 'loader: where the bar fills to, 0 to 100')
		.option('--foot-left <text>', 'horizon, logo: the foot line\'s left side')
		.option('--foot-right <text>', 'horizon, logo: the foot line\'s right side')
		.option('--seed <n>', 'which globe or cube is drawn')
		.option('--seconds <n>', 'length, 2 to 20 (loops stay seamless at multiples of 4)')
		.option('--fps <n>', '12 to 60 (default 30)')
		.option('-f, --format <format>', 'mp4, webm, frames or all (default: mp4 and webm with ffmpeg, frames without)')
		.option('--still <seconds>', 'one PNG frame at this time instead of a video (a poster frame, or for reduced motion)')
		.option('-o, --out <dir>', 'output directory (default video/); with --still, a .png file name')
		.option('--list', 'templates, sizes and the curves they move on')
		.option('--json', 'JSON output')
		.action(async (template: string | undefined, _o, cmd: Command) => runVideo(template, cmd.optsWithGlobals() as Opts))
		.addHelpText('after', () => [
			'',
			'Examples:',
			`  ${cli()} video globe --size vertical --theme night`,
			`  ${cli()} video loader --progress 80 --headline "Almost out of beta."`,
			`  ${cli()} video logo --size landscape`,
			`  ${cli()} video globe --still 0 --out poster.png      (the first frame as a PNG)`,
			'',
			'Frames are a pure function of time: the same flags give the same frames. Motion is the website\'s: marching dashes, 60 degree node turns, a bar on the upload curve.',
		].join('\n'));
}

async function runVideo(positional: string | undefined, o: Opts) {
	const cwd = process.cwd();
	if (o.list) {
		const cat = videoCatalog();
		emit(o, cat, () => [
			...cat.templates.map((t) => `${t.id.padEnd(9)} ${t.seconds} s${t.loop ? ' loop' : ''}. ${t.description}`),
			'',
			`Sizes: ${cat.sizes.map((s) => `${s.id} ${s.width}x${s.height}`).join(', ')}; ${cat.fps} fps by default.`,
			cat.encoder,
		].join('\n'));
		return;
	}
	if (!positional) throw new Error(`Name a video: ${cli()} video globe (one of ${videoTemplates().join(', ')}).`);
	const id = pick('video template', positional, videoTemplates()) as VideoTemplate;
	const ff = hasFfmpeg();
	const format = pick('format', String(o.format ?? (ff ? 'all' : 'frames')), ['mp4', 'webm', 'frames', 'all'] as const);
	if ((format === 'mp4' || format === 'webm') && !ff) throw new Error(`${format.toUpperCase()} needs ffmpeg on the PATH. Without it: --format frames.`);
	const fps = num('fps', o.fps, 12, 60, { integer: true }) ?? videoDoc().fps;
	const seconds = num('seconds', o.seconds, 2, 20) ?? videoDoc().templates[id].seconds;
	const seed = num('seed', o.seed, 1, 1_000_000_000, { integer: true });
	const size = pick('size', String(o.size ?? 'square'), Object.keys(videoDoc().sizes));
	const set = settingsFrom(o);
	delete set.theme;
	delete set.seed;
	const opts = { template: id, size, theme: typeof o.theme === 'string' ? o.theme : undefined, seed, seconds, set };
	const d = videoDesign(opts);
	const name = `${id}-${size}${d.theme === 'light' ? '' : `-${d.theme}`}`;
	const still = num('still', o.still, 0, seconds);
	const stillFile = still !== undefined && typeof o.out === 'string' && /\.png$/i.test(o.out) ? resolve(cwd, o.out) : undefined;
	const dir = stillFile ? resolve(stillFile, '..') : resolve(cwd, typeof o.out === 'string' ? o.out : 'video');
	const files: OutFile[] = [];
	if (still !== undefined) {
		const r = videoStill(opts, still);
		const path = stillFile ?? join(dir, `${name}-${still}s.png`);
		write(path, r.png);
		files.push({ path: display(cwd, path), format: 'png', width: r.width, height: r.height });
	} else if (format === 'frames') {
		const frameDir = join(dir, `${name}-frames`);
		let n = 0;
		let wh = { width: 0, height: 0 };
		for (const f of videoFrames({ ...opts, fps })) {
			writeFrame(frameDir, f.index, f.png());
			n++;
		}
		wh = { width: d.w, height: d.h };
		files.push({ path: display(cwd, frameDir), format: 'frames', frames: n, fps, ...wh });
	} else {
		const outputs = (format === 'all' ? (['mp4', 'webm'] as const) : [format]).map((f) => ({ path: join(dir, `${name}.${f}`), format: f as 'mp4' | 'webm' }));
		function* raw() {
			for (const f of videoFrames({ ...opts, fps })) yield f.rgba;
		}
		for (const e of await encode(raw(), { width: d.w, height: d.h, fps, outputs })) files.push({ path: display(cwd, e.path), format: e.format, seconds, fps, width: d.w, height: d.h });
	}
	emit(o, { files, encoder: ff ? 'ffmpeg' : 'frames' }, () => files.map((f) => `${f.path}  ${f.width}x${f.height}${f.frames ? `, ${f.frames} frames at ${f.fps} fps` : f.seconds ? `, ${f.seconds} s at ${f.fps} fps` : ''}`).join('\n'));
}
