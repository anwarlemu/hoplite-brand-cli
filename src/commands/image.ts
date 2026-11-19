import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import type { Command } from 'commander';
import { designOf, imageCatalog, imageSizes, pictureAt, renderDesign } from '../assets/image.js';
import { display, num, pick, write, type OutFile } from '../assets/io.js';
import { imageDoc, TEMPLATES, type Design } from '../assets/og.js';
import { readPicture } from '../assets/picture.js';
import { cli } from '../lib/brand.js';
import { emit } from '../lib/output.js';

// `image`: share images and social posts (the brand social tool's templates, sizes and themes) as PNG and SVG.

type Opts = Record<string, string | boolean | undefined> & { json?: boolean };

export function imageCommand(program: Command) {
	const c = program
		.command('image [template]')
		.description('Share images and social posts (globe, cube, horizon, banner, loader, logo, partner) as PNG and SVG')
		.option('-t, --template <name>', 'globe, cube, horizon, banner, loader, logo or partner')
		.option('-s, --size <size>', 'og, square, portrait, story, landscape, x-banner, linkedin-banner, ... (--list), custom, social (the social set) or all')
		.option('--width <px>', 'custom size width, 160 to 4000')
		.option('--height <px>', 'custom size height, 160 to 4000')
		.option('--theme <name>', 'light (default), night or black')
		.option('--lockup <name>', 'accent (the horse in orange, default) or ink (one color)')
		.option('--headline <text>', 'the headline; *a phrase* sets it in the orange')
		.option('--note <text>', 'globe, cube, banner, loader: the first note')
		.option('--note2 <text>', 'globe, cube: the second note')
		.option('--foot-left <text>', 'horizon, logo, partner: the foot line\'s left side')
		.option('--foot-right <text>', 'horizon, logo, partner: the foot line\'s right side')
		.option('--partner-name <text>', 'partner: the partner\'s name (default Acme)')
		.option('--partner <file>', 'partner: the partner\'s logo file instead of the name')
		.option('--progress <n>', 'loader: how far along, 0 to 100')
		.option('--loader-label <text>', 'loader: the label over the bar')
		.option('-i, --image <file>', 'any picture, drawn in the drawing\'s place inside corner ticks')
		.option('--shade <percent>', 'darken the picture, 0 to 92')
		.option('--seed <n>', 'which globe or cube is drawn (1 to 1000000000; default 3)')
		.option('--text-x <share>', 'headline anchor across, a share of the width')
		.option('--text-y <share>', 'headline top, a share of the height')
		.option('--text-size <px>', 'headline size in units (a pixel of the 1200 by 630 preview)')
		.option('--text-width <share>', 'wrap width, a share of the width')
		.option('--input <file>', 'a JSON file of these settings ({ "headline": "...", "note": "..." })')
		.option('-f, --format <format>', 'png, svg or both (default: both, or the format an --out file name ends in)')
		.option('--scale <n>', 'PNG pixel multiple, 1 to 4', '1')
		.option('-o, --out <path>', 'a directory (default assets/), or one .png or .svg file')
		.option('--all', 'every template at every size of the social set')
		.option('--list', 'templates, sizes, themes and lockups')
		.option('--json', 'JSON output')
		.action(async (template: string | undefined, _o, cmd: Command) => runImage(template, cmd.optsWithGlobals() as Opts));
	c.addHelpText('after', () => imageHelp());
}

export function imageHelp(): string {
	const b = cli();
	return [
		'',
		'Examples:',
		`  ${b} image globe --headline "Everything a swarm of agents *needs*."`,
		`  ${b} image cube --size portrait --theme night --note "..." --note2 "..."`,
		`  ${b} image horizon --size social --out posts         (og, square, portrait, story, landscape, X and LinkedIn banners)`,
		`  ${b} image partner --partner-name "Acme" --size square`,
		`  ${b} image globe --image photo.jpg --shade 40`,
		`  ${b} image banner --size custom --width 1600 --height 900`,
		'',
		'Templates draw as the brand social tool draws them; the same inputs write the same bytes.',
	].join('\n');
}

const TEXT: [string, keyof Design][] = [['headline', 'headline'], ['note', 'note'], ['note2', 'note2'], ['footLeft', 'footLeft'], ['footRight', 'footRight'], ['partnerName', 'partnerName'], ['loaderLabel', 'loaderLabel'], ['theme', 'theme'], ['lockup', 'lockup']];
const NUMBERS: [string, keyof Design, number, number][] = [['progress', 'progress', 0, 100], ['shade', 'shade', 0, 92], ['seed', 'seed', 1, 1_000_000_000], ['textX', 'textX', -1, 2], ['textY', 'textY', -1, 2], ['textSize', 'textSize', 4, 600], ['textWidth', 'textWidth', 0.05, 1]];
const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

/** The design settings a set of flags (or an --input file) asks for. */
export function settingsFrom(o: Record<string, unknown>): Partial<Design> {
	const set: Record<string, unknown> = {};
	for (const [flag, key] of TEXT) if (typeof o[flag] === 'string') set[key] = (o[flag] as string).replace(/\\n/g, '\n');
	for (const [flag, key, min, max] of NUMBERS) {
		const v = num(kebab(flag), o[flag], min, max);
		if (v !== undefined) set[key] = v;
	}
	return set as Partial<Design>;
}

const INPUT_KEYS = new Set([...TEXT.map(([f]) => f), ...NUMBERS.map(([f]) => f), 'template', 'size', 'width', 'height', 'image', 'partner']);

async function runImage(positional: string | undefined, o: Opts) {
	const cwd = process.cwd();
	if (o.list) {
		const cat = imageCatalog();
		emit(o, cat, () => [
			...cat.templates.map((t) => `${t.id.padEnd(9)} ${t.name}. ${t.description} Text: ${t.slots.map((s) => `--${s}`).join(', ')}. Picture: ${t.picture}.`),
			'',
			`Sizes: ${cat.sizes.filter((s) => s.width).map((s) => `${s.id} ${s.width}x${s.height}`).join(', ')}, custom`,
			`Social set (--size social): ${cat.social.join(', ')}`,
			`Themes: ${cat.themes.map((t) => t.id).join(', ')}. Lockups: ${cat.lockups.join(', ')}.`,
		].join('\n'));
		return;
	}
	let file: Record<string, unknown> = {};
	if (typeof o.input === 'string') {
		try {
			file = JSON.parse(readFileSync(resolve(cwd, o.input), 'utf8'));
		} catch (err) {
			throw new Error(`Could not read ${o.input} as JSON (${(err as Error).message}).`);
		}
		for (const k of Object.keys(file)) if (!INPUT_KEYS.has(k)) throw new Error(`${o.input}: unknown setting "${k}". Use ${[...INPUT_KEYS].join(', ')}.`);
	}
	const merged: Record<string, unknown> = { ...file, ...Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) };
	if (positional && o.template && positional.toLowerCase() !== String(o.template).toLowerCase()) throw new Error(`Pass the template once (got ${positional} and --template ${o.template}).`);
	const named = positional ?? (merged.template as string | undefined);
	const outExt = typeof o.out === 'string' ? /\.(png|svg)$/i.exec(o.out)?.[1]?.toLowerCase() : undefined;
	const format = pick('format', String(o.format ?? outExt ?? 'both'), ['png', 'svg', 'both'] as const);
	const scale = num('scale', o.scale, 1, 4) ?? 1;
	const width = num('width', merged.width, 160, 4000, { integer: true });
	const height = num('height', merged.height, 160, 4000, { integer: true });
	const set = settingsFrom(merged);
	const sizeArg = typeof merged.size === 'string' ? merged.size : undefined;
	const sizesFor = (s: string | undefined) => (s?.toLowerCase() === 'all' ? imageSizes().map((x) => x.id) : s?.toLowerCase() === 'social' ? imageDoc().social : [s]);
	const jobs: { template: string; size?: string }[] = [];
	if (o.all) {
		if (named) throw new Error('Pass a template or --all, not both.');
		for (const t of TEMPLATES) for (const size of sizesFor(sizeArg ?? 'social')) jobs.push({ template: t, size });
	} else {
		if (!named) throw new Error(`Name a template: ${cli()} image globe (one of ${TEMPLATES.join(', ')}; --list shows them).`);
		for (const size of sizesFor(sizeArg)) jobs.push({ template: named, size });
	}
	const out = typeof o.out === 'string' ? o.out : undefined;
	const single = out && /\.(png|svg)$/i.test(out) ? resolve(cwd, out) : undefined;
	if (single && (jobs.length > 1 || format === 'both')) throw new Error('--out names one file, so pass one template, one size and --format png or svg. For several files, pass a directory.');
	if (single && !single.toLowerCase().endsWith(`.${format}`)) throw new Error(`--out ends in ${single.split('.').pop()} but --format is ${format}.`);
	const dir = resolve(cwd, out && !single ? out : 'assets');
	const picture = await pictureAt(cwd, typeof merged.image === 'string' ? merged.image : undefined);
	const partner = typeof merged.partner === 'string' ? await readPicture(cwd, merged.partner, 800) : null;
	const files: OutFile[] = [];
	for (const job of jobs) {
		const d = designOf({ template: job.template, size: job.size, width, height, set });
		if (partner && d.template !== 'partner') throw new Error('--partner goes with the partner template.');
		const r = renderDesign(d, { picture, partner }, { png: format !== 'svg', svg: format !== 'png', scale });
		const base = single ? single.replace(/\.(png|svg)$/i, '') : join(dir, `${d.template}-${d.size === 'custom' ? `${d.w}x${d.h}` : d.size}${d.theme === 'light' ? '' : `-${d.theme}`}`);
		if (r.png) {
			write(`${base}.png`, r.png);
			files.push({ path: display(cwd, `${base}.png`), format: 'png', template: d.template, size: d.size, theme: d.theme, width: r.width, height: r.height });
		}
		if (r.svg) {
			write(`${base}.svg`, r.svg);
			files.push({ path: display(cwd, `${base}.svg`), format: 'svg', template: d.template, size: d.size, theme: d.theme, width: Math.round(r.width / scale), height: Math.round(r.height / scale) });
		}
	}
	emit(o, { files }, () => files.map((f) => `${f.path}  ${f.width}x${f.height}`).join('\n'));
}
