"use client";

import * as React from "react";
import { DirectionProvider as BaseDirectionProvider, useDirection } from "@base-ui/react/direction-provider";

// Sets the reading direction (ltr or rtl) for every Base UI part inside it, so menus, sliders, tabs and scroll areas
// flip for right-to-left text. It draws nothing of its own; set dir on the element it wraps too. `dir` is kept beside
// Base UI's `direction` so code written for shadcn keeps working.
type DirectionProviderProps = React.ComponentProps<typeof BaseDirectionProvider> & { dir?: React.ComponentProps<typeof BaseDirectionProvider>["direction"] };

function DirectionProvider({ dir, direction, children }: DirectionProviderProps) {
  return <BaseDirectionProvider direction={direction ?? dir}>{children}</BaseDirectionProvider>;
}

export { DirectionProvider, useDirection };
