"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogBody, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

function NewAutomation({ defaultOpen }: { defaultOpen?: boolean }) {
  return (
    <Dialog defaultOpen={defaultOpen}>
      <DialogTrigger render={<Button />}>New automation</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New automation</DialogTitle>
          <DialogDescription>An agent starts a thread on its own when the trigger fires, in a fresh sandbox.</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <label className="flex flex-col gap-2">
            <span className="text-body-sm leading-line-body-sm font-medium text-fg">Name</span>
            <Input defaultValue="Triage new issues" />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-body-sm leading-line-body-sm font-medium text-fg">Repository</span>
            <Input defaultValue="acme/web" />
          </label>
        </DialogBody>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button>Create automation</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function Preview() {
  return <NewAutomation />;
}

export function Open() {
  return (
    <div className="min-h-120">
      <NewAutomation defaultOpen />
    </div>
  );
}

export function Notice() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>Show the API key</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Your API key</DialogTitle>
          <DialogDescription>Copy it now. For your safety it will not be shown again.</DialogDescription>
        </DialogHeader>
        <code className="block border border-line px-3 py-2 font-code text-body-sm leading-line-body-sm tracking-code break-all text-fg">hpl_live_7f3a9c2e41b8d6</code>
        <DialogFooter>
          <DialogClose render={<Button />}>Done</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
