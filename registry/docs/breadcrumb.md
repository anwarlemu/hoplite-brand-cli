---
name: breadcrumb
title: Breadcrumb
type: ui
surface: site
kinds: [link]
description: "A trail of pages: 14px links in the quiet gray that turn ink under the pointer, the current page in the ink at medium weight, a slate slash (or a caret) between them, and a three-dot glyph for folded pages."
use_for: "Use Breadcrumb at the top of a page that sits inside a hierarchy (a workspace, a repository, a pull request), or for a single back link (All posts). Use the default slash, or pass a CaretRightIcon as the separator's child. Link items with BreadcrumbLink (asChild or render for a router link) and end with BreadcrumbPage."
never: [A link on the current page, Kode Mono or caps crumbs, Underlined crumbs, An arrow that moves on hover]
source: "The Hoplite website's blog post back link (.bp-back: All posts) and the product window's crumb (.pa-crumb, .pa-crumb__project, .pa-crumb__sep)"
---
