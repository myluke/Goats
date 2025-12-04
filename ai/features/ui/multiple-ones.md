---
id: ui.multiple-ones
module: ui
priority: 12
status: passing
version: 1
origin: manual
dependsOn:
  - ui.dice-area
supersedes: []
tags:
  - ui
  - dice
tddGuidance:
  generatedAt: '2025-12-04T16:14:41.034Z'
  generatedBy: codex
  forVersion: 1
  suggestedTestFiles:
    unit:
      - tests/ui/multiple-ones.test.ts
    e2e:
      - e2e/ui/multiple-ones.spec.ts
  unitTestCases:
    - name: detects multiple rolled ones
      assertions:
        - 'expect(getExtraOnes([1,1,2,3,4])).toEqual([1])'
        - 'expect(getExtraOnes([1,1,1,5,6])).toHaveLength(2)'
    - name: highlights extra ones except one
      assertions:
        - expect(renderedDice().filter(isHighlighted)).toEqual(extraOneDice)
        - >-
          expect(renderedDice().filter(isHighlighted)).not.toContain(originalOneDie)
    - name: shows tooltip explaining rule on highlighted ones
      assertions:
        - expect(getTooltip(highlightedDie)).toContain('extra 1 can be changed')
        - expect(getTooltip(originalOneDie)).toBeUndefined()
    - name: opens value selector on clicking highlighted one
      assertions:
        - clickDie(extraOneDie); expect(isSelectorOpen()).toBe(true)
        - 'expect(getSelectorOptions()).toEqual([1,2,3,4,5,6])'
    - name: allows each extra one to change to different value
      assertions:
        - >-
          setDieValue(extraOneDieA,4); setDieValue(extraOneDieB,6);
          expect(currentRoll()).toContain(4); expect(currentRoll()).toContain(6)
        - expect(extraOneDieA.value).not.toBe(extraOneDieB.value)
    - name: keeps one original one unchanged and visually distinct
      assertions:
        - expect(currentRoll().filter(v=>v===1)).toContain(1)
        - expect(isOriginalOneMarked(originalOneDie)).toBe(true)
    - name: proceeds after confirm or grouping action
      assertions:
        - >-
          performSelections(); clickConfirm();
          expect(hasAdvancedToGrouping()).toBe(true)
        - expect(confirmButton().disabled).toBe(false)
    - name: renders modified dice with distinct visual state
      assertions:
        - expect(modifiedDice().every(hasModifiedStyle)).toBe(true)
        - expect(originalOneDie).not.toSatisfy(hasModifiedStyle)
  e2eScenarios:
    - name: extra ones are detected and highlighted with tooltip
      steps:
        - roll dice with at least two ones
        - verify only extra ones are highlighted
        - hover highlighted die and see rule tooltip
        - verify one unhighlighted original one remains
    - name: selecting a highlighted one opens value selector with options 1-6
      steps:
        - roll dice with multiple ones
        - click a highlighted one
        - verify value selector opens with options 1-6
    - name: changing each extra one to different values and confirming proceeds
      steps:
        - roll dice with three ones
        - change first extra one to 4 and second to 6
        - verify original one stays at 1 and is marked
        - click Confirm Changes
        - verify navigation to grouping or next step
    - name: modified dice show distinct appearance after change
      steps:
        - roll dice with multiple ones
        - change an extra one to another value
        - verify changed die shows modified styling distinct from unchanged one
  frameworkHint: vitest
---
# UI for changing extra 1s to other values

## Acceptance Criteria

1. Detect when more than one "1" is rolled
2. Highlight extra 1s (all except one)
3. Show tooltip explaining the rule
4. Click on highlighted 1 to open value selector (1-6)
5. Each extra 1 can be changed to a different value
6. One original 1 must remain unchanged (visually indicate which)
7. "Confirm Changes" or proceed to grouping after selection
8. Clear visual state of modified dice (different appearance)
