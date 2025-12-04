---
id: core.turn-flow
module: core
priority: 4
status: passing
version: 1
origin: manual
dependsOn:
  - core.game-rules
supersedes: []
tags:
  - core
  - turn
---
# Implement turn flow logic (roll, group, move, bonus check, end turn)

## Acceptance Criteria

1. Implement handleMultipleOnes(dice, replacements):
2. Implement executeTurn(state, groups):
3. Implement nextPlayer(state):
4. Implement getTurnState(state):
5. Game phases: SETUP -> ROLLING -> GROUPING -> MOVING -> (repeat or ENDED)
6. Turn flow state machine in src/lib/turnFlow.ts
