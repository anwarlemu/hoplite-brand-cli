"use client";

import * as React from "react";
import {
  ArrowCircleRightIcon,
  ArrowsClockwiseIcon,
  BugIcon,
  ChatCircleIcon,
  ClockIcon,
  CodeIcon,
  DownloadSimpleIcon,
  FileTextIcon,
  GitBranchIcon,
  ListBulletsIcon,
  PackageIcon,
  PencilSimpleIcon,
  PulseIcon,
  SealCheckIcon,
  ShieldCheckIcon,
  TerminalWindowIcon,
  TestTubeIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

type Link = { title: string; body: string; icon: React.ComponentType<{ className?: string }> };

const PRODUCT: { heading: string; links: Link[] }[] = [
  {
    heading: "Run agents",
    links: [
      { title: "Multiplayer", body: "Every thread is shared with your team.", icon: UsersThreeIcon },
      { title: "Slack agent", body: "Your coding agent, right in Slack.", icon: ChatCircleIcon },
      { title: "Automations", body: "Coding agents that start before you ask.", icon: ClockIcon },
      { title: "PR auto-fix", body: "Review comments and red checks, handled.", icon: ArrowsClockwiseIcon },
    ],
  },
  {
    heading: "Build and ship",
    links: [
      { title: "Repositories", body: "Agents clone it and work on their own branches.", icon: GitBranchIcon },
      { title: "Import your setup", body: "Bring your skills and MCP servers from other tools.", icon: DownloadSimpleIcon },
      { title: "Verify and merge", body: "It tests its work and opens the PR for review.", icon: SealCheckIcon },
      { title: "Platform API", body: "Put coding agents inside your own product.", icon: CodeIcon },
    ],
  },
];

const USE_CASES: Link[] = [
  { title: "Bug triage", body: "New issues reproduced and fixed overnight.", icon: BugIcon },
  { title: "Test coverage", body: "Agents write the tests nobody had time for.", icon: TestTubeIcon },
  { title: "Dependency updates", body: "Upgrades that pass CI before you look.", icon: PackageIcon },
  { title: "Code review", body: "A first pass on every pull request.", icon: SealCheckIcon },
  { title: "Migrations", body: "Large refactors split across many agents.", icon: ArrowsClockwiseIcon },
  { title: "Security fixes", body: "Advisories patched in their own branches.", icon: ShieldCheckIcon },
];

const RESOURCES: { heading: string; links: Link[] }[] = [
  {
    heading: "Learn",
    links: [
      { title: "Docs", body: "Guides for setup, threads and the API.", icon: FileTextIcon },
      { title: "Quickstart", body: "Your first agent thread, step by step.", icon: ArrowCircleRightIcon },
      { title: "CLI", body: "Start and steer threads from your terminal.", icon: TerminalWindowIcon },
    ],
  },
  {
    heading: "Updates",
    links: [
      { title: "Changelog", body: "Everything shipped, newest first.", icon: ListBulletsIcon },
      { title: "Blog", body: "Releases, deep dives and field notes.", icon: PencilSimpleIcon },
      { title: "Status", body: "Uptime and incidents.", icon: PulseIcon },
    ],
  },
];

function Row({ title, body, icon: Icon }: Link) {
  return (
    <li>
      <NavigationMenuLink href={`#${title.toLowerCase().replace(/\W+/g, "-")}`}>
        <Icon />
        <span className="grid">
          <span className="font-medium text-fg">{title}</span>
          <span className="text-fg-muted">{body}</span>
        </span>
      </NavigationMenuLink>
    </li>
  );
}

function Groups({ groups }: { groups: { heading: string; links: Link[] }[] }) {
  return (
    <div className="flex">
      {groups.map((group, i) => (
        <div key={group.heading} className={i > 0 ? "ds-rule-y ml-8 max-w-96 min-w-0 flex-1 pl-8" : "max-w-96 min-w-0 flex-1"}>
          <p className="ds-label m-0 mb-3">{group.heading}</p>
          <ul className="-mx-3 m-0 list-none p-0">
            {group.links.map((link) => (
              <Row key={link.title} {...link} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function Header({ defaultValue }: { defaultValue?: string }) {
  return (
    <NavigationMenu defaultValue={defaultValue} className="h-16 w-full border-b border-line px-6">
      <NavigationMenuList>
        <NavigationMenuItem value="product">
          <NavigationMenuTrigger>Product</NavigationMenuTrigger>
          <NavigationMenuContent>
            <Groups groups={PRODUCT} />
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem value="use-cases">
          <NavigationMenuTrigger>Use cases</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="-mx-3 m-0 grid list-none grid-cols-1 gap-x-8 p-0 md:grid-cols-3">
              {USE_CASES.map((link) => (
                <Row key={link.title} {...link} />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem value="resources">
          <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
          <NavigationMenuContent>
            <Groups groups={RESOURCES} />
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#pricing" className={navigationMenuTriggerStyle()}>
            Pricing
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
      <Button size="sm" className="ml-auto">
        Start building
      </Button>
    </NavigationMenu>
  );
}

export function Preview() {
  return <Header />;
}

export function Open() {
  return (
    <div className="min-h-120">
      <Header defaultValue="product" />
    </div>
  );
}
