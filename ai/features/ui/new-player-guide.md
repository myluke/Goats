---
id: ui.new-player-guide
module: ui
priority: 18
status: passing
version: 1
origin: manual
dependsOn:
  - ui.game-setup
  - ui.dice-area
supersedes: []
tags:
  - ui
  - tutorial
tddGuidance:
  generatedAt: '2025-12-04T16:26:51.109Z'
  generatedBy: codex
  forVersion: 1
  suggestedTestFiles:
    unit:
      - tests/ui/new-player-guide.test.ts
    e2e:
      - e2e/ui/new-player-guide.spec.ts
  unitTestCases:
    - name: detects first-time visitor when tutorial flag is missing
      assertions:
        - expect(hasCompletedTutorial(localStorageMock)).toBe(false)
        - >-
          expect(localStorageMock.getItem).toHaveBeenCalledWith('tutorialCompleted')
    - name: shows Learn to Play option on setup screen for first-time visitors
      assertions:
        - render(<SetupScreen isFirstVisit />)
        - >-
          expect(screen.getByRole('button', { name: /learn to play/i
          })).toBeInTheDocument()
    - name: runs step-by-step tutorial sequence in order
      assertions:
        - const tutorial = startTutorial()
        - expect(tutorial.currentStepIndex).toBe(0)
        - tutorial.next(); expect(tutorial.currentStepIndex).toBe(1)
    - name: applies highlight to the target element for each tutorial step
      assertions:
        - 'const step = { targetId: ''scoreboard'', content: ''...'' }'
        - tutorial.applyHighlight(step)
        - expect(highlightLayer.show).toHaveBeenCalledWith('scoreboard')
    - name: skips tutorial at any point and stops progression
      assertions:
        - tutorial.start(); tutorial.next(); tutorial.skip()
        - expect(tutorial.isActive).toBe(false)
        - expect(tutorial.currentStepIndex).toBe(0)
    - name: marks tutorial as completed in localStorage after finishing
      assertions:
        - tutorial.finish()
        - >-
          expect(localStorage.setItem).toHaveBeenCalledWith('tutorialCompleted',
          'true')
        - expect(hasCompletedTutorial(localStorage)).toBe(true)
    - name: restarts tutorial from settings on user request
      assertions:
        - openSettings(); triggerReplayTutorial()
        - expect(tutorial.reset).toHaveBeenCalled()
        - expect(tutorial.isActive).toBe(true)
  e2eScenarios:
    - name: first-time visitor sees Learn to Play option
      steps:
        - clear localStorage tutorial flag
        - navigate to setup screen
        - verify Learn to Play button is visible
    - name: user starts tutorial and sees step-by-step guide
      steps:
        - navigate to setup screen
        - click Learn to Play
        - verify tutorial overlay displays step 1 content
        - click Next
        - verify step 2 content appears
    - name: tutorial highlights relevant UI elements per step
      steps:
        - start tutorial
        - verify highlight is applied to first target element
        - click Next
        - verify highlight moves to the next target element
    - name: user can skip tutorial at any point
      steps:
        - start tutorial
        - click Skip
        - verify tutorial overlay and highlights are removed
        - verify setup screen is usable again
    - name: user can replay tutorial from settings after completion
      steps:
        - set tutorialCompleted flag in localStorage
        - navigate to settings
        - click Replay Tutorial
        - verify tutorial overlay starts at step 1
  frameworkHint: vitest
---
# First-time player tutorial/demo mode

## Acceptance Criteria

1. Detect first-time visitor (no localStorage flag)
2. Offer "Learn to Play" option on setup screen
3. Step-by-step guided tutorial:
4. Highlight relevant UI elements at each step
5. Allow skipping tutorial at any point
6. Mark tutorial as completed in localStorage
7. Option to replay tutorial from settings
