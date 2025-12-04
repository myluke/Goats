---
id: persistence.local-storage
module: persistence
priority: 15
status: passing
version: 1
origin: manual
dependsOn:
  - core.game-state
supersedes: []
tags:
  - persistence
  - storage
tddGuidance:
  generatedAt: '2025-12-04T16:19:28.977Z'
  generatedBy: codex
  forVersion: 1
  suggestedTestFiles:
    unit:
      - tests/persistence/persistence.local-storage.test.ts
    e2e:
      - e2e/persistence/local-storage.spec.ts
  unitTestCases:
    - name: auto-saves game state after each turn
      assertions:
        - expect(saveTurnSpy).toHaveBeenCalledTimes(turns.length)
        - >-
          expect(localStorage.setItem).toHaveBeenCalledWith("mountain-goats-save",
          JSON.stringify(expectedStateAfterLastTurn))
    - name: uses the mountain-goats-save key when persisting
      assertions:
        - >-
          expect(localStorage.setItem).toHaveBeenCalledWith("mountain-goats-save",
          expect.any(String))
        - >-
          expect(JSON.parse((localStorage.setItem as
          Mock).mock.calls[0][1])).toMatchObject(expectedState)
    - name: detects existing save on page load
      assertions:
        - expect(loadSavedState()).toEqual(savedStateFixture)
        - >-
          expect(localStorage.getItem).toHaveBeenCalledWith("mountain-goats-save")
    - name: restores full game state payload
      assertions:
        - >-
          expect(restoreState(savedStateFixture)).toMatchObject({ player:
          savedStateFixture.player, map: savedStateFixture.map, inventory:
          savedStateFixture.inventory, progress: savedStateFixture.progress })
        - >-
          expect(rehydrateGame(savedStateFixture)).toHaveProperty("turnNumber",
          savedStateFixture.turnNumber)
    - name: handles corrupted save data gracefully
      assertions:
        - expect(loadSavedState()).toEqual(createNewGameState())
        - >-
          expect(logger.error).toHaveBeenCalledWith(expect.stringContaining("corrupted"))
  e2eScenarios:
    - name: prompt offers continue or start new when save exists
      steps:
        - seed localStorage with saved game under mountain-goats-save
        - load the game page
        - verify modal text contains "Continue previous game?"
        - click "Continue"
        - verify loaded game reflects saved turn number
        - click "Start new" on reload
        - verify new game state resets to turn 1
    - name: save and quit from game menu
      steps:
        - load game to an in-progress state
        - open game menu
        - click "Save & Quit"
        - verify localStorage contains mountain-goats-save with current state
        - verify user is returned to main menu/start screen
    - name: clear saved game from menu
      steps:
        - seed localStorage with saved game under mountain-goats-save
        - open game menu
        - click "Clear Save"
        - confirm any confirmation prompt
        - verify localStorage.getItem("mountain-goats-save") returns null
        - verify subsequent reload shows no continue prompt
  frameworkHint: vitest
---
# Save/restore game state to LocalStorage

## Acceptance Criteria

1. Auto-save game state after each turn
2. Save to localStorage with key "mountain-goats-save"
3. On page load, detect existing save
4. Prompt user: "Continue previous game?" or "Start new"
5. Restore full game state including:
6. "Save & Quit" option in game menu
7. "Clear Save" option to delete saved game
8. Handle corrupted save data gracefully
