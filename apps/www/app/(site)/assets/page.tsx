import { Code, PageBody, PageHead, Section } from "@www/components/chrome";
import { CommandList, examples, Gallery } from "@www/components/gallery";
import { CLI_COMMAND } from "@www/lib/registry";

export const metadata = { title: "Assets", description: "Share images, social posts, deck slides, motion pieces and merch print files from the CLI." };

const BIN = "npx hoplite-ds";

const COMMANDS: [string, string][] = [
  ["manifest --json", "Every command, flag, template, size, theme, slide, video, merch item, subject and lockup. Start here; an unknown name exits 1 with the closest match."],
  ["image <template>", "Share images and social posts: globe, cube, horizon, banner, loader, logo, partner. Every size of the brand's social tool and the social set; PNG and SVG; --image puts any picture in the drawing's place."],
  ["deck", "Slides at 1920 by 1080 from a JSON file or flags (cover, section, statement, bullets, stat, quote, image, end): a PNG per slide and one PDF."],
  ["video <template>", "Motion pieces at square, vertical and landscape that move as the website moves: marching dashes, nodes turning a sixth of a turn, the loader on the upload curve. MP4 and WebM through ffmpeg; --still writes one frame."],
  ["merch <item>", "Print files only: SVG at physical size and 300 dpi PNG with bleed and safe area; the sticker carries its hexagon die line. Sizes are common vendor conventions: confirm with the vendor."],
  ["illustrate <subject>", "The brand's drawings as code. See Illustrations."],
  ["figma <action>", "Tokens as Figma variables, push, pull and check. See Figma."],
];

export default function AssetsPage() {
  return (
    <>
      <PageHead
        eyebrow="Assets"
        title="Images, slides, motion and merch"
        description="The CLI draws Hoplite's posts, slides, motion and print files with the brand social tool's templates, the tokens and the lockup. The same inputs always write the same files."
      />
      <PageBody className="max-w-300">
        <Code title="terminal" lang="sh" code={`${CLI_COMMAND} manifest --json\n${BIN} image globe --headline "Everything a swarm of agents *needs*."\n${BIN} image horizon --size social --theme night --out posts\n${BIN} deck --input deck.json --out deck`} />
        <Section title="Commands" description="Each takes --list and --json. Copy goes in by slot; positions are flags, as dragging is in the social tool.">
          <CommandList rows={COMMANDS} />
        </Section>
        <Section title="Share images" description="Link previews at 1200 by 630 in the light, night and black themes. *A phrase* in the headline takes the orange.">
          <Gallery items={examples.image} columns="sm:grid-cols-2 lg:grid-cols-3" bin={BIN} />
        </Section>
        <Section title="Social posts" description="--size square, portrait, story, landscape, x-banner, linkedin-banner and every size the social tool offers; --size social writes the whole set.">
          <Gallery items={examples.social} columns="grid-cols-2 lg:grid-cols-3" bin={BIN} />
        </Section>
        <Section title="Deck" description="Each slide type is laid out from one of the image templates at 1920 by 1080. A JSON file of slides writes a PNG each and one PDF.">
          <Gallery items={examples.deck} columns="sm:grid-cols-2" bin={BIN} />
        </Section>
        <Section title="Motion" description="Stills at 2 seconds. Loops meet their first frame; nothing eases in and nothing grows from nothing.">
          {examples.loopVideo && (
            <div className="ds-corners p-2">
              <video src={examples.loopVideo} autoPlay muted loop playsInline className="block h-auto w-full bg-subtle" aria-label="The globe loop at 1920 by 1080" />
            </div>
          )}
          <Gallery items={examples.video} columns="sm:grid-cols-2" bin={BIN} />
        </Section>
        <Section title="Merch" description="Print files at real size. The accent variant keeps the horse orange on a transparent ground; light and night print the ground to the bleed.">
          <Gallery items={examples.merch} columns="grid-cols-2 lg:grid-cols-3" bin={BIN} />
        </Section>
      </PageBody>
    </>
  );
}
