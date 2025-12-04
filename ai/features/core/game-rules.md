---
id: core.game-rules
module: core
priority: 3
status: failing
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
   - Each die assigned to exactly one group
   - Only sums 5-10 are valid for movement
3. Implement moveGoat(state, playerId, mountainId):
   - Move goat up one step on the mountain
   - If reaching summit and another player's goat is there, knock it off
   - If at summit, collect a token from that mountain's pile
   - If already at summit and move again, just collect token
4. Implement checkBonusToken(state, playerId):
   - Check if player has at least one token from each mountain (5-10)
   - If true and bonus tokens available, award highest remaining bonus
5. Implement getValidMoves(dice) - return all valid groupings
6. Mountain path lengths: 5->4 steps, 6->5, 7->6, 8->5, 9->4, 10->3
7. Token pile sizes based on player count (2P: -2 each, 3P: -1 each)
8. All rules as pure functions in src/lib/rules.ts
