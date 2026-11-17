"use client";

import { Button } from "@/components/ui/button";
import { ToastAction, Toaster, useToast } from "@/components/ui/toast";

export function Preview() {
  const { toast } = useToast();
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Toaster />
      <Button
        variant="outline"
        onClick={() =>
          toast({
            title: "Thread archived",
            description: "Fix the null check in billing moved to the archive.",
            action: <ToastAction altText="Undo the archive">Undo</ToastAction>,
          })
        }
      >
        Archive thread
      </Button>
    </div>
  );
}

export function Variants() {
  const { toast } = useToast();
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Toaster />
      <Button variant="outline" onClick={() => toast({ title: "Automation saved" })}>
        Title only
      </Button>
      <Button variant="outline" onClick={() => toast({ type: "success", title: "Checks passed", description: "4 of 4 checks passed on sbx-91c2." })}>
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast({
            variant: "destructive",
            title: "Run failed",
            description: "The agent could not install dependencies in sbx-04de.",
            action: <ToastAction altText="Retry the run">Retry</ToastAction>,
          })
        }
      >
        Destructive
      </Button>
    </div>
  );
}
