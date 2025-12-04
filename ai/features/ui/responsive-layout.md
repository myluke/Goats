---
id: ui.responsive-layout
module: ui
priority: 17
status: failing
version: 1
origin: manual
dependsOn:
  - ui.mountains
  - ui.dice-area
  - ui.player-panel
supersedes: []
tags:
  - ui
  - mobile
---
# Mobile-responsive layout with swipeable mountains

## Acceptance Criteria

1. Desktop: full board visible, sidebar for players
2. Mobile portrait:
   - Mountains in horizontal scroll/swipe view
   - Dice area fixed at bottom
   - Player panel in collapsible header
3. Mobile landscape: similar to desktop but compact
4. Touch-friendly button sizes (min 44px)
5. Swipe gestures for mountain navigation
6. Current player's turn clearly visible on small screens
7. No horizontal overflow on any screen size
