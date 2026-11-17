import { AspectRatio } from "@/components/ui/aspect-ratio";

export function Preview() {
  return (
    <div className="w-full max-w-md">
      <AspectRatio ratio={16 / 9} className="ds-corners grid place-items-center">
        <span className="ds-label">16:9 product shot</span>
      </AspectRatio>
    </div>
  );
}

export function Ratios() {
  return (
    <div className="grid w-full max-w-xl grid-cols-3 items-start gap-4">
      {[
        [1, "1:1"],
        [4 / 3, "4:3"],
        [3 / 4, "3:4"],
      ].map(([ratio, label]) => (
        <AspectRatio key={label} ratio={ratio as number} className="grid place-items-center border border-line-frame">
          <span className="ds-label">{label}</span>
        </AspectRatio>
      ))}
    </div>
  );
}
