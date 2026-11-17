---
name: chart
title: Chart
type: ui
surface: site
description: "SVG bar, line, area and pie charts: series in the ink first, the orange second and the gray steps after, a quiet hairline grid, Kode Mono axis labels, square bars and keys, and a small square tooltip panel with a Kode Mono label."
use_for: "Use for usage and activity over time (threads opened, pull requests merged, sandbox minutes) or a share (runs by agent). Wrap BarChart, LineChart, AreaChart or PieChart in ChartContainer with a config that labels each series (color is optional; the series tokens are the default), and add ChartTooltip with ChartTooltipContent and ChartLegend with ChartLegendContent. Give every chart an aria-label. Dependency free: no chart library."
never: [Rounded bars, Gradient fills beyond a faint area wash, More than five series, Orange for anything but the series that matters, An entrance animation on scroll]
source: "Extrapolated from the Hoplite website: its lines (the 16 and 32 percent rules), Kode Mono labels, the orange mark and the nav popup (.hn__panel) for the tooltip"
---
