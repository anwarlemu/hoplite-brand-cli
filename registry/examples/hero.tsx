import { NodeTree } from "@/components/site/brand-marks";
import { Hero } from "@/components/blocks/hero";

export function Preview() {
  return <Hero />;
}

export function WithMedia() {
  return (
    <Hero
      eyebrow="Multiplayer"
      title="The multiplayer coding agent for your whole team"
      lead="One agent, one thread, and the whole team in it."
      media={
        <div className="ds-corners grid min-h-64 place-items-center p-8">
          <NodeTree root="fix-upload-500" rootNote="running" leaves={[{ title: "Agent", note: "running", active: true }, { title: "Teammate", note: "steering" }]} />
        </div>
      }
    />
  );
}
