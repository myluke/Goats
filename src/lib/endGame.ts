// Mountain Goats - End Game Logic

import type {
  GameState,
  Player,
  MountainId,
} from '@/types/game'

import { MOUNTAIN_IDS } from '@/types/game'
import {
  cloneGameState,
  calculatePlayerScore,
  countGoatsAtSummit,
  getHighestSummitMountain,
} from './gameState'

/**
 * Check if the end game condition has been triggered
 * End game triggers when:
 * 1. All bonus tokens are taken, OR
 * 2. 3 or more mountains have empty token piles
 */
export function checkEndCondition(state: GameState): boolean {
  // Check if all bonus tokens are taken
  if (state.bonusTokenPile.length === 0) {
    return true
  }

  // Count mountains with empty token piles
  let emptyMountains = 0
  for (const mountainId of MOUNTAIN_IDS) {
    if (state.mountains[mountainId].tokenPile.length === 0) {
      emptyMountains++
    }
  }

  return emptyMountains >= 3
}

/**
 * Mark the game as in its last round
 * Called when end condition is first detected
 */
export function startLastRound(state: GameState): GameState {
  const newState = cloneGameState(state)
  newState.lastRoundStarted = true
  return newState
}

/**
 * Check if the game should end (all players have had equal turns)
 * Game ends when we've returned to the starting player after triggering end condition
 */
export function shouldGameEnd(state: GameState): boolean {
  if (!state.lastRoundStarted) {
    return false
  }

  // Game ends when it's the starting player's turn again after end condition
  return state.currentPlayerIndex === state.startingPlayerIndex
}

/**
 * End the game and mark it as finished
 */
export function endGame(state: GameState): GameState {
  const newState = cloneGameState(state)
  newState.phase = 'ended'
  return newState
}

/**
 * Player ranking with score breakdown
 */
export interface PlayerRanking {
  player: Player
  rank: number
  score: number
  mountainTokens: Record<MountainId, number[]>
  bonusTokens: number[]
  goatsAtSummit: number
  highestSummit: MountainId | null
  tiebreakerReason: string | null
}

/**
 * Game results with rankings and winner
 */
export interface GameResults {
  rankings: PlayerRanking[]
  winner: Player
  isTie: boolean
  tiebreakerApplied: boolean
  tiebreakerExplanation: string | null
}

/**
 * Calculate final game results with rankings
 */
export function getGameResults(state: GameState): GameResults {
  if (state.phase !== 'ended') {
    throw new Error('Cannot get results for a game that has not ended')
  }

  // Calculate scores for all players
  const playerData = state.players.map((player) => ({
    player,
    score: calculatePlayerScore(player),
    goatsAtSummit: countGoatsAtSummit(player, state.mountains),
    highestSummit: getHighestSummitMountain(player, state.mountains),
    mountainTokens: player.collectedTokens,
    bonusTokens: player.bonusTokens,
  }))

  // Sort by score (descending)
  playerData.sort((a, b) => b.score - a.score)

  // Check for ties and apply tiebreakers
  let tiebreakerApplied = false
  let tiebreakerExplanation: string | null = null

  // Apply tiebreakers for equal scores
  for (let i = 0; i < playerData.length - 1; i++) {
    const current = playerData[i]!
    const next = playerData[i + 1]!

    if (current.score === next.score) {
      // First tiebreaker: more goats at summit
      if (current.goatsAtSummit !== next.goatsAtSummit) {
        tiebreakerApplied = true
        if (current.goatsAtSummit < next.goatsAtSummit) {
          // Swap positions
          [playerData[i], playerData[i + 1]] = [next, current]
          tiebreakerExplanation = `${next.player.name} wins tiebreaker with ${next.goatsAtSummit} goats at summit vs ${current.goatsAtSummit}`
        } else {
          tiebreakerExplanation = `${current.player.name} wins tiebreaker with ${current.goatsAtSummit} goats at summit vs ${next.goatsAtSummit}`
        }
      } else {
        // Second tiebreaker: goat at highest numbered mountain
        const currentHigh = current.highestSummit ?? 0
        const nextHigh = next.highestSummit ?? 0

        if (currentHigh !== nextHigh) {
          tiebreakerApplied = true
          if (currentHigh < nextHigh) {
            // Swap positions
            [playerData[i], playerData[i + 1]] = [next, current]
            tiebreakerExplanation = `${next.player.name} wins tiebreaker with goat on mountain ${nextHigh} vs mountain ${currentHigh}`
          } else {
            tiebreakerExplanation = `${current.player.name} wins tiebreaker with goat on mountain ${currentHigh} vs mountain ${nextHigh}`
          }
        }
      }
    }
  }

  // Assign ranks
  const rankings: PlayerRanking[] = []
  let currentRank = 1
  let previousScore = -1

  for (let i = 0; i < playerData.length; i++) {
    const data = playerData[i]!

    // If score is different from previous, update rank
    if (data.score !== previousScore) {
      currentRank = i + 1
    }

    rankings.push({
      player: data.player,
      rank: currentRank,
      score: data.score,
      mountainTokens: data.mountainTokens,
      bonusTokens: data.bonusTokens,
      goatsAtSummit: data.goatsAtSummit,
      highestSummit: data.highestSummit,
      tiebreakerReason:
        i === 0 && tiebreakerApplied ? tiebreakerExplanation : null,
    })

    previousScore = data.score
  }

  const winner = rankings[0]!.player
  const isTie =
    rankings.length > 1 && rankings[0]!.score === rankings[1]!.score && !tiebreakerApplied

  return {
    rankings,
    winner,
    isTie,
    tiebreakerApplied,
    tiebreakerExplanation,
  }
}

/**
 * Get remaining turns until game ends (for UI display)
 */
export function getRemainingTurns(state: GameState): number | null {
  if (!state.lastRoundStarted) {
    return null
  }

  // Calculate how many players still need to take their turn
  if (state.currentPlayerIndex >= state.startingPlayerIndex) {
    return state.players.length - state.currentPlayerIndex + state.startingPlayerIndex
  } else {
    return state.startingPlayerIndex - state.currentPlayerIndex
  }
}

/**
 * Get the reason why the game is ending
 */
export function getEndGameReason(state: GameState): string | null {
  if (!state.lastRoundStarted) {
    return null
  }

  if (state.bonusTokenPile.length === 0) {
    return '所有奖励筹码已被领取'
  }

  const emptyMountains = MOUNTAIN_IDS.filter(
    (id) => state.mountains[id].tokenPile.length === 0
  )

  if (emptyMountains.length >= 3) {
    return `${emptyMountains.length}座山的筹码已耗尽: ${emptyMountains.join(', ')}号山`
  }

  return null
}
