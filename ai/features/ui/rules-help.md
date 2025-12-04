---
id: ui.rules-help
module: ui
priority: 16
status: passing
version: 1
origin: manual
dependsOn:
  - ui.game-setup
supersedes: []
tags:
  - ui
  - help
tddGuidance:
  generatedAt: '2025-12-04T16:21:32.593Z'
  generatedBy: codex
  forVersion: 1
  suggestedTestFiles:
    unit:
      - tests/ui/ui.rules-help.test.ts
    e2e:
      - e2e/ui/ui.rules-help.spec.ts
  unitTestCases:
    - name: shows rules trigger button labeled ? or Rules during gameplay
      assertions:
        - >-
          expect(screen.getByRole('button', { name: /\?|rules/i
          })).toBeVisible()
        - >-
          expect(screen.getByRole('button', { name: /\?|rules/i
          })).toBeEnabled()
    - name: opens rules panel when trigger clicked
      assertions:
        - 'userEvent.click(screen.getByRole(''button'', { name: /\?|rules/i }))'
        - 'expect(screen.getByRole(''dialog'', { name: /rules/i })).toBeVisible()'
    - name: displays rules sections with headings
      assertions:
        - >-
          expect(screen.getByRole('heading', { name: /objective/i
          })).toBeVisible()
        - >-
          expect(screen.getAllByRole('heading', { level: 2
          })).toHaveLengthGreaterThan(1)
    - name: presents rules text in clear concise copy
      assertions:
        - >-
          expect(screen.getByRole('dialog', { name: /rules/i
          }).textContent?.length).toBeLessThan(2000)
        - >-
          expect(screen.getByText(/turn order/i)).toHaveTextContent(/turn order:
          .*?/i)
    - name: renders visual examples where available
      assertions:
        - >-
          expect(screen.getAllByRole('img', { name: /example/i
          })).not.toHaveLength(0)
        - >-
          expect(screen.getAllByRole('img', { name: /example/i
          })[0]).toBeVisible()
    - name: provides searchable or indexed navigation
      assertions:
        - expect(screen.getByPlaceholderText(/search rules/i)).toBeVisible()
        - >-
          userEvent.type(screen.getByPlaceholderText(/search rules/i), 'turn');
          expect(screen.getByText(/turn order/i)).toBeVisible()
    - name: opening rules does not pause or alter game state
      assertions:
        - >-
          const stateBefore = getGameStateSnapshot();
          userEvent.click(screen.getByRole('button', { name: /\?|rules/i }));
          expect(getGameStateSnapshot()).toEqual(stateBefore)
        - 'expect(screen.getByRole(''dialog'', { name: /rules/i })).toBeVisible()'
  e2eScenarios:
    - name: player opens rules from gameplay and sees dialog
      steps:
        - start game to active turn
        - click button labeled ? or Rules
        - verify rules dialog is visible with title Rules
    - name: rules dialog shows structured sections
      steps:
        - open rules dialog
        - check headings like Objective and Setup are displayed
        - verify multiple section headings exist
    - name: rules dialog text is concise and readable
      steps:
        - open rules dialog
        - ensure description under Turn Order is present
        - confirm total rules text does not exceed configured limit
    - name: visual examples visible in rules
      steps:
        - open rules dialog
        - scroll to examples section
        - verify at least one example image renders and is visible
    - name: search within rules narrows results
      steps:
        - open rules dialog
        - type 'turn' in search field
        - >-
          verify sections matching Turn Order remain visible and irrelevant
          sections are hidden or deprioritized
    - name: opening rules leaves game state running
      steps:
        - start game and note current score/turn
        - open rules dialog
        - >-
          verify score/turn indicators remain unchanged and inputs are not
          disabled
  frameworkHint: vitest
---
# In-game rules help modal/sidebar

## Acceptance Criteria

1. "?" or "Rules" button accessible during gameplay
2. Opens modal/sidebar with game rules
3. Sections for:
4. Clear, concise language
5. Visual examples where helpful
6. Searchable or indexed for quick reference
7. Does not interrupt game state
