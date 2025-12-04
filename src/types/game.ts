// Mountain Goats - Game Types

export type MountainId = 5 | 6 | 7 | 8 | 9 | 10

export type GamePhase = 'setup' | 'rolling' | 'grouping' | 'moving' | 'ended'

export type PlayerColor = 'red' | 'blue' | 'green' | 'yellow'

export interface Mountain {
  id: MountainId
  pathLength: number // Number of steps to reach summit
  tokenPile: number[] // Stack of point values remaining
}

export interface Die {
  id: number
  value: number // 1-6
  groupIndex: number | null // Which group this die belongs to
  isModified: boolean // Was this a "1" that was changed?
}

export interface Player {
  id: string
  name: string
  color: PlayerColor
  goatPositions: Record<MountainId, number> // Position on each mountain (0 = base, pathLength = summit)
  collectedTokens: Record<MountainId, number[]> // Tokens collected from each mountain
  bonusTokens: number[] // Bonus token values collected
}

export interface GameState {
  players: Player[]
  currentPlayerIndex: number
  mountains: Record<MountainId, Mountain>
  bonusTokenPile: number[] // [15, 12, 9, 6] initially
  currentDice: Die[]
  phase: GamePhase
  turnCount: number
  lastRoundStarted: boolean // True when end condition triggered
  startingPlayerIndex: number // Who started the game
}

// Constants
export const MOUNTAIN_IDS: MountainId[] = [5, 6, 7, 8, 9, 10]

export const MOUNTAIN_PATH_LENGTHS: Record<MountainId, number> = {
  5: 4,
  6: 5,
  7: 6,
  8: 5,
  9: 4,
  10: 3,
}

// Token counts per mountain (base for 4 players)
export const BASE_TOKEN_COUNTS: Record<MountainId, number> = {
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
}

export const BONUS_TOKENS = [15, 12, 9, 6]

export const PLAYER_COLORS: PlayerColor[] = ['red', 'blue', 'green', 'yellow']
