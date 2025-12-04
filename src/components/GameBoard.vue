<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/game'
import { MOUNTAIN_IDS, MOUNTAIN_PATH_LENGTHS } from '@/types/game'
import type { MountainId, PlayerColor } from '@/types/game'
import DiceArea from './DiceArea.vue'

const gameStore = useGameStore()

const emit = defineEmits<{
  endGame: []
}>()

const state = computed(() => gameStore.state)
const currentPlayer = computed(() => gameStore.currentPlayer)
const phase = computed(() => gameStore.phase)
const turnState = computed(() => gameStore.turnState)
const lastTurnResult = computed(() => gameStore.lastTurnResult)
const isGameOver = computed(() => gameStore.isGameOver)
const gameResults = computed(() => gameStore.gameResults)

const mountainColors: Record<MountainId, string> = {
  5: 'from-amber-700 to-amber-500',
  6: 'from-orange-700 to-orange-500',
  7: 'from-lime-700 to-lime-500',
  8: 'from-emerald-700 to-emerald-500',
  9: 'from-sky-700 to-sky-500',
  10: 'from-violet-700 to-violet-500',
}

const playerColorClasses: Record<PlayerColor, string> = {
  red: 'bg-red-500 border-red-600',
  blue: 'bg-blue-500 border-blue-600',
  green: 'bg-green-500 border-green-600',
  yellow: 'bg-yellow-500 border-yellow-600',
}

function getGoatsAtPosition(mountainId: MountainId, position: number) {
  if (!state.value) return []
  return state.value.players.filter(
    (p) => p.goatPositions[mountainId] === position
  )
}

function getMountainSteps(mountainId: MountainId) {
  const pathLength = MOUNTAIN_PATH_LENGTHS[mountainId]
  return Array.from({ length: pathLength + 1 }, (_, i) => pathLength - i)
}

function handleRoll() {
  gameStore.rollDice()
}

function handleModifyOnes(modifications: Map<number, number>) {
  gameStore.modifyOnes(modifications)
}

function handleConfirmGroups(groups: number[][]) {
  gameStore.confirmGroups(groups)
}

function handleNextTurn() {
  gameStore.nextTurn()
}

function handleNewGame() {
  gameStore.resetGame()
}
</script>

<template>
  <div v-if="state" class="min-h-screen bg-gradient-to-b from-sky-100 to-green-100 flex flex-col">
    <!-- Header -->
    <header class="bg-white/80 backdrop-blur-sm shadow-sm py-3">
      <div class="container mx-auto px-4 flex items-center justify-between">
        <h1 class="text-xl font-bold text-gray-800 flex items-center gap-2">
          🐐 Mountain Goats
        </h1>
        <div class="flex items-center gap-4">
          <div v-if="state.lastRoundStarted" class="text-sm text-red-600 font-medium">
            最后一轮!
          </div>
          <div class="text-sm text-gray-600">
            回合 {{ state.turnCount + 1 }}
          </div>
          <div
            v-if="currentPlayer && !isGameOver"
            class="flex items-center gap-2"
          >
            <div
              :class="[
                'w-6 h-6 rounded-full',
                playerColorClasses[currentPlayer.color]
              ]"
            />
            <span class="font-medium">{{ currentPlayer.name }} 的回合</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Game Over Screen -->
    <div v-if="isGameOver && gameResults" class="flex-1 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
        <div class="text-5xl mb-4">🏆</div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">游戏结束!</h2>
        <div class="text-xl text-green-600 font-bold mb-6">
          {{ gameResults.winner.name }} 获胜!
        </div>

        <!-- Rankings -->
        <div class="space-y-2 mb-6">
          <div
            v-for="ranking in gameResults.rankings"
            :key="ranking.player.id"
            :class="[
              'flex items-center justify-between p-3 rounded-lg',
              ranking.rank === 1 ? 'bg-yellow-100' : 'bg-gray-50'
            ]"
          >
            <div class="flex items-center gap-2">
              <span class="font-bold text-lg">{{ ranking.rank }}.</span>
              <div
                :class="[
                  'w-6 h-6 rounded-full',
                  playerColorClasses[ranking.player.color]
                ]"
              />
              <span>{{ ranking.player.name }}</span>
            </div>
            <span class="font-bold text-lg">{{ ranking.score }} 分</span>
          </div>
        </div>

        <div v-if="gameResults.tiebreakerApplied" class="text-sm text-gray-600 mb-4">
          {{ gameResults.tiebreakerExplanation }}
        </div>

        <button
          class="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          @click="handleNewGame"
        >
          再来一局
        </button>
      </div>
    </div>

    <!-- Game Area -->
    <main v-else class="flex-1 container mx-auto px-4 py-4 flex flex-col gap-4">
      <!-- Turn Result Notification -->
      <div v-if="lastTurnResult && lastTurnResult.moves.length > 0" class="bg-blue-50 rounded-lg p-3 text-center">
        <div class="text-sm text-blue-800">
          <span v-for="(move, index) in lastTurnResult.moves" :key="index">
            {{ index > 0 ? ', ' : '' }}
            {{ move.mountainId }}号山
            <span v-if="move.tokenCollected"> (+{{ move.tokenCollected }}分)</span>
            <span v-if="move.knockedOff" class="text-red-600"> 挤下了{{ move.knockedOff }}</span>
          </span>
        </div>
        <div v-if="lastTurnResult.bonusAwarded" class="text-green-600 font-bold mt-1">
          获得奖励筹码: +{{ lastTurnResult.bonusAwarded }} 分!
        </div>
      </div>

      <!-- Mountains -->
      <div class="flex-1 flex items-end justify-center gap-2 overflow-x-auto pb-4">
        <div
          v-for="mountainId in MOUNTAIN_IDS"
          :key="mountainId"
          class="flex flex-col items-center"
        >
          <!-- Mountain Number & Token Count -->
          <div class="text-center mb-2">
            <div class="text-2xl font-bold text-gray-800">{{ mountainId }}</div>
            <div
              :class="[
                'text-xs',
                state.mountains[mountainId].tokenPile.length === 0 ? 'text-red-500 font-bold' : 'text-gray-500'
              ]"
            >
              剩余 {{ state.mountains[mountainId].tokenPile.length }} 枚
            </div>
          </div>

          <!-- Mountain Path -->
          <div
            :class="[
              'rounded-t-3xl bg-gradient-to-t p-2 w-20',
              mountainColors[mountainId]
            ]"
          >
            <div class="flex flex-col gap-1">
              <div
                v-for="position in getMountainSteps(mountainId)"
                :key="position"
                :class="[
                  'h-8 rounded flex items-center justify-center gap-1',
                  position === MOUNTAIN_PATH_LENGTHS[mountainId]
                    ? 'bg-yellow-300/50 border-2 border-yellow-400'
                    : 'bg-white/20'
                ]"
              >
                <div
                  v-for="player in getGoatsAtPosition(mountainId, position)"
                  :key="player.id"
                  :class="[
                    'w-5 h-5 rounded-full border-2 text-xs flex items-center justify-center text-white font-bold',
                    playerColorClasses[player.color]
                  ]"
                  :title="player.name"
                >
                  🐐
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Player Panel -->
      <div class="bg-white/80 rounded-lg p-3">
        <div class="flex gap-4 justify-center flex-wrap">
          <div
            v-for="player in state.players"
            :key="player.id"
            :class="[
              'flex items-center gap-2 px-3 py-2 rounded-lg transition-all',
              player.id === currentPlayer?.id ? 'bg-gray-100 ring-2 ring-green-500' : ''
            ]"
          >
            <div
              :class="[
                'w-8 h-8 rounded-full flex items-center justify-center text-white font-bold border-2',
                playerColorClasses[player.color]
              ]"
            >
              {{ player.name.charAt(0) }}
            </div>
            <div>
              <div class="font-medium text-sm">{{ player.name }}</div>
              <div class="text-xs text-gray-500">
                {{ gameStore.playerScores.find(s => s.player.id === player.id)?.score ?? 0 }} 分
                <span v-if="player.bonusTokens.length > 0" class="text-green-600">
                  (+{{ player.bonusTokens.reduce((a, b) => a + b, 0) }})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Dice Area -->
      <DiceArea
        :dice="state.currentDice"
        :phase="phase"
        :can-roll="turnState?.canRoll ?? false"
        :can-group="turnState?.canGroup ?? false"
        @roll="handleRoll"
        @modify-ones="handleModifyOnes"
        @confirm-groups="handleConfirmGroups"
      />

      <!-- Next Turn Button -->
      <div v-if="phase === 'moving'" class="text-center">
        <button
          class="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-lg"
          @click="handleNextTurn"
        >
          结束回合 →
        </button>
      </div>
    </main>
  </div>
</template>
