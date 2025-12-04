---
id: core.game-rules
module: core
priority: 3
status: passing
version: 1
origin: manual
dependsOn:
  - core.game-state
supersedes: []
tags:
  - core
  - rules
---
# Implement core game rules engine (dice grouping, movement, scoring)

## Acceptance Criteria

1. Implement rollDice() - returns 4 random dice values (1-6)
2. Implement validateGroups(dice, groups) - check if grouping is valid:
3. Implement moveGoat(state, playerId, mountainId):
4. Implement checkBonusToken(state, playerId):
5. Implement getValidMoves(dice) - return all valid groupings
6. Mountain path lengths: 5->4 steps, 6->5, 7->6, 8->5, 9->4, 10->3
7. Token pile sizes based on player count (2P: -2 each, 3P: -1 each)
8. All rules as pure functions in src/lib/rules.ts
