---
id: persistence.local-storage
module: persistence
priority: 15
status: failing
version: 1
origin: manual
dependsOn:
  - core.game-state
supersedes: []
tags:
  - persistence
  - storage
---
# Save/restore game state to LocalStorage

## Acceptance Criteria

1. Auto-save game state after each turn
2. Save to localStorage with key "mountain-goats-save"
3. On page load, detect existing save
4. Prompt user: "Continue previous game?" or "Start new"
5. Restore full game state including:
   - All player data and positions
   - Token piles
   - Current turn and phase
6. "Save & Quit" option in game menu
7. "Clear Save" option to delete saved game
8. Handle corrupted save data gracefully
