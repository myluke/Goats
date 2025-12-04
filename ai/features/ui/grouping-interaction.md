---
id: ui.grouping-interaction
module: ui
priority: 13
status: passing
version: 1
origin: manual
dependsOn:
  - ui.dice-area
supersedes: []
tags:
  - ui
  - interaction
tddGuidance:
  generatedAt: '2025-12-04T16:16:57.175Z'
  generatedBy: codex
  forVersion: 1
  suggestedTestFiles:
    unit:
      - tests/ui/grouping-interaction.test.ts
    e2e:
      - e2e/ui/grouping-interaction.spec.ts
  unitTestCases:
    - name: dragging a die into a group slot assigns it to that slot
      assertions:
        - 'expect(groupSlots[0].hasDie(dieId)).toBe(true)'
        - expect(unassignedDice.has(dieId)).toBe(false)
    - name: tapping a die cycles it through available groups on mobile
      assertions:
        - expect(getDieGroup(dieId)).toBe('group-2')
        - expect(getDieGroupAfterNextTap(dieId)).toBe('group-3')
    - name: renderer supports between one and four visible group slots
      assertions:
        - expect(renderGroupSlots(1).length).toBe(1)
        - expect(renderGroupSlots(4).length).toBe(4)
    - name: group sums update immediately when dice are added or removed
      assertions:
        - expect(groupSum('group-1')).toBe(7)
        - expect(groupSum('group-1')).toBe(3)
    - name: each group shows a visual link to its target mountain
      assertions:
        - 'expect(getGroupLink(''group-1'')).toContain(''mountain-1''),'
        - expect(isLinkVisible('group-1')).toBe(true)
    - name: mountain shows +1 indicator when its linked group will move it
      assertions:
        - expect(getMountainIndicator('mountain-2')).toBe('+1')
        - expect(isIndicatorVisible('mountain-2')).toBe(true)
    - name: dice can be reassigned between groups before confirmation
      assertions:
        - expect(getDieGroup(dieId)).toBe('group-2')
        - expect(getDieGroupAfterMove(dieId)).toBe('group-1')
    - name: reset clears all group assignments and sums
      assertions:
        - expect(allGroupsEmpty()).toBe(true)
        - expect(totalSum()).toBe(0)
    - name: mountains indicate which will move and which will not
      assertions:
        - expect(getMountainStatus('mountain-moving')).toBe('moving')
        - expect(getMountainStatus('mountain-static')).toBe('static')
  e2eScenarios:
    - name: desktop user drags dice into groups and sees sums update
      steps:
        - navigate to grouping screen
        - drag die A into Group 1 slot
        - drag die B into Group 1 slot
        - verify Group 1 displays sum of die A+B
        - verify die A/B show linked to Group 1
        - verify Group 1 visually links to its mountain
    - name: mobile user taps dice to cycle through groups
      steps:
        - open grouping screen on mobile viewport
        - tap die A once to assign to Group 1
        - tap die A again to assign to Group 2
        - verify die A shows Group 2 selection and link to mountain 2
    - name: flexible group slots render between one and four
      steps:
        - navigate to grouping screen with 1-slot config
        - verify only Group 1 slot renders
        - switch to 4-slot config
        - verify Group 1-4 slots render
    - name: real-time sum updates when regrouping before confirmation
      steps:
        - open grouping screen
        - assign die A to Group 1 and note sum
        - move die A to Group 2
        - verify Group 1 sum decreases and Group 2 sum increases immediately
    - name: visual link and +1 indicator show target mountain movement
      steps:
        - open grouping screen
        - assign dice to Group 2
        - verify Group 2 shows connector to mountain 2
        - verify mountain 2 shows '+1' indicator
    - name: user resets to clear all groupings
      steps:
        - open grouping screen
        - assign multiple dice across groups
        - click Reset button
        - verify all dice return to unassigned area and sums reset to 0
    - name: mountains highlight which will move versus stay
      steps:
        - open grouping screen with some grouped dice
        - verify mountains linked to groups are marked moving
        - verify unlinked mountains show static state
  frameworkHint: vitest
---
# Drag/click dice grouping with real-time sum display

## Acceptance Criteria

1. Dice can be dragged into group slots (desktop)
2. Dice can be tapped to cycle through groups (mobile)
3. Show 1-4 group slots (flexible grouping)
4. Real-time sum calculation as dice are grouped
5. Visual connection between group and target mountain
6. Show "+1" indicator on mountain that will receive movement
7. Allow regrouping before confirmation
8. "Reset" button to undo all grouping
9. Highlight which mountains will move and which won't
