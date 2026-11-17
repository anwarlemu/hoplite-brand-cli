"use client";

import * as React from "react";

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";

function Bar({ open }: { open?: boolean }) {
  const [diffs, setDiffs] = React.useState(true);
  const [terminal, setTerminal] = React.useState(false);
  const [layout, setLayout] = React.useState("split");
  return (
    <Menubar>
      <MenubarMenu defaultOpen={open}>
        <MenubarTrigger>Thread</MenubarTrigger>
        <MenubarContent className="w-60">
          <MenubarItem>
            New thread
            <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            New thread in sandbox
            <MenubarShortcut>⇧⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarSub>
            <MenubarSubTrigger>Import setup from</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Claude Code</MenubarItem>
              <MenubarItem>Codex</MenubarItem>
              <MenubarItem>Cursor</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>
            Archive
            <MenubarShortcut>⌘E</MenubarShortcut>
          </MenubarItem>
          <MenubarItem variant="destructive">Delete thread</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent className="w-56">
          <MenubarItem>
            Undo
            <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Redo
            <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Find in thread
            <MenubarShortcut>⌘F</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent className="w-56">
          <MenubarGroup>
            <MenubarLabel>Panels</MenubarLabel>
            <MenubarCheckboxItem checked={diffs} onCheckedChange={setDiffs}>
              Changes
            </MenubarCheckboxItem>
            <MenubarCheckboxItem checked={terminal} onCheckedChange={setTerminal}>
              Terminal
            </MenubarCheckboxItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarRadioGroup value={layout} onValueChange={(value) => setLayout(String(value))}>
            <MenubarLabel>Layout</MenubarLabel>
            <MenubarRadioItem value="split">Split</MenubarRadioItem>
            <MenubarRadioItem value="stacked">Stacked</MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Help</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Docs</MenubarItem>
          <MenubarItem>Changelog</MenubarItem>
          <MenubarItem disabled>Contact support</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

export function Preview() {
  return <Bar />;
}

export function Open() {
  return (
    <div className="min-h-96">
      <Bar open />
    </div>
  );
}
