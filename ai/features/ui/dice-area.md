---
id: ui.dice-area
module: ui
priority: 8
status: failing
version: 1
origin: manual
dependsOn:
  - ui.mountains
supersedes: []
tags:
  - ui
  - dice
---
# Create dice rolling area with grouping interaction

## Acceptance Criteria

1. Create DiceArea component at bottom of game board
2. Show 4 dice with current values (or empty before roll)
3. "Roll Dice" button triggers roll (disabled during other phases)
4. After roll, dice become draggable/clickable for grouping
5. Show group slots where dice can be placed
6. Display sum of each group in real-time
7. Highlight groups with valid sums (5-10) in green
8. Highlight invalid sums (other values) in gray
9. "Confirm" button to execute the chosen grouping
10. Clear visual feedback for current game phase
