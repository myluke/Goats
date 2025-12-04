// Mountain Goats - Turn Flow Logic

import type {
  GameState,
  Die,
  MountainId,
  GamePhase,
} from '@/types/game'

import { cloneGameState } from './gameState'
import {
  rollDice,
  createDiceFromRoll,
  moveGoat,
  checkAndAwardBonusToken,
  getValidMovesFromGroups,
  findModifiableOnes,
  applyOneModifications,
} from './rules'

/**
 * Actions that can be taken during the game
 */
export interface TurnAction {
  type: 'roll' | 'modifyOnes' | 'confirmGroups' | 'endTurn'
}

/**
 * Result of executing a turn with grouped dice
 */
export interface TurnResult {
  state: GameState
  moves: Array<{
    mountainId: MountainId
    tokenCollected: number | null
    knockedOff: string | null // Player name who was knocked off
  }>
  bonusAwarded: number | null
}

/**
 * Start the rolling phase - roll the dice
 */
export function executeRoll(state: GameState): GameState {
  if (state.phase !== 'rolling') {
    throw new Error('Can only roll during rolling phase')
  }

  const newState = cloneGameState(state)
  const values = rollDice()
  newState.currentDice = createDiceFromRoll(values)

  // Check if there are multiple 1s that need handling
  const modifiableOnes = findModifiableOnes(newState.currentDice)
  if (modifiableOnes.length > 0) {
    // Stay in rolling phase until 1s are modified
    // UI will show the modification interface
  }

  newState.phase = 'grouping'
  return newState
}

/**
 * Modify extra 1s to different values
 */
export function executeModifyOnes(
  state: GameState,
  modifications: Map<number, number>
): GameState {
  const newState = cloneGameState(state)
  newState.currentDice = applyOneModifications(state.currentDice, modifications)
  return newState
}

/**
 * Execute the grouped dice and move goats
 */
export function executeGroups(
  state: GameState,
  groups: number[][]
): TurnResult {
  if (state.phase !== 'grouping') {
    throw new Error('Can only execute groups during grouping phase')
  }

  let newState = cloneGameState(state)
  const currentPlayer = newState.players[newState.currentPlayerIndex]!
  const moves: TurnResult['moves'] = []

  // Get all valid mountain moves from this grouping
  const validMoves = getValidMovesFromGroups(newState.currentDice, groups)

  // Execute each move
  for (const mountainId of validMoves) {
    const mountain = newState.mountains[mountainId]
    const oldPosition = currentPlayer.goatPositions[mountainId]
    const summit = mountain.pathLength

    // Check who might be knocked off
    let knockedOff: string | null = null
    if (oldPosition === summit - 1) {
      for (const player of newState.players) {
        if (player.id !== currentPlayer.id) {
          if (player.goatPositions[mountainId] === summit) {
            knockedOff = player.name
            break
          }
        }
      }
    }

    // Execute the move
    const tokensBeforeMove = mountain.tokenPile.length
    newState = moveGoat(newState, currentPlayer.id, mountainId)

    // Check if a token was collected
    const tokensAfterMove = newState.mountains[mountainId].tokenPile.length
    const tokenCollected = tokensBeforeMove > tokensAfterMove ? mountainId : null

    moves.push({
      mountainId,
      tokenCollected,
      knockedOff,
    })
  }

  // Update dice with group assignments for display
  for (let groupIndex = 0; groupIndex < groups.length; groupIndex++) {
    const group = groups[groupIndex]
    if (group) {
      for (const dieIndex of group) {
        const die = newState.currentDice[dieIndex]
        if (die) {
          die.groupIndex = groupIndex
        }
      }
    }
  }

  // Check for bonus token
  const bonusTokensBefore = currentPlayer.bonusTokens.length
  newState = checkAndAwardBonusToken(newState, currentPlayer.id)
  const updatedPlayer = newState.players.find((p) => p.id === currentPlayer.id)!
  const bonusAwarded =
    updatedPlayer.bonusTokens.length > bonusTokensBefore
      ? updatedPlayer.bonusTokens[updatedPlayer.bonusTokens.length - 1]!
      : null

  newState.phase = 'moving' // Transition to moving phase for animations

  return {
    state: newState,
    moves,
    bonusAwarded,
  }
}

/**
 * End the current turn and advance to the next player
 */
export function executeEndTurn(state: GameState): GameState {
  const newState = cloneGameState(state)

  // Move to next player
  newState.currentPlayerIndex =
    (newState.currentPlayerIndex + 1) % newState.players.length

  // Increment turn count
  newState.turnCount++

  // Reset dice
  newState.currentDice = [
    { id: 0, value: 0, groupIndex: null, isModified: false },
    { id: 1, value: 0, groupIndex: null, isModified: false },
    { id: 2, value: 0, groupIndex: null, isModified: false },
    { id: 3, value: 0, groupIndex: null, isModified: false },
  ]

  // Set phase to rolling for next player
  newState.phase = 'rolling'

  return newState
}

/**
 * Get current turn state information
 */
export function getTurnState(state: GameState): {
  phase: GamePhase
  currentPlayerName: string
  canRoll: boolean
  canGroup: boolean
  canEndTurn: boolean
  hasModifiableOnes: boolean
  modifiableOnesIndices: number[]
} {
  const currentPlayer = state.players[state.currentPlayerIndex]!

  const modifiableOnesIndices = findModifiableOnes(state.currentDice)
  const hasModifiableOnes =
    state.phase === 'grouping' &&
    modifiableOnesIndices.length > 0 &&
    !state.currentDice.some((d) => d.isModified)

  return {
    phase: state.phase,
    currentPlayerName: currentPlayer.name,
    canRoll: state.phase === 'rolling',
    canGroup: state.phase === 'grouping' && !hasModifiableOnes,
    canEndTurn: state.phase === 'moving',
    hasModifiableOnes,
    modifiableOnesIndices,
  }
}

/**
 * Check if the dice have been rolled (have non-zero values)
 */
export function haveDiceBeenRolled(dice: Die[]): boolean {
  return dice.every((d) => d.value > 0)
}

/**
 * Assign a die to a specific group
 */
export function assignDieToGroup(
  dice: Die[],
  dieIndex: number,
  groupIndex: number | null
): Die[] {
  return dice.map((die, idx) =>
    idx === dieIndex ? { ...die, groupIndex } : die
  )
}

/**
 * Get the current grouping from dice assignments
 */
export function getGroupsFromDice(dice: Die[]): number[][] {
  const groups: Map<number, number[]> = new Map()

  for (let i = 0; i < dice.length; i++) {
    const die = dice[i]!
    if (die.groupIndex !== null) {
      if (!groups.has(die.groupIndex)) {
        groups.set(die.groupIndex, [])
      }
      groups.get(die.groupIndex)!.push(i)
    }
  }

  return Array.from(groups.values())
}

/**
 * Check if all dice are assigned to groups
 */
export function areAllDiceGrouped(dice: Die[]): boolean {
  return dice.every((d) => d.groupIndex !== null)
}
