---
name: data-table
title: Data table
type: ui
surface: site
kinds: [table]
description: "Table with sorting, filtering, row checks and pages: Kode Mono heads that sort with a 12px arrow, square checks in the first column with the chosen rows on the hover wash, a filter field and a compact outlined hexagon Columns key above, and a 48px footer on the quiet rule with the count, rows per page and two ghost hexagon keys. A table wider than its frame scrolls sideways and fades at the edge it scrolls past (fade-x)."
use_for: "Use for records people work through (runs, threads, seats, automations). Describe columns with id, header, accessor (the value to sort and filter by), cell (what to show), sortable, align, hidden and hideable; pass data and getRowId. selectable with selection and onSelectionChange adds the checks; pageSize and pageSizes set the pages; toolbar adds actions beside the Columns key; empty fills the body when nothing matches. For a table people only read, use Table. Dependency free: no table library."
never: [A boxed or rounded frame around the table, Animating rows as they sort or page, Hover-only row actions, Bold or orange heads]
source: "Extrapolated from the Hoplite website: the ruled tables (.pr-table, .bp-table), Kode Mono labels, the compact keys (.button--s, .button--line) and the nav popup (.hn__panel)"
---
