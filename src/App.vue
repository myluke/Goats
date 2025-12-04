<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore, type PlayerSetup } from '@/stores/game'
import SetupScreen from '@/components/SetupScreen.vue'
import GameBoard from '@/components/GameBoard.vue'

const gameStore = useGameStore()

const isPlaying = computed(() => gameStore.state !== null)

function handleStartGame(players: PlayerSetup[]) {
  gameStore.initGame(players)
}

function handleEndGame() {
  gameStore.resetGame()
}
</script>

<template>
  <SetupScreen v-if="!isPlaying" @start-game="handleStartGame" />
  <GameBoard v-else @end-game="handleEndGame" />
</template>
