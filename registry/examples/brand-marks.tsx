import { HexNode, Lockup, Mark, NodeCluster, NodeTree } from "@/components/site/brand-marks";

export function Preview() {
  return (
    <div className="grid gap-10">
      <div className="flex flex-wrap items-center gap-8 text-fg">
        <Lockup />
        <Mark />
        <HexNode />
        <HexNode active />
      </div>
      <div className="grid max-w-180 gap-8 sm:grid-cols-4">
        <NodeCluster count={1} active={1} />
        <NodeCluster count={3} active={1} />
        <NodeCluster count={5} active={3} />
        <NodeCluster count={5} active={3} ghost={2} />
      </div>
    </div>
  );
}

export function Tree() {
  return <NodeTree root="Weekdays" rootNote="09:00" leaves={[{ title: "Fresh sandbox", note: "every run" }, { title: "Tests", note: "pass" }, { title: "Pull request", note: "for review", active: true }]} />;
}
