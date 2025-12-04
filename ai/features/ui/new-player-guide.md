---
id: ui.new-player-guide
module: ui
priority: 18
status: failing
version: 1
origin: manual
dependsOn:
  - ui.game-setup
  - ui.dice-area
supersedes: []
tags:
  - ui
  - tutorial
---
# First-time player tutorial/demo mode

## Acceptance Criteria

1. Detect first-time visitor (no localStorage flag)
2. Offer "Learn to Play" option on setup screen
3. Step-by-step guided tutorial:
   - Explain the goal
   - Show how to roll dice
   - Demonstrate grouping
   - Explain movement and scoring
   - Show bonus token mechanic
4. Highlight relevant UI elements at each step
5. Allow skipping tutorial at any point
6. Mark tutorial as completed in localStorage
7. Option to replay tutorial from settings
