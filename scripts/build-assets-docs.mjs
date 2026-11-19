// Writes the docs site's asset gallery by running the CLI itself (dist/, so build first): share images, social posts,
// slides, merch, illustrations and a still of each motion piece, plus one short MP4 when ffmpeg is installed.
// usage: node scripts/build-assets-docs.mjs   (writes apps/www/public/assets-examples/ and its examples.json)
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const out = join(root, 'apps', 'www', 'public', 'assets-examples');
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
const cli = (args) => JSON.parse(execFileSync('node', [join(root, 'bin.js'), ...args, '--json'], { cwd: out, encoding: 'utf8', maxBuffer: 1 << 26 }));
const ex = { image: [], social: [], deck: [], merch: [], illustrate: [], video: [] };
const add = (group, id, command, file, width, height) => ex[group].push({ id, command, src: `/assets-examples/${file}`, width, height });

for (const [t, theme] of [['globe', 'night'], ['cube', 'light'], ['horizon', 'night'], ['banner', 'black'], ['loader', 'light'], ['logo', 'night'], ['partner', 'light']]) {
	const file = `image-${t}.png`;
	cli(['image', t, '--theme', theme, '--format', 'png', '--out', file]);
	add('image', t, `image ${t} --theme ${theme}`, file, 1200, 630);
}
for (const [size, w, h, t] of [['square', 1080, 1080, 'globe'], ['portrait', 1080, 1350, 'cube'], ['story', 1080, 1920, 'horizon'], ['x-banner', 1500, 500, 'banner'], ['linkedin-banner', 1584, 396, 'globe']]) {
	const file = `social-${size}.png`;
	cli(['image', t, '--size', size, '--theme', 'night', '--format', 'png', '--out', file]);
	add('social', size, `image ${t} --size ${size} --theme night`, file, w, h);
}
for (const s of ['cover', 'section', 'statement', 'bullets', 'stat', 'quote', 'image', 'end']) {
	cli(['deck', s, '--format', 'png', '--out', 'deck']);
	add('deck', s, `deck ${s}`, `deck/slide-01-${s}.png`, 1920, 1080);
}
for (const [item, variant] of [['tee-front', 'accent'], ['tee-back', 'accent'], ['poster', 'night'], ['mug-wrap', 'night'], ['sticker', 'light'], ['tote', 'ink']]) {
	const r = cli(['merch', item, '--variant', variant, '--format', 'png', '--dpi', '72', '--out', 'merch']);
	add('merch', item, `merch ${item} --variant ${variant}`, r.files[0].path, r.files[0].width, r.files[0].height);
}
for (const [s, palette] of [['globe', 'night'], ['dome', 'light'], ['cube', 'light'], ['node', 'night'], ['loader', 'light']]) {
	const r = cli(['illustrate', s, '--palette', palette, '--format', 'svg', '--out', `illustrate/${s}`]);
	add('illustrate', s, `illustrate ${s} --palette ${palette}`, r.files[0], r.size.width, r.size.height);
}
for (const [v, size, theme] of [['globe', 'landscape', 'night'], ['cube', 'landscape', 'light'], ['loader', 'landscape', 'light'], ['logo', 'landscape', 'night']]) {
	const file = `video-${v}.png`;
	cli(['video', v, '--size', size, '--theme', theme, '--still', '2', '--out', file]);
	add('video', v, `video ${v} --size ${size} --theme ${theme}`, file, 1920, 1080);
}
if (spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' }).status === 0) {
	cli(['video', 'globe', '--size', 'landscape', '--theme', 'night', '--format', 'mp4', '--fps', '24', '--out', '.']);
	ex.loopVideo = '/assets-examples/globe-landscape-night.mp4';
}
writeFileSync(join(out, 'examples.json'), `${JSON.stringify(ex, null, '\t')}\n`);
console.log(`asset examples: ${Object.values(ex).filter(Array.isArray).reduce((n, l) => n + l.length, 0)} files in apps/www/public/assets-examples`);
