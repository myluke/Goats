---
id: ui.mountains
module: ui
priority: 7
status: passing
version: 1
origin: manual
dependsOn:
  - ui.game-setup
  - core.game-state
supersedes: []
tags:
  - ui
  - board
---
# Render 6 mountains with paths, goat positions, and token piles

## Acceptance Criteria

1. Create MountainBoard component showing 6 mountains (5-10) horizontally
2. Each mountain shows:
3. Display goat meeples at their current positions on each mountain
4. Summit shows only one goat (the one currently there)
5. Visual indication when a mountain's token pile is empty
6. Responsive: horizontal scroll on mobile
7. Click on mountain shows token pile details
