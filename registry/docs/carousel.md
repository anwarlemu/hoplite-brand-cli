---
name: carousel
title: Carousel
type: ui
surface: site
kinds: [button-secondary]
description: "A row of slides that snap into place, with 32px outlined hexagon keys for previous and next outside the row and optional point-up hexagon marks for the slides, the current one ink. Native scroll, touch and arrow keys."
use_for: "Use Carousel for a short set of peer items people browse one at a time (automation templates, plan highlights). Put each slide in CarouselItem (basis-1/2 for two at once), add CarouselPrevious and CarouselNext, and CarouselDots under the row when the count matters. Leave 48px of room at the sides for the keys."
never: [Autoplay, Round arrow keys or round dots, Slides that fade or scale, Hiding content that people must see in a carousel]
source: "Extrapolated from the Hoplite website: its outlined icon keys (.button--line) and hexagon bullets on a native snapping scroll"
---
