---
id: ui.player-panel
module: ui
priority: 9
status: failing
version: 1
origin: manual
dependsOn:
  - ui.game-setup
supersedes: []
tags:
  - ui
  - player
---
# Display player list with scores, tokens, and current turn indicator

## Acceptance Criteria

1. Create PlayerPanel component (sidebar or top bar)
2. Show all players with:
   - Name and color indicator
   - Current total score
   - Number of tokens collected per mountain (small icons)
   - Bonus tokens earned
3. Highlight current player's turn prominently
4. Show turn order visually
5. Indicate which players have tokens from all 6 mountains
6. Expandable details to see token breakdown
7. Responsive: collapsible on mobile
