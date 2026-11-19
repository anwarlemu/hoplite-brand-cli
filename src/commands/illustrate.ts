import { dirname, resolve } from 'node:path';
import type { Command } from 'commander';
import { display, num, write } from '../assets/io.js';
import { readPicture } from '../assets/picture.js';
import { buildIllustration, illustrateData, type Settings } from '../illustrate/build.js';
import { cli } from '../lib/brand.js';
import { unknownName } from '../lib/names.js';
import { emit } from '../lib/output.js';

type Flags = Record<string, string | boolean | undefined>;

/** `illustrate`'s names, for --list, the manifest and the agent guide. */
export function illustrateNames() {
	const d = illustrateData();
	return {
		subjects: Object.fromEntries(Object.entries(d.subjects).map(([k, v]) => [k, { kind: v.kind, picture: v.picture, size: v.size, source: v.$source }])),
		palettes: Object.fromEntries(Object.entries(d.palettes).map(([k, v]) => [k, { theme: v.theme, transparent: !!v.transparent, source: v.$source }])),
		formats: ['svg', 'png'],
		rules: 'brand/illustration.md',
	};
}

export async function illustrate(subject: string | undefined, flags: Flags) {
	const cwd = process.cwd();
	if (flags.list) {
		const names = illustrateNames();
		emit({ json: !!flags.json }, names, () => [
			`Subjects (${cli()} illustrate <subject>):`,
			...Object.entries(names.subjects).map(([k, v]) => `  ${k.padEnd(8)} ${v.kind.padEnd(8)} ${v.size.join('x').padEnd(10)} ${v.source}`),
			`Palettes (--palette): ${Object.keys(names.palettes).join(', ')}`,
			'Any picture: --image <file> (the window subject). Rules: brand/illustration.md',
		].join('\n'));
		return names;
	}
	const formats = String(flags.format ?? 'svg,png').split(',').map((f) => f.trim().toLowerCase()).filter(Boolean);
	for (const f of formats) if (f !== 'svg' && f !== 'png') throw unknownName('format', f, ['svg', 'png']);
	const scale = num('scale', flags.scale ?? '2', 1, 4, { integer: true })!;
	const settings: Partial<Settings> = {};
	if (typeof flags.size === 'string') {
		const m = /^(\d+)\s*[x×]\s*(\d+)$/i.exec(flags.size);
		if (!m) throw new Error(`--size takes WIDTHxHEIGHT, such as 1200x630; got \`${flags.size}\``);
		settings.width = Number(m[1]);
		settings.height = Number(m[2]);
	}
	for (const k of ['seed', 'nodes', 'tilt', 'progress', 'shade'] as const) if (flags[k] !== undefined) settings[k] = Number(flags[k]);
	if (typeof flags.palette === 'string') settings.palette = flags.palette;
	if (typeof flags.label === 'string') settings.label = flags.label;
	const picture = typeof flags.image === 'string' ? await readPicture(cwd, flags.image, 2000) : null;
	const built = buildIllustration({ subject, picture, settings, svg: formats.includes('svg'), png: formats.includes('png'), scale });
	const outArg = typeof flags.out === 'string' ? resolve(cwd, flags.out) : resolve(cwd, `illustration-${built.subject}`);
	const base = /\.(svg|png)$/i.test(outArg) ? outArg.slice(0, -4) : outArg;
	const files: string[] = [];
	if (built.svg) {
		write(`${base}.svg`, built.svg);
		files.push(display(cwd, `${base}.svg`));
	}
	if (built.png) {
		write(`${base}.png`, built.png);
		files.push(display(cwd, `${base}.png`));
	}
	void dirname;
	const doc = { files, subject: built.subject, kind: built.kind, source: built.source, size: { width: built.width, height: built.height, pngScale: scale }, settings: built.settings };
	emit({ json: !!flags.json }, doc, () => [`Wrote ${files.join(' and ')}`, `${built.kind} · palette ${built.settings.palette} · seed ${built.settings.seed}`].join('\n'));
	return doc;
}

export function registerIllustrate(program: Command) {
	program
		.command('illustrate [subject]')
		.description('Draw in the brand\'s own style (globe, dome, cube, node, loader, or a picture in a window): SVG with vector shapes and PNG')
		.option('--image <file>', 'any picture, framed as the window subject')
		.option('--palette <name>', 'light (default), night, black or transparent')
		.option('--size <WxH>', 'frame size, such as 1200x630')
		.option('--seed <n>', 'which globe or cube is drawn (default 3)')
		.option('--nodes <n>', 'how many cog nodes, 0 to 12')
		.option('--tilt <deg>', 'globe and dome: how far we look down on the pole, 0 to 90')
		.option('--progress <n>', 'loader: how far along, 0 to 100')
		.option('--label <text>', 'loader: the label over the bar')
		.option('--shade <percent>', 'window: darken the picture, 0 to 92')
		.option('--format <list>', 'svg, png or svg,png', 'svg,png')
		.option('--scale <n>', 'PNG scale: 1 to 4', '2')
		.option('--out <path>', 'output path without extension (default: ./illustration-<subject>)')
		.option('--list', 'subjects and palettes')
		.option('--json', 'JSON output')
		.action(async (subject: string | undefined, _o: unknown, c: Command) => {
			await illustrate(subject, c.optsWithGlobals() as Flags);
		})
		.addHelpText('after', () => ['', 'Examples:', `  ${cli()} illustrate globe --palette night --seed 12`, `  ${cli()} illustrate cube --palette transparent --size 800x800`, `  ${cli()} illustrate --image photo.jpg --shade 40`, '', 'Rules and sources: brand/illustration.md.'].join('\n'));
}
