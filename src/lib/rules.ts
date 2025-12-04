// Mountain Goats - Core Game Rules Engine

import type {
  GameState,
  Die,
  MountainId,
  Player,
} from '@/types/game'

import { cloneGameState, hasTokenFromEachMountain } from './gameState'

/**
 * Roll 4 dice, returning random values 1-6
 */
export function rollDice(): number[] {
  return Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1)
}

/**
 * Create Die objects from roll values
 */
export function createDiceFromRoll(values: number[]): Die[] {
  return values.map((value, id) => ({
    id,
    value,
    groupIndex: null,
    isModified: false,
  }))
}

/**
 * Check if a sum is a valid mountain number (5-10)
 */
export function isValidMountainSum(sum: number): sum is MountainId {
  return sum >= 5 && sum <= 10
}

/**
 * Validate that a grouping assignment is valid
 * Each die must be assigned to exactly one group
 */
export function validateGroups(dice: Die[], groups: number[][]): boolean {
  // Flatten all groups to get all assigned die indices
  const assignedDice = groups.flat()

  // Check each die is assigned exactly once
  if (assignedDice.length !== dice.length) {
    return false
  }

  // Check for duplicates
  const uniqueDice = new Set(assignedDice)
  if (uniqueDice.size !== assignedDice.length) {
    return false
  }

  // Check all indices are valid
  for (const dieIndex of assignedDice) {
    if (dieIndex < 0 || dieIndex >= dice.length) {
      return false
    }
  }

  return true
}

/**
 * Calculate the sum of a group of dice
 */
export function calculateGroupSum(dice: Die[], groupIndices: number[]): number {
  return groupIndices.reduce((sum, idx) => {
    const die = dice[idx]
    return sum + (die ? die.value : 0)
  }, 0)
}

/**
 * Get all valid moves from a grouping
 * Returns array of mountain IDs that will have goat movement
 */
export function getValidMovesFromGroups(dice: Die[], groups: number[][]): MountainId[] {
  const moves: MountainId[] = []

  for (const group of groups) {
    const sum = calculateGroupSum(dice, group)
    if (isValidMountainSum(sum)) {
      moves.push(sum)
    }
  }

  return moves
}

/**
 * Move a goat up one step on a mountain
 * Returns updated state with:
 * - Goat position updated
 * - Token collected if at summit
 * - Opponent knocked off if applicable
 */
export function moveGoat(
  state: GameState,
  playerId: string,
  mountainId: MountainId
): GameState {
  const newState = cloneGameState(state)
  const mountain = newState.mountains[mountainId]
  const playerIndex = newState.players.findIndex((p) => p.id === playerId)

  if (playerIndex === -1) {
    throw new Error(`Player ${playerId} not found`)
  }

  const player = newState.players[playerIndex]!
  const currentPosition = player.goatPositions[mountainId]
  const summit = mountain.pathLength

  // If already at summit, just collect a token (if available)
  if (currentPosition === summit) {
    if (mountain.tokenPile.length > 0) {
      const token = mountain.tokenPile.pop()!
      player.collectedTokens[mountainId].push(token)
    }
    return newState
  }

  // Move goat up one step
  const newPosition = currentPosition + 1
  player.goatPositions[mountainId] = newPosition

  // If reaching summit
  if (newPosition === summit) {
    // Check if another player is at summit - knock them off
    for (let i = 0; i < newState.players.length; i++) {
      if (i !== playerIndex) {
        const otherPlayer = newState.players[i]!
        if (otherPlayer.goatPositions[mountainId] === summit) {
          // Knock them back to base
          otherPlayer.goatPositions[mountainId] = 0
        }
      }
    }

    // Collect a token
    if (mountain.tokenPile.length > 0) {
      const token = mountain.tokenPile.pop()!
      player.collectedTokens[mountainId].push(token)
    }
  }

  return newState
}

/**
 * Check if player qualifies for a bonus token and award it
 * Player must have at least one token from each mountain (5-10)
 */
export function checkAndAwardBonusToken(state: GameState, playerId: string): GameState {
  const newState = cloneGameState(state)
  const playerIndex = newState.players.findIndex((p) => p.id === playerId)

  if (playerIndex === -1) {
    return newState
  }

  const player = newState.players[playerIndex]!

  // Check if player has a token from each mountain
  if (!hasTokenFromEachMountain(player)) {
    return newState
  }

  // Check if there are bonus tokens available
  if (newState.bonusTokenPile.length === 0) {
    return newState
  }

  // Award the highest available bonus token
  const bonusToken = newState.bonusTokenPile.shift()!
  player.bonusTokens.push(bonusToken)

  return newState
}

/**
 * Count how many 1s are in the dice roll
 */
export function countOnes(dice: Die[]): number {
  return dice.filter((d) => d.value === 1).length
}

/**
 * Apply modifications to extra 1s
 * The first 1 stays as-is, extra 1s can be changed to any value
 */
export function applyOneModifications(
  dice: Die[],
  modifications: Map<number, number>
): Die[] {
  return dice.map((die) => {
    if (modifications.has(die.id)) {
      return {
        ...die,
        value: modifications.get(die.id)!,
        isModified: true,
      }
    }
    return die
  })
}

/**
 * Find the indices of extra 1s that can be modified
 * Returns indices of all 1s except the first one
 */
export function findModifiableOnes(dice: Die[]): number[] {
  const oneIndices = dice
    .map((d, idx) => (d.value === 1 ? idx : -1))
    .filter((idx) => idx !== -1)

  // Keep first 1, return rest as modifiable
  return oneIndices.slice(1)
}

/**
 * Generate all possible groupings of 4 dice
 * Returns array of grouping options, each grouping is an array of groups
 */
export function generateAllGroupings(): number[][][] {
  const result: number[][][] = []
  const indices = [0, 1, 2, 3]

  // Generate all partitions using Bell number enumeration
  function* partitions(arr: number[]): Generator<number[][]> {
    if (arr.length === 0) {
      yield []
      return
    }
    if (arr.length === 1) {
      yield [[arr[0] as number]]
      return
    }

    const first = arr[0] as number
    const rest = arr.slice(1)

    for (const p of partitions(rest)) {
      // Option 1: first element forms its own group
      yield [[first], ...p]

      // Option 2: first element joins each existing group
      for (let i = 0; i < p.length; i++) {
        const newP = p.map((g, idx) => (idx === i ? [first, ...g] : g))
        yield newP
      }
    }
  }

  for (const p of partitions(indices)) {
    result.push(p)
  }

  return result
}

/**
 * Get all valid groupings that result in at least one valid mountain move
 */
export function getValidGroupings(dice: Die[]): { groups: number[][]; moves: MountainId[] }[] {
  const allGroupings = generateAllGroupings()
  const validGroupings: { groups: number[][]; moves: MountainId[] }[] = []

  for (const groups of allGroupings) {
    const moves = getValidMovesFromGroups(dice, groups)
    if (moves.length > 0) {
      validGroupings.push({ groups, moves })
    }
  }

  return validGroupings
}

/**
 * Check if moving on a specific mountain will knock off an opponent
 */
export function willKnockOff(
  state: GameState,
  playerId: string,
  mountainId: MountainId
): Player | null {
  const mountain = state.mountains[mountainId]
  const player = state.players.find((p) => p.id === playerId)

  if (!player) {
    return null
  }

  const currentPosition = player.goatPositions[mountainId]
  const summit = mountain.pathLength

  // Not at summit-1, won't reach summit this move
  if (currentPosition !== summit - 1) {
    return null
  }

  // Check if anyone else is at summit
  for (const otherPlayer of state.players) {
    if (otherPlayer.id !== playerId) {
      if (otherPlayer.goatPositions[mountainId] === summit) {
        return otherPlayer
      }
    }
  }

  return null
}

/**
 * Check if moving on a specific mountain will collect a token
 */
export function willCollectToken(
  state: GameState,
  playerId: string,
  mountainId: MountainId
): boolean {
  const mountain = state.mountains[mountainId]
  const player = state.players.find((p) => p.id === playerId)

  if (!player || mountain.tokenPile.length === 0) {
    return false
  }

  const currentPosition = player.goatPositions[mountainId]
  const summit = mountain.pathLength

  // Will collect if reaching summit or already at summit
  return currentPosition >= summit - 1
}
