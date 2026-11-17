"use client";

import * as React from "react";
import { Avatar as BaseAvatar } from "@base-ui/react/avatar";

import { cn } from "@/lib/utils";

// The site's avatar (.trust__avatar, .chat__people): a 40px hexagon holding the photo, or 12px Kode Mono initials in the
// ink on the hover wash while there is no photo. `shape="hex"` (the default) is the point-up hexagon the site uses for
// marks and people; `shape="cut"` is the trust strip's box with its ends cut 8px. Sizes are 32px (sm), 40px and 48px
// (lg). A status dot (round, like the site's dots) sits at the lower right on a ground ring. In a group the hexagons
// overlap 8px, each cut out of the ground by a 2px margin; the count is a hexagon of the wash with a quiet label.
const SHAPES = {
  hex: "ds-hex-mark",
  cut: "ds-hex-s",
} as const;

type Shape = keyof typeof SHAPES;
const ShapeContext = React.createContext<Shape>("hex");

function Avatar({ className, size = "default", shape = "hex", children, ...props }: React.ComponentProps<typeof BaseAvatar.Root> & { size?: "sm" | "default" | "lg"; shape?: Shape }) {
  return (
    <ShapeContext.Provider value={shape}>
      <BaseAvatar.Root
        data-slot="avatar"
        data-size={size}
        data-shape={shape}
        className={cn("group/avatar relative inline-flex size-10 shrink-0 select-none data-[size=lg]:size-12 data-[size=sm]:size-8", className)}
        {...props}
      >
        {children}
      </BaseAvatar.Root>
    </ShapeContext.Provider>
  );
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof BaseAvatar.Image>) {
  const shape = React.useContext(ShapeContext);
  return <BaseAvatar.Image data-slot="avatar-image" className={cn(SHAPES[shape], "size-full object-cover", className)} {...props} />;
}

function AvatarFallback({ className, ...props }: React.ComponentProps<typeof BaseAvatar.Fallback>) {
  const shape = React.useContext(ShapeContext);
  return (
    <BaseAvatar.Fallback
      data-slot="avatar-fallback"
      className={cn(SHAPES[shape], "flex size-full items-center justify-center bg-subtle-hover font-mono text-caption leading-none tracking-code text-fg group-data-[size=lg]/avatar:text-body-sm", className)}
      {...props}
    />
  );
}

/** A status dot at the lower right: the ink by default; color it with a class (bg-success, bg-brand). */
function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="avatar-badge" className={cn("absolute right-0 bottom-0 size-2 rounded-pill bg-primary ring-2 ring-surface group-data-[size=lg]/avatar:size-3", className)} {...props} />;
}

function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "flex items-center -space-x-2 *:data-[slot=avatar]:box-content *:data-[slot=avatar]:bg-surface *:data-[slot=avatar]:p-0.5 *:data-[slot=avatar]:data-[shape=hex]:[clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)] *:data-[slot=avatar]:data-[shape=cut]:[clip-path:polygon(var(--ds-hex-chamfer-s)_0,calc(100%_-_var(--ds-hex-chamfer-s))_0,100%_50%,calc(100%_-_var(--ds-hex-chamfer-s))_100%,var(--ds-hex-chamfer-s)_100%,0_50%)]",
        className,
      )}
      {...props}
    />
  );
}

function AvatarGroupCount({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="avatar-group-count" className={cn("ds-hex-mark relative box-content flex size-10 shrink-0 items-center justify-center bg-surface p-0.5", className)} {...props}>
      <span className="ds-hex-mark flex size-full items-center justify-center bg-subtle-hover font-mono text-caption leading-none tracking-code text-fg-muted">{children}</span>
    </div>
  );
}

export { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage };
