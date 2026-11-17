"use client";

import * as React from "react";
import {
  CaretUpDownIcon,
  ChatsCircleIcon,
  CubeIcon,
  GearSixIcon,
  GitPullRequestIcon,
  GitBranchIcon,
  LightningIcon,
  PlusIcon,
  QuestionIcon,
  RobotIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react/ssr";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";

type Row = { title: string; icon: React.ComponentType<{ className?: string }>; count?: number };

const WORK: Row[] = [
  { title: "Threads", icon: ChatsCircleIcon, count: 12 },
  { title: "Pull requests", icon: GitPullRequestIcon, count: 3 },
  { title: "Agents", icon: RobotIcon },
  { title: "Sandboxes", icon: CubeIcon },
  { title: "Automations", icon: LightningIcon },
];

const REPOSITORIES = ["acme/web", "acme/api"];

function Workspace() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" tooltip="Acme" className="gap-3 px-2">
          <div aria-hidden className="ds-hex-mark grid size-8 shrink-0 place-items-center bg-primary font-sans text-caption font-medium text-on-primary">
            A
          </div>
          <span className="grid min-w-0 flex-1 text-left leading-tight">
            <span className="truncate text-body-sm font-medium text-fg">Acme</span>
            <span className="truncate text-caption text-fg-muted">Team plan, 8 seats</span>
          </span>
          <CaretUpDownIcon className="size-4 text-fg-muted group-data-[collapsible=icon]/sidebar:hidden" />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function Rows({ rows, current, onSelect }: { rows: Row[]; current: string; onSelect: (title: string) => void }) {
  return (
    <SidebarMenu>
      {rows.map(({ title, icon: Icon, count }) => (
        <SidebarMenuItem key={title}>
          <SidebarMenuButton isActive={current === title} tooltip={title} onClick={() => onSelect(title)}>
            <Icon />
            <span>{title}</span>
          </SidebarMenuButton>
          {count ? <SidebarMenuBadge>{count}</SidebarMenuBadge> : null}
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

function AppRail({ collapsible = "offcanvas", variant = "sidebar" }: { collapsible?: "offcanvas" | "icon" | "none"; variant?: "sidebar" | "floating" | "inset" }) {
  const [current, setCurrent] = React.useState("Threads");
  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <Workspace />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Work</SidebarGroupLabel>
          <SidebarGroupContent>
            <Rows rows={WORK} current={current} onSelect={setCurrent} />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Repositories</SidebarGroupLabel>
          <SidebarGroupAction aria-label="Add a repository">
            <PlusIcon />
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {REPOSITORIES.map((repo, i) => (
                <SidebarMenuItem key={repo}>
                  <SidebarMenuButton tooltip={repo} isActive={current === repo} onClick={() => setCurrent(repo)}>
                    <GitBranchIcon />
                    <span>{repo}</span>
                  </SidebarMenuButton>
                  {i === 0 && (
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton href="#">main</SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton href="#" isActive>
                          fix/null-check
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Members">
              <UsersThreeIcon />
              <span>Members</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Help">
              <QuestionIcon />
              <span>Help</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings">
              <GearSixIcon />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function PageHead({ page }: { page: string }) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-line px-4">
      <SidebarTrigger />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Acme</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{page}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Button size="sm" className="ml-auto">
        New thread
      </Button>
    </header>
  );
}

function Body({ note }: { note: string }) {
  return (
    <div className="grid gap-3 p-6">
      <h1 className="m-0 font-display text-h4 leading-title font-light text-fg">Threads</h1>
      <p className="m-0 max-w-120 text-body-sm leading-line-body-sm text-fg-secondary">{note}</p>
    </div>
  );
}

const FRAME = "h-170 min-h-0 overflow-hidden border border-line";

export function Preview() {
  return (
    <SidebarProvider className={FRAME}>
      <AppRail />
      <SidebarInset>
        <PageHead page="Threads" />
        <Body note="Every agent conversation in the workspace, newest first. Press Cmd B to hide the rail." />
      </SidebarInset>
    </SidebarProvider>
  );
}

export function Icons() {
  return (
    <SidebarProvider defaultOpen={false} className={FRAME}>
      <AppRail collapsible="icon" />
      <SidebarInset>
        <PageHead page="Threads" />
        <Body note="Narrowed to its glyphs, each row names itself in a tooltip. Open the rail with the key at the top left." />
      </SidebarInset>
    </SidebarProvider>
  );
}

export function Inset() {
  return (
    <SidebarProvider className={FRAME}>
      <AppRail variant="inset" />
      <SidebarInset>
        <PageHead page="Threads" />
        <Body note="The inset rail sits on the ground with the page framed beside it by the quiet rule." />
      </SidebarInset>
    </SidebarProvider>
  );
}

export function Loading() {
  return (
    <SidebarProvider className="h-120 min-h-0 overflow-hidden border border-line">
      <Sidebar collapsible="none">
        <SidebarHeader>
          <Workspace />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Work</SidebarGroupLabel>
            <SidebarMenu>
              {Array.from({ length: 5 }, (_, i) => (
                <SidebarMenuItem key={i}>
                  <SidebarMenuSkeleton showIcon />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <Body note="Loading the workspace." />
      </SidebarInset>
    </SidebarProvider>
  );
}
