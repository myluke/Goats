---
id: ui.grouping-interaction
module: ui
priority: 13
status: failing
version: 1
origin: manual
dependsOn:
  - ui.dice-area
supersedes: []
tags:
  - ui
  - interaction
---
# Drag/click dice grouping with real-time sum display

## Acceptance Criteria

1. Dice can be dragged into group slots (desktop)
2. Dice can be tapped to cycle through groups (mobile)
3. Show 1-4 group slots (flexible grouping)
4. Real-time sum calculation as dice are grouped
5. Visual connection between group and target mountain
6. Show "+1" indicator on mountain that will receive movement
7. Allow regrouping before confirmation
8. "Reset" button to undo all grouping
9. Highlight which mountains will move and which won't
