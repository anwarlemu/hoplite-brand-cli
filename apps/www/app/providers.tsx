"use client";

import * as React from "react";

// Base UI needs no provider; this stays as the one place a site-wide client provider would go.
export function Providers({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
