import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { GameState, Player, GamePhase, PlayerColor, MountainId } from '@/types/game'
import {
  createPlayer,
  createInitialGameState,
  calculatePlayerScore,
} from '@/lib/gameState'
import {
  executeRoll,
  executeModifyOnes,
  executeGroups,
  executeEndTurn,
  getTurnState,
} from '@/lib/turnFlow'
import {
  checkEndCondition,
  startLastRound,
  shouldGameEnd,
  endGame,
  getGameResults,
  type GameResults,
} from '@/lib/endGame'

export interface PlayerSetup {
  name: string
  color: PlayerColor
}

export const useGameStore = defineStore('game', () => {
  const state = ref<GameState | null>(null)
  const lastTurnResult = ref<{
    moves: Array<{
      mountainId: MountainId
      tokenCollected: number | null
      knockedOff: string | null
    }>
    bonusAwarded: number | null
  } | null>(null)
  const gameResults = ref<GameResults | null>(null)

  const currentPlayer = computed<Player | null>(() => {
    if (!state.value) return null
    return state.value.players[state.value.currentPlayerIndex] ?? null
  })

  const phase = computed<GamePhase>(() => {
    return state.value?.phase ?? 'setup'
  })

  const isGameOver = computed(() => {
    return state.value?.phase === 'ended'
  })

  const playerScores = computed(() => {
    if (!state.value) return []
    return state.value.players.map((player) => ({
      player,
      score: calculatePlayerScore(player),
    }))
  })

  const turnState = computed(() => {
    if (!state.value) return null
    return getTurnState(state.value)
  })

  function initGame(playerSetups: PlayerSetup[]) {
    const players = playerSetups.map((setup, index) =>
      createPlayer(`player-${index}`, setup.name, setup.color)
    )
    state.value = createInitialGameState(players)
    lastTurnResult.value = null
    gameResults.value = null
  }

  function rollDice() {
    if (!state.value || state.value.phase !== 'rolling') return
    state.value = executeRoll(state.value)
  }

  function modifyOnes(modifications: Map<number, number>) {
    if (!state.value) return
    state.value = executeModifyOnes(state.value, modifications)
  }

  function confirmGroups(groups: number[][]) {
    if (!state.value || state.value.phase !== 'grouping') return

    const result = executeGroups(state.value, groups)
    state.value = result.state
    lastTurnResult.value = {
      moves: result.moves,
      bonusAwarded: result.bonusAwarded,
    }

    // Check for end game condition
    if (!state.value.lastRoundStarted && checkEndCondition(state.value)) {
      state.value = startLastRound(state.value)
    }
  }

  function nextTurn() {
    if (!state.value) return

    // Check if game should end
    if (state.value.lastRoundStarted && shouldGameEnd(state.value)) {
      state.value = endGame(state.value)
      gameResults.value = getGameResults(state.value)
      return
    }

    state.value = executeEndTurn(state.value)
    lastTurnResult.value = null
  }

  function resetGame() {
    state.value = null
    lastTurnResult.value = null
    gameResults.value = null
  }

  return {
    state,
    currentPlayer,
    phase,
    isGameOver,
    playerScores,
    turnState,
    lastTurnResult,
    gameResults,
    initGame,
    rollDice,
    modifyOnes,
    confirmGroups,
    nextTurn,
    resetGame,
  }
})
