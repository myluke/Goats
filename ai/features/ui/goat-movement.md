---
id: ui.goat-movement
module: ui
priority: 11
status: passing
version: 1
origin: manual
dependsOn:
  - ui.mountains
supersedes: []
tags:
  - ui
  - animation
tddGuidance:
  generatedAt: '2025-12-04T16:11:42.335Z'
  generatedBy: codex
  forVersion: 1
  suggestedTestFiles:
    unit:
      - tests/ui/goat-movement.test.ts
    e2e:
      - e2e/ui/goat-movement.spec.ts
  unitTestCases:
    - name: animates goat moving up the mountain path
      assertions:
        - expect(animationSequence.path).toEqual(expectedPath)
        - expect(animationSequence.duration).toBeGreaterThan(0)
    - name: shows step-by-step movement frames
      assertions:
        - expect(frames.length).toBeGreaterThan(1)
        - expect(frames.every(frame => frame.position)).toBe(true)
    - name: plays knockoff animation at summit when opponent is present
      assertions:
        - expect(knockoffEvent.triggered).toBe(true)
        - expect(knockoffEvent.targetId).toBe(opponentId)
    - name: flies collected token to player panel
      assertions:
        - expect(tokenAnimation.target).toBe('player-panel')
        - expect(tokenAnimation.path.includes('player-panel')).toBe(true)
    - name: animates score increment in player panel
      assertions:
        - expect(scoreAnimation.delta).toBe(1)
        - expect(scoreAnimation.completed).toBe(true)
    - name: queues sequential animations for multiple moves in one turn
      assertions:
        - expect(queue.length).toBe(moves.length)
        - expect(queue.isSerial).toBe(true)
    - name: skips animations when skip option is enabled
      assertions:
        - expect(playback.skipped).toBe(true)
        - expect(playback.duration).toBe(0)
  e2eScenarios:
    - name: user sees goat animate up the mountain path
      steps:
        - navigate to game board
        - trigger goat move
        - verify goat sprite moves along path
    - name: user sees step-by-step movement frames
      steps:
        - navigate to game board
        - trigger single-step advance
        - verify goat pauses at intermediate steps
    - name: user sees opponent knocked off at summit
      steps:
        - navigate to game board with opponent at summit
        - move goat onto summit
        - verify opponent piece is knocked off and falls
    - name: user sees collected token fly to player panel
      steps:
        - navigate to game board with token on path
        - move goat onto token space
        - verify token animates into player panel
    - name: user sees score increment animation in player panel
      steps:
        - navigate to player panel
        - complete token collection move
        - verify score increment animates and new score displayed
    - name: user sees sequential animations for multiple moves in one turn
      steps:
        - navigate to game board
        - trigger multi-move turn
        - verify animations run in sequence without overlap
    - name: user skips animations for faster play
      steps:
        - navigate to settings or controls
        - enable skip animations option
        - trigger goat move and verify no animation delay
  frameworkHint: vitest
---
# Animate goat movement and knockoff effects

## Acceptance Criteria

1. Animate goat moving up the mountain path
2. Animation shows step-by-step movement
3. When reaching summit and knocking off opponent:
4. When collecting token, show token flying to player panel
5. Score increment animation in player panel
6. Sequential animations for multiple moves in one turn
7. Skip animation option for faster play
