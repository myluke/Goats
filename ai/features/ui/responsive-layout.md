---
id: ui.responsive-layout
module: ui
priority: 17
status: passing
version: 1
origin: manual
dependsOn:
  - ui.mountains
  - ui.dice-area
  - ui.player-panel
supersedes: []
tags:
  - ui
  - mobile
tddGuidance:
  generatedAt: '2025-12-04T16:24:01.986Z'
  generatedBy: codex
  forVersion: 1
  suggestedTestFiles:
    unit:
      - tests/ui/ui.responsive-layout.test.ts
    e2e:
      - e2e/ui/ui.responsive-layout.spec.ts
  unitTestCases:
    - name: renders full board and player sidebar on desktop widths
      assertions:
        - expect(renderForWidth(1280).getByTestId('board')).toBeVisible()
        - >-
          expect(renderForWidth(1280).getByTestId('player-sidebar')).toBeVisible()
    - name: mobile portrait layout stacks content without truncating board
      assertions:
        - >-
          expect(renderForViewport({width:375,height:667}).getByTestId('board')).toBeVisible()
        - >-
          expect(renderForViewport({width:375,height:667}).queryByTestId('player-sidebar')).toBeFalsy()
    - name: mobile landscape keeps full board and compact sidebar
      assertions:
        - >-
          expect(renderForViewport({width:667,height:375}).getByTestId('board')).toBeVisible()
        - >-
          expect(renderForViewport({width:667,height:375}).getByTestId('player-sidebar')).toHaveClass('compact')
    - name: primary action buttons meet minimum 44px touch size
      assertions:
        - >-
          expect(getTouchTargets().every(btn=>btn.clientWidth>=44 &&
          btn.clientHeight>=44)).toBe(true)
    - name: swipe gestures change active mountain index
      assertions:
        - >-
          const {getActiveMountainIndex, swipeLeft}=setupSwipeableMountains();
          swipeLeft(); expect(getActiveMountainIndex()).toBe(1)
    - name: current player's turn indicator remains visible on small screens
      assertions:
        - >-
          expect(renderForViewport({width:360,height:640}).getByTestId('current-turn')).toBeVisible()
        - >-
          expect(renderForViewport({width:360,height:640}).getByTestId('current-turn').textContent).toContain('Current')
    - name: layout prevents horizontal overflow on any viewport
      assertions:
        - 'expect(checkForHorizontalOverflow({width:320,height:640})).toBe(false)'
        - >-
          expect(checkForHorizontalOverflow({width:1440,height:900})).toBe(false)
  e2eScenarios:
    - name: desktop view shows full board with sidebar
      steps:
        - set viewport to 1440x900
        - navigate to /
        - verify board is fully visible
        - verify player sidebar is visible
    - name: mobile portrait stacks content without sidebar
      steps:
        - set viewport to 375x667
        - navigate to /
        - verify board is visible without horizontal scroll
        - verify player sidebar is hidden or collapsible
    - name: mobile landscape shows compact sidebar
      steps:
        - set viewport to 667x375
        - navigate to /
        - verify board is visible
        - verify sidebar is present with compact width
    - name: touch buttons meet minimum size
      steps:
        - set viewport to 360x640
        - navigate to /
        - query primary buttons
        - assert each has width and height at least 44px
    - name: swiping switches mountains
      steps:
        - set viewport to 360x640
        - navigate to /
        - swipe left on mountains area
        - verify active mountain changes
        - swipe right
        - verify active mountain changes back
    - name: current turn indicator visible on small screens
      steps:
        - set viewport to 360x640
        - navigate to /
        - verify current turn indicator is visible and legible
    - name: no horizontal overflow on small screens
      steps:
        - set viewport to 320x640
        - navigate to /
        - check body has no horizontal scrollbar or overflow
  frameworkHint: vitest
---
# Mobile-responsive layout with swipeable mountains

## Acceptance Criteria

1. Desktop: full board visible, sidebar for players
2. Mobile portrait:
3. Mobile landscape: similar to desktop but compact
4. Touch-friendly button sizes (min 44px)
5. Swipe gestures for mountain navigation
6. Current player's turn clearly visible on small screens
7. No horizontal overflow on any screen size
