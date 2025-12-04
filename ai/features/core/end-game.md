---
id: core.end-game
module: core
priority: 5
status: failing
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
   - Return true if all bonus tokens taken
   - Return true if 3+ mountains have empty token piles
2. Implement handleEndGame(state):
   - Continue until all players have equal turns
   - Mark game as ended
3. Implement calculateScores(state):
   - Sum all collected tokens (mountain tokens + bonus tokens)
   - Return sorted player scores
4. Implement resolveTiebreaker(players):
   - First tiebreaker: player with more goats at summit wins
   - Second tiebreaker: player with goat on highest numbered mountain (10>9>...>5) wins
5. Implement getGameResults(state):
   - Return rankings with scores, breakdown, and winner
   - Include tiebreaker reason if applicable
6. All end game logic in src/lib/endGame.ts
