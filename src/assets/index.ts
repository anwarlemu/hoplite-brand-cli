// The asset renderer as a module, for scripts:
//
//   import { designOf, renderDesign, surface, drawGlobe, toPng } from '<package>/dist/assets/index.js';
//   const r = renderDesign(designOf({ template: 'globe', size: 'square', set: { headline: '...' } }), {}, { png: true });
//
// Everything brand-specific comes from brand/ (tokens, fonts, assets/*.json); nothing here names the brand.

export { brandFonts, compactSvg, pixelsOf, scratch, surface, toPng, toSvg, tokenAlpha, tokenColor, type Ctx, type Fonts, type Surface } from './canvas.js';
export { drawCorners, drawCube, drawGlobe, drawGrain, drawLoader, drawNode, drawNote, drawRules, hexPill, mulberry, type Motion, type Rect } from './scene.js';
export { drawFitted, fit, setFont, wrap, type Fitted, type TextStyle } from './text.js';
export { drawLogo, drawMark, drawWordmark, lockupNames, logoRatio, markRatio } from './logo.js';
export { pictureFrom, readPicture, type Picture } from './picture.js';
export { colorsOf, designFor, drawDesign, frameOf, imageDoc, layoutFor, TEMPLATES, themeNames, type Design, type Template } from './og.js';
export { designOf, imageCatalog, imageSizes, renderDesign, sizeId, type ImageRequest, type Rendered } from './image.js';
export { deckCatalog, drawSlide, renderSlide, slideTypes, type Slide, type SlideType } from './deck.js';
export { drawItem, findItem, merchCatalog, merchItems, renderItem, PX_PER_IN, type MerchItem } from './merch.js';
export { bezier, drawVideoFrame, encode, hasFfmpeg, videoCatalog, videoFrames, videoStill, videoTemplates, type VideoOptions } from './video.js';
export { encodePng } from './png.js';
export { imagesToPdf, type PdfPage } from './pdf.js';
export { display, num, pick, suggest, unknown, write, type OutFile } from './io.js';
