<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useGameStore, type PlayerSetup } from '@/stores/game'
import SetupScreen from '@/components/SetupScreen.vue'
import GameBoard from '@/components/GameBoard.vue'

const gameStore = useGameStore()

const isPlaying = computed(() => gameStore.state !== null)
const showContinuePrompt = ref(false)
const savedGameInfo = ref<{ playerCount: number; turnCount: number; savedAt: string } | null>(null)

onMounted(() => {
  // Check for saved game on mount
  const info = gameStore.getSavedGameInfo()
  if (info) {
    savedGameInfo.value = info
    showContinuePrompt.value = true
  }
})

function handleStartGame(players: PlayerSetup[]) {
  gameStore.clearSavedGame()
  gameStore.initGame(players)
}

function handleEndGame() {
  gameStore.resetGame()
}

function handleContinueGame() {
  gameStore.restoreSavedGame()
  showContinuePrompt.value = false
}

function handleNewGame() {
  gameStore.clearSavedGame()
  showContinuePrompt.value = false
}

function formatSavedDate(isoString: string): string {
  try {
    const date = new Date(isoString)
    return date.toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return isoString
  }
}
</script>

<template>
  <!-- Continue Prompt Modal -->
  <div
    v-if="showContinuePrompt && savedGameInfo"
    class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
  >
    <div class="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full">
      <div class="text-center mb-6">
        <div class="text-4xl mb-3">🐐</div>
        <h2 class="text-xl font-bold text-gray-800 mb-2">发现未完成的游戏</h2>
        <div class="text-sm text-gray-500">
          <div>{{ savedGameInfo.playerCount }} 位玩家 · 第 {{ savedGameInfo.turnCount + 1 }} 回合</div>
          <div>保存于 {{ formatSavedDate(savedGameInfo.savedAt) }}</div>
        </div>
      </div>

      <div class="space-y-3">
        <button
          class="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          @click="handleContinueGame"
        >
          继续游戏
        </button>
        <button
          class="w-full py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          @click="handleNewGame"
        >
          开始新游戏
        </button>
      </div>
    </div>
  </div>

  <SetupScreen v-if="!isPlaying" @start-game="handleStartGame" />
  <GameBoard v-else @end-game="handleEndGame" />
</template>
