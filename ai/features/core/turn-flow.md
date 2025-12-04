---
id: core.turn-flow
module: core
priority: 4
status: failing
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
   - If more than one "1" rolled, allow changing extra 1s to any value
   - Keep exactly one "1" unchanged
2. Implement executeTurn(state, groups):
   - For each valid group (sum 5-10), move the corresponding goat
   - Apply scoring after all moves
   - Check for bonus token eligibility
   - Return new state
3. Implement nextPlayer(state):
   - Advance to next player
   - Increment turn count
   - Check end game condition
4. Implement getTurnState(state):
   - Return current phase and valid actions
5. Game phases: SETUP -> ROLLING -> GROUPING -> MOVING -> (repeat or ENDED)
6. Turn flow state machine in src/lib/turnFlow.ts
