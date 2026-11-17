import { Skeleton } from "@/components/ui/skeleton";

export function Preview() {
  return (
    <div className="flex max-w-sm items-center gap-4">
      <Skeleton className="ds-hex-mark size-10 shrink-0" />
      <div className="grid flex-1 gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

export function CardShape() {
  return (
    <div className="grid max-w-sm gap-6 border border-line-frame p-8">
      <Skeleton className="h-8 w-24" />
      <div className="grid gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <Skeleton className="ds-hex h-10 w-full" />
    </div>
  );
}

export function List() {
  return (
    <div className="grid max-w-md">
      {[0, 1, 2].map((row) => (
        <div key={row} className="flex items-center justify-between gap-4 border-b border-line py-3 first:border-t">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-12" />
        </div>
      ))}
    </div>
  );
}
