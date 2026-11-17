---
name: resizable
title: Resizable
type: ui
surface: site
description: "Panels with a draggable edge: the quiet 1px rule between them turns to the strong line under the pointer and the ink while dragged or focused, with an optional square grip tab. Drag it or use the arrow keys."
use_for: "Use ResizablePanelGroup with ResizablePanel and ResizableHandle for a split view people tune (a thread and its checks, a diff and a terminal). Give panels a defaultSize and minSize in percent; nest a vertical group inside a panel for a grid. Add withHandle when the edge should look grabbable."
never: [A thick or colored divider, A rounded grip, Animated resizing, Panels that collapse to nothing without a minSize]
source: "Extrapolated from the Hoplite website: the quiet rule between the product window's thread and side panel (.pa-split) made draggable"
---
