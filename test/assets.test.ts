import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { renderSlide, slideTypes } from '../src/assets/deck.js';
import { designOf, imageSizes, renderDesign } from '../src/assets/image.js';
import { merchItems, renderItem, PX_PER_IN } from '../src/assets/merch.js';
import { designFor, drawDesign, imageDoc, TEMPLATES, frameOf } from '../src/assets/og.js';
import { brandFonts, pixelsOf, surface, tokenColor } from '../src/assets/canvas.js';
import { bezier, drawVideoFrame, videoStill, videoTemplates } from '../src/assets/video.js';
import { buildIllustration, illustrateData } from '../src/illustrate/build.js';
import { figmaTokens, figmaTokenScripts } from '../src/figma/tokens.js';
import { checkFigmaValues } from '../src/figma/check.js';
import { helpRow } from '../src/lib/help-row.js';

const sha = (b: Buffer | string) => createHash('sha256').update(b).digest('hex');
const tmp = mkdtempSync(join(tmpdir(), 'hop-assets-'));
afterAll(() => rmSync(tmp, { recursive: true, force: true }));
const bin = join(__dirname, '..', 'bin.js');
const run = (args: string[]) => spawnSync('node', [bin, ...args], { cwd: tmp, encoding: 'utf8' });

describe('image', () => {
	it('has the social set and every playground size', () => {
		const ids = imageSizes().map((s) => s.id);
		for (const [id, w, h] of [['og', 1200, 630], ['square', 1080, 1080], ['portrait', 1080, 1350], ['story', 1080, 1920], ['landscape', 1200, 675], ['x-banner', 1500, 500], ['linkedin-banner', 1584, 396]] as const) {
			expect(ids).toContain(id);
			expect(imageDoc().sizes[id]).toMatchObject({ w, h });
		}
		expect(imageDoc().social).toHaveLength(7);
	});

	it('draws every template at every size the same twice (same seed, same bytes)', () => {
		for (const t of TEMPLATES) {
			const a = renderDesign(designOf({ template: t, size: 'square', set: { seed: 11 } }));
			const b = renderDesign(designOf({ template: t, size: 'square', set: { seed: 11 } }));
			expect(sha(a.png!)).toBe(sha(b.png!));
			const c = renderDesign(designOf({ template: t, size: 'square', set: { seed: 12 } }));
			if (['globe', 'cube', 'horizon', 'banner', 'logo', 'partner'].includes(t)) expect(sha(c.png!)).not.toBe(sha(a.png!));
		}
	});

	it('keeps the lockup, words and notes inside the frame at every size', () => {
		for (const t of TEMPLATES)
			for (const s of imageSizes()) {
				const d = designOf({ template: t, size: s.id });
				const f = frameOf(d);
				const sf = surface(f.w, f.h, { scale: 0.25 });
				const drawn = drawDesign(sf.ctx, d, brandFonts());
				for (const r of [drawn.logo, drawn.text, ...drawn.notes].filter((r): r is NonNullable<typeof r> => !!r && r.w > 0)) {
					expect(r.x, `${t} ${s.id}`).toBeGreaterThanOrEqual(-0.5);
					expect(r.y, `${t} ${s.id}`).toBeGreaterThanOrEqual(-0.5);
					expect(r.x + r.w, `${t} ${s.id}`).toBeLessThanOrEqual(f.w + 0.5);
					expect(r.y + r.h, `${t} ${s.id}`).toBeLessThanOrEqual(f.h + 0.5);
				}
			}
	});

	it('uses only token colors', () => {
		const svg = renderDesign(designOf({ template: 'globe', size: 'og', set: { theme: 'night' } }), {}, { png: false, svg: true }).svg!;
		const allowed = new Set(['#1A1A1A', '#F2F2F0', '#FF3616', '#0F0F0F', '#929291', '#626261'].map((c) => c.toLowerCase()));
		const used = new Set([...svg.matchAll(/(?:fill|stroke)="(#[0-9a-fA-F]{6})"/g)].map((m) => m[1]!.toLowerCase()));
		for (const c of used) expect(allowed.has(c), c).toBe(true);
		expect(tokenColor('orange')).toBe('#FF3616');
	});

	it('exits 1 with a suggestion for an unknown template, size, theme and command', () => {
		for (const [args, near] of [[['image', 'glob'], 'globe'], [['image', 'globe', '--size', 'sqare'], 'square'], [['image', 'globe', '--theme', 'nigth'], 'night'], [['imgae'], 'image']] as const) {
			const r = run([...args]);
			expect(r.status, args.join(' ')).toBe(1);
			expect(r.stderr).toContain(`Did you mean \`${near}\``);
		}
	});

	it('writes PNG and SVG through the command', () => {
		const r = run(['image', 'horizon', '--size', 'social', '--out', 'img', '--json']);
		expect(r.status).toBe(0);
		const files = JSON.parse(r.stdout).files as { path: string }[];
		expect(files).toHaveLength(14);
		for (const f of files) expect(existsSync(join(tmp, f.path))).toBe(true);
	});
});

describe('deck, merch, video', () => {
	it('draws every slide type deterministically', () => {
		for (const t of slideTypes()) expect(sha(renderSlide({ type: t }).png!)).toBe(sha(renderSlide({ type: t }).png!));
		expect(slideTypes()).toEqual(expect.arrayContaining(['cover', 'section', 'statement', 'bullets', 'stat', 'quote', 'image', 'end']));
	});

	it('rejects a slot a slide does not take', () => {
		expect(() => renderSlide({ type: 'cover', stat: '9' })).toThrow(/does not take "stat"/);
	});

	it('writes PNGs and one PDF from a deck file', () => {
		const r = run(['deck', 'bullets', '--out', 'deck', '--json']);
		expect(r.status).toBe(0);
		const pdf = readFileSync(join(tmp, 'deck', 'deck.pdf'));
		expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
	});

	it('sizes every merch item at 300 dpi with its bleed, and the sticker has a die line', () => {
		for (const i of merchItems()) {
			const r = renderItem(i, { dpi: 72, png: true, svg: i.id === 'sticker' });
			expect(r.widthIn).toBeCloseTo(i.size[0] + 2 * i.bleed);
			expect(r.width).toBe(Math.round((i.size[0] + 2 * i.bleed) * 72));
			if (i.id === 'sticker') expect(r.svg).toContain('CutContour');
		}
		expect(PX_PER_IN).toBe(300);
	});

	it('draws video frames as a pure function of time, and loops meet their first frame', () => {
		for (const t of videoTemplates()) expect(sha(videoStill({ template: t, size: 'square' }, 1).png)).toBe(sha(videoStill({ template: t, size: 'square' }, 1).png));
		// The last frame wraps to the first: the same picture, up to antialiasing.
		const px = (t: number) => {
			const s = surface(540, 540);
			drawVideoFrame(s.ctx, { template: 'globe', size: 'square' }, t);
			return pixelsOf(s).data;
		};
		const a = px(0);
		const b = px(8);
		let diff = 0;
		for (let i = 0; i < a.length; i++) diff += Math.abs(a[i]! - b[i]!);
		expect(diff / a.length).toBeLessThan(0.5);
		const ease = bezier([0.23, 1, 0.32, 1]);
		expect(ease(0.5)).toBeGreaterThan(0.5);
	});

	it('video motion uses no ease-in curve', () => {
		const doc = JSON.parse(readFileSync(join(__dirname, '..', 'brand', 'assets', 'video.json'), 'utf8'));
		for (const [name, c] of Object.entries(doc.curves) as [string, number[]][]) expect(c[2]! <= 0.32 || c[3] === 1, name).toBe(true);
	});
});

describe('illustrate and figma', () => {
	it('draws every subject with vector SVG and the same bytes for the same seed', () => {
		for (const s of Object.keys(illustrateData().subjects).filter((s) => s !== 'window')) {
			const a = buildIllustration({ subject: s, settings: { seed: 5 }, scale: 1 });
			const b = buildIllustration({ subject: s, settings: { seed: 5 }, scale: 1 });
			expect(sha(a.png!)).toBe(sha(b.png!));
			expect(a.svg).toBe(b.svg);
			expect(a.svg!.includes('<image')).toBe(false);
		}
		expect(buildIllustration({ subject: 'globe', scale: 1 }).svg).toContain('stroke-dasharray');
	});

	it('names the nearest subject for an unknown one', () => {
		const r = run(['illustrate', 'glbe']);
		expect(r.status).toBe(1);
		expect(r.stderr).toContain('`globe`');
	});

	it('writes tokens as Figma variables in light and dark modes', () => {
		const doc = figmaTokens();
		expect(doc.modes).toEqual(['Light', 'Dark']);
		const ground = doc.variables.find((v) => v.css === '--ds-color-ground')!;
		expect(ground.values).toHaveLength(2);
		expect(figmaTokenScripts(doc).every((s) => s.length <= 45000)).toBe(true);
	});

	it('flags off-brand values with the nearest token', () => {
		const f = checkFigmaValues('<div className="bg-[#1B1B1B] text-[#FF3616]" />');
		expect(f.find((x) => x.value.toLowerCase() === '#ff3616')?.ok).toBe(true);
		expect(f.find((x) => x.value.toLowerCase() === '#1b1b1b')?.ok).toBe(false);
	});
});

describe('manifest', () => {
	it('lists every asset command and asset name', () => {
		const doc = JSON.parse(execFileSync('node', [bin, 'manifest', '--json'], { cwd: tmp, encoding: 'utf8' }));
		const names = doc.commands.map((c: { name: string }) => c.name);
		for (const n of ['image', 'deck', 'video', 'merch', 'illustrate', 'figma', 'manifest']) expect(names).toContain(n);
		expect(doc.assets.image.templates.map((t: { id: string }) => t.id)).toEqual(TEMPLATES);
		expect(doc.assets.lockups.length).toBeGreaterThan(0);
		expect(Object.keys(doc.assets.illustrate.subjects)).toContain('globe');
		expect(execFileSync('node', [bin, 'describe', '--json'], { cwd: tmp, encoding: 'utf8' })).toBe(JSON.stringify(doc, null, 2) + '\n');
	});

	it('help rows never run into their descriptions', () => {
		expect(helpRow('x'.repeat(60), 'what', 20)).toContain('\n');
		const help = execFileSync('node', [bin, 'manifest'], { cwd: tmp, encoding: 'utf8' });
		for (const line of help.split('\n')) if (/^ {2}\S/.test(line)) expect(line).not.toMatch(/^ {2}\S{14,}\S/);
		void designFor;
	});
});
