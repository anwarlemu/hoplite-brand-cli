---
name: command
title: Command
type: ui
surface: site
kinds: [menu-panel, menu-item]
description: "A command palette: the site's square popup panel with a 48px search row over the quiet rule, Kode Mono group labels, 36px rows on the hover wash when highlighted and Kode Mono shortcuts at the end; the dialog opens and closes without motion. A long list fades at the edge it scrolls past (fade-y)."
use_for: "Use CommandDialog for a palette opened with Command K (new thread, open a terminal, go to pull requests), or Command inline for a searchable list of actions. Put CommandInput first, then CommandList with CommandEmpty, CommandGroup (heading), CommandItem (onSelect) and CommandSeparator; CommandShortcut shows the keys. Built on cmdk, with the dialog on Base UI Dialog."
never: [An open or close animation, Rounded panels or rows, A highlight that slides between rows, Shortcuts in the body face, More than one palette per app]
source: "Extrapolated from the Hoplite website: the nav popup (.hn__panel, .hn__item), Kode Mono labels (.label) and the 32 percent ink scrim"
---
