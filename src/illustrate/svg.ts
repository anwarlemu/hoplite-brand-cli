import type { Ctx } from '../assets/canvas.js';

// A small recording context for the line drawings: it takes the canvas calls the brand's drawings make (paths, arcs,
// fills, dashed strokes) and writes them as SVG elements, so a dashed line stays one <path> with stroke-dasharray
// instead of hundreds of filled dash shapes. The file stays small and every line, dash pattern and node is editable in
// Figma or Illustrator. Text, pictures, clips and transforms are not recorded; subjects that use them draw through
// Skia's SVG backend instead.

type Style = { fillStyle: string; strokeStyle: string; lineWidth: number; lineCap: string; lineJoin: string; globalAlpha: number; dash: number[]; lineDashOffset: number };
const r2 = (n: number) => {
	const v = Math.round(n * 100) / 100;
	return Object.is(v, -0) ? '0' : String(v);
};

/** Splits a CSS color into an SVG paint and its opacity. */
function paint(c: string): [string, number] {
	const m = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:\s*[/,]\s*([\d.]+))?\s*\)$/.exec(c);
	if (!m) return [c, 1];
	const hex = `#${[m[1], m[2], m[3]].map((n) => Math.round(Number(n)).toString(16).padStart(2, '0')).join('').toUpperCase()}`;
	return [hex, m[4] === undefined ? 1 : Number(m[4])];
}

export class SvgRecorder {
	private style: Style = { fillStyle: '#000000', strokeStyle: '#000000', lineWidth: 1, lineCap: 'butt', lineJoin: 'miter', globalAlpha: 1, dash: [], lineDashOffset: 0 };
	private stack: Style[] = [];
	private d = '';
	private out: string[] = [];
	constructor(readonly width: number, readonly height: number) {}
	get fillStyle() { return this.style.fillStyle; }
	set fillStyle(v: string) { this.style.fillStyle = v; }
	get strokeStyle() { return this.style.strokeStyle; }
	set strokeStyle(v: string) { this.style.strokeStyle = v; }
	get lineWidth() { return this.style.lineWidth; }
	set lineWidth(v: number) { this.style.lineWidth = v; }
	get lineCap() { return this.style.lineCap; }
	set lineCap(v: string) { this.style.lineCap = v; }
	get lineJoin() { return this.style.lineJoin; }
	set lineJoin(v: string) { this.style.lineJoin = v; }
	get globalAlpha() { return this.style.globalAlpha; }
	set globalAlpha(v: number) { this.style.globalAlpha = v; }
	get lineDashOffset() { return this.style.lineDashOffset; }
	set lineDashOffset(v: number) { this.style.lineDashOffset = v; }
	setLineDash(d: number[]) { this.style.dash = [...d]; }
	save() { this.stack.push({ ...this.style, dash: [...this.style.dash] }); }
	restore() { this.style = this.stack.pop() ?? this.style; }
	beginPath() { this.d = ''; }
	moveTo(x: number, y: number) { this.d += `M${r2(x)} ${r2(y)}`; }
	lineTo(x: number, y: number) { this.d += `L${r2(x)} ${r2(y)}`; }
	closePath() { this.d += 'Z'; }
	rect(x: number, y: number, w: number, h: number) { this.d += `M${r2(x)} ${r2(y)}h${r2(w)}v${r2(h)}h${r2(-w)}Z`; }
	arc(cx: number, cy: number, r: number, a0: number, a1: number) {
		if (Math.abs(a1 - a0) >= Math.PI * 2 - 1e-9) {
			this.d += `M${r2(cx + r)} ${r2(cy)}A${r2(r)} ${r2(r)} 0 1 1 ${r2(cx - r)} ${r2(cy)}A${r2(r)} ${r2(r)} 0 1 1 ${r2(cx + r)} ${r2(cy)}`;
			return;
		}
		const x0 = cx + r * Math.cos(a0);
		const y0 = cy + r * Math.sin(a0);
		const x1 = cx + r * Math.cos(a1);
		const y1 = cy + r * Math.sin(a1);
		this.d += `${this.d ? 'L' : 'M'}${r2(x0)} ${r2(y0)}A${r2(r)} ${r2(r)} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${r2(x1)} ${r2(y1)}`;
	}
	fillRect(x: number, y: number, w: number, h: number) {
		const [c, a] = paint(this.style.fillStyle);
		this.out.push(`<rect x="${r2(x)}" y="${r2(y)}" width="${r2(w)}" height="${r2(h)}" fill="${c}"${this.op(a)}/>`);
	}
	fill(rule?: string) {
		if (!this.d) return;
		const [c, a] = paint(this.style.fillStyle);
		this.out.push(`<path d="${this.d}" fill="${c}"${rule === 'evenodd' ? ' fill-rule="evenodd"' : ''}${this.op(a)}/>`);
	}
	stroke() {
		if (!this.d) return;
		const [c, a] = paint(this.style.strokeStyle);
		const s = this.style;
		const dash = s.dash.length ? ` stroke-dasharray="${s.dash.map(r2).join(' ')}"${s.lineDashOffset ? ` stroke-dashoffset="${r2(s.lineDashOffset)}"` : ''}` : '';
		this.out.push(`<path d="${this.d}" fill="none" stroke="${c}" stroke-width="${r2(s.lineWidth)}"${s.lineCap !== 'butt' ? ` stroke-linecap="${s.lineCap}"` : ''}${s.lineJoin !== 'miter' ? ` stroke-linejoin="${s.lineJoin}"` : ''}${dash}${this.op(a)}/>`);
	}
	private op(a: number) {
		const o = a * this.style.globalAlpha;
		return o < 0.999 ? ` opacity="${Math.round(o * 1000) / 1000}"` : '';
	}
	toString() {
		return `<svg xmlns="http://www.w3.org/2000/svg" width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}">\n${this.out.join('\n')}\n</svg>\n`;
	}
	/** The recorder typed as a canvas context for the drawing functions (only the calls above are used). */
	get ctx(): Ctx {
		return this as unknown as Ctx;
	}
}
