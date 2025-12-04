import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { GameState, Player, GamePhase } from '@/types/game'

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

  function initGame(_players: Player[]) {
    // Will be implemented in core.game-state feature
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

  return {
    state,
    currentPlayer,
    phase,
    isGameOver,
    initGame,
    rollDice,
    confirmGroups,
    nextTurn,
  }
})
