// Mountain Goats - Game State Factory Functions

import type {
  GameState,
  Player,
  Mountain,
  Die,
  MountainId,
  PlayerColor,
} from '@/types/game'

import {
  MOUNTAIN_IDS,
  MOUNTAIN_PATH_LENGTHS,
  BASE_TOKEN_COUNTS,
  BONUS_TOKENS,
} from '@/types/game'

/**
 * Create a new player with initial state
 */
export function createPlayer(
  id: string,
  name: string,
  color: PlayerColor
): Player {
  // Initialize goat positions at base (0) for each mountain
  const goatPositions = {} as Record<MountainId, number>
  const collectedTokens = {} as Record<MountainId, number[]>

  for (const mountainId of MOUNTAIN_IDS) {
    goatPositions[mountainId] = 0 // All goats start at mountain base
    collectedTokens[mountainId] = [] // No tokens collected yet
  }

  return {
    id,
    name,
    color,
    goatPositions,
    collectedTokens,
    bonusTokens: [],
  }
}

/**
 * Create token pile for a mountain based on player count
 * Each token has the value equal to the mountain ID
 * 2 players: remove 2 tokens from each pile
 * 3 players: remove 1 token from each pile
 * 4 players: full pile
 */
export function createTokenPile(mountainId: MountainId, playerCount: number): number[] {
  let count = BASE_TOKEN_COUNTS[mountainId]

  // Adjust for player count per PRD section 3.2
  if (playerCount === 2) {
    count -= 2
  } else if (playerCount === 3) {
    count -= 1
  }

  // Each token has value equal to the mountain ID
  return Array(count).fill(mountainId)
}

/**
 * Create all mountains with their token piles
 */
export function createMountains(playerCount: number): Record<MountainId, Mountain> {
  const mountains = {} as Record<MountainId, Mountain>

  for (const id of MOUNTAIN_IDS) {
    mountains[id] = {
      id,
      pathLength: MOUNTAIN_PATH_LENGTHS[id],
      tokenPile: createTokenPile(id, playerCount),
    }
  }

  return mountains
}

/**
 * Create initial dice (4 dice, all with value 0 before first roll)
 */
export function createInitialDice(): Die[] {
  return [
    { id: 0, value: 0, groupIndex: null, isModified: false },
    { id: 1, value: 0, groupIndex: null, isModified: false },
    { id: 2, value: 0, groupIndex: null, isModified: false },
    { id: 3, value: 0, groupIndex: null, isModified: false },
  ]
}

/**
 * Create the initial game state
 */
export function createInitialGameState(players: Player[]): GameState {
  if (players.length < 2 || players.length > 4) {
    throw new Error('Game requires 2-4 players')
  }

  return {
    players,
    currentPlayerIndex: 0,
    mountains: createMountains(players.length),
    bonusTokenPile: [...BONUS_TOKENS], // [15, 12, 9, 6]
    currentDice: createInitialDice(),
    phase: 'rolling', // Game starts with first player rolling
    turnCount: 0,
    lastRoundStarted: false,
    startingPlayerIndex: 0,
  }
}

/**
 * Calculate total score for a player
 */
export function calculatePlayerScore(player: Player): number {
  let total = 0

  // Sum all collected mountain tokens
  for (const mountainId of MOUNTAIN_IDS) {
    const tokens = player.collectedTokens[mountainId]
    total += tokens.reduce((sum, val) => sum + val, 0)
  }

  // Add bonus tokens
  total += player.bonusTokens.reduce((sum, val) => sum + val, 0)

  return total
}

/**
 * Check if a player has collected at least one token from each mountain
 */
export function hasTokenFromEachMountain(player: Player): boolean {
  for (const mountainId of MOUNTAIN_IDS) {
    if (player.collectedTokens[mountainId].length === 0) {
      return false
    }
  }
  return true
}

/**
 * Count how many goats a player has at mountain summits
 */
export function countGoatsAtSummit(player: Player, mountains: Record<MountainId, Mountain>): number {
  let count = 0
  for (const mountainId of MOUNTAIN_IDS) {
    const position = player.goatPositions[mountainId]
    const summit = mountains[mountainId].pathLength
    if (position === summit) {
      count++
    }
  }
  return count
}

/**
 * Get the highest mountain ID where player has a goat at summit
 */
export function getHighestSummitMountain(
  player: Player,
  mountains: Record<MountainId, Mountain>
): MountainId | null {
  // Check from highest (10) to lowest (5)
  const sortedMountains = [...MOUNTAIN_IDS].reverse()
  for (const mountainId of sortedMountains) {
    const position = player.goatPositions[mountainId]
    const summit = mountains[mountainId].pathLength
    if (position === summit) {
      return mountainId
    }
  }
  return null
}

/**
 * Deep clone game state for immutable updates
 */
export function cloneGameState(state: GameState): GameState {
  return JSON.parse(JSON.stringify(state))
}
