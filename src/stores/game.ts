import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { GameState, Player, GamePhase, PlayerColor } from '@/types/game'
import {
  createPlayer,
  createInitialGameState,
  calculatePlayerScore,
} from '@/lib/gameState'

export interface PlayerSetup {
  name: string
  color: PlayerColor
}

export const useGameStore = defineStore('game', () => {
  const state = ref<GameState | null>(null)

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

  function initGame(playerSetups: PlayerSetup[]) {
    const players = playerSetups.map((setup, index) =>
      createPlayer(`player-${index}`, setup.name, setup.color)
    )
    state.value = createInitialGameState(players)
  }

  function rollDice() {
    // Will be implemented in core.turn-flow feature
  }

  function confirmGroups(_groups: number[][]) {
    // Will be implemented in core.turn-flow feature
  }

  function nextTurn() {
    // Will be implemented in core.turn-flow feature
  }

  function resetGame() {
    state.value = null
  }

  return {
    state,
    currentPlayer,
    phase,
    isGameOver,
    playerScores,
    initGame,
    rollDice,
    confirmGroups,
    nextTurn,
    resetGame,
  }
})
