---
id: ui.game-setup
module: ui
priority: 6
status: failing
version: 1
origin: manual
dependsOn:
  - core.game-state
supersedes: []
tags:
  - ui
  - setup
---
# Create game setup screen (2-4 players, names, colors)

## Acceptance Criteria

1. Create SetupScreen component as the initial view
2. Allow selecting 2, 3, or 4 players
3. For each player, allow entering:
   - Nickname (default: Player 1, Player 2, etc.)
   - Color selection from preset palette (4+ distinct colors)
4. Validate: no duplicate colors, all names non-empty
5. "Start Game" button to begin the match
6. Display game logo and brief tagline
7. Save player preferences to localStorage for next session
8. Responsive layout for mobile
