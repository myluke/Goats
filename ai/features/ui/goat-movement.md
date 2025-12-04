---
id: ui.goat-movement
module: ui
priority: 11
status: failing
version: 1
origin: manual
dependsOn:
  - ui.mountains
supersedes: []
tags:
  - ui
  - animation
---
# Animate goat movement and knockoff effects

## Acceptance Criteria

1. Animate goat moving up the mountain path
2. Animation shows step-by-step movement
3. When reaching summit and knocking off opponent:
   - Show opponent goat being pushed off
   - Opponent goat animates back to base
   - Brief visual/text notification of knockoff
4. When collecting token, show token flying to player panel
5. Score increment animation in player panel
6. Sequential animations for multiple moves in one turn
7. Skip animation option for faster play
