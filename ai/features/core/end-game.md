---
id: core.end-game
module: core
priority: 5
status: passing
version: 1
origin: manual
dependsOn:
  - core.turn-flow
supersedes: []
tags:
  - core
  - scoring
---
# Implement end game detection and scoring with tiebreakers

## Acceptance Criteria

1. Implement checkEndCondition(state):
2. Implement handleEndGame(state):
3. Implement calculateScores(state):
4. Implement resolveTiebreaker(players):
5. Implement getGameResults(state):
6. All end game logic in src/lib/endGame.ts
