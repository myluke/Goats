---
id: ui.multiple-ones
module: ui
priority: 12
status: failing
version: 1
origin: manual
dependsOn:
  - ui.dice-area
supersedes: []
tags:
  - ui
  - dice
---
# UI for changing extra 1s to other values

## Acceptance Criteria

1. Detect when more than one "1" is rolled
2. Highlight extra 1s (all except one)
3. Show tooltip explaining the rule
4. Click on highlighted 1 to open value selector (1-6)
5. Each extra 1 can be changed to a different value
6. One original 1 must remain unchanged (visually indicate which)
7. "Confirm Changes" or proceed to grouping after selection
8. Clear visual state of modified dice (different appearance)
