---
id: core.game-state
module: core
priority: 2
status: failing
version: 1
origin: manual
dependsOn:
  - setup.project-init
supersedes: []
tags:
  - core
  - state
---
# Define game state model (mountains, tokens, players, goats, dice)

## Acceptance Criteria

1. Define Mountain type with:
   - id (5, 6, 7, 8, 9, 10)
   - path length (number of steps to summit)
   - token pile (array of point values)
2. Define Player type with:
   - id, name, color
   - goatPositions (map of mountainId -> position)
   - collectedTokens (map of mountainId -> token values)
   - bonusTokens (array of bonus values)
3. Define Dice type with value (1-6) and groupIndex
4. Define GameState with:
   - players array
   - currentPlayerIndex
   - mountains map
   - bonusTokenPile (15, 12, 9, 6)
   - currentDice (4 dice)
   - phase (setup, rolling, grouping, moving, ended)
   - turnCount
5. Create initial state factory function
6. All types exported from src/types/game.ts
