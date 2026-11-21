---
name: table
title: Table
type: ui
surface: site
kinds: [table]
description: "Ruled, not boxed: Kode Mono column heads over the strong rule and 48px rows of 14px ink with a quiet rule between them; the compare variant is the pricing table (Chakra Petch 20px plan heads, group rows, a filled ink hexagon for yes and a slate dash for no) and the prose variant the blog's 16px table. A table wider than its frame scrolls sideways and fades at the edge it scrolls past (fade-x)."
use_for: "Use Table for records people read across (threads, seats, runs) and variant=\"compare\" for a plan or feature comparison: TableGroup opens each section, row names are TableHead with scope=\"row\", and TableYes and TableNo mark what is included. Use variant=\"prose\" inside an article. Keep the shadcn parts (TableHeader, TableBody, TableRow, TableHead, TableCell, TableFooter, TableCaption); mark a chosen row with data-state=\"selected\". For sorting, selection and pages use DataTable."
never: [A boxed or rounded frame, Zebra stripes or filled head rows, Bold heads, A check icon or an orange mark for yes, Rows that move under the pointer]
source: "The Hoplite website's pricing comparison (.pr-table, .pr-table__group, .pr-yes, .pr-no on /pricing) and the blog table (.bp-table)"
---
