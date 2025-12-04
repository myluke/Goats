<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/game'
import { MOUNTAIN_IDS, MOUNTAIN_PATH_LENGTHS } from '@/types/game'
import type { MountainId, PlayerColor } from '@/types/game'

const gameStore = useGameStore()

const emit = defineEmits<{
  endGame: []
}>()

const state = computed(() => gameStore.state)
const currentPlayer = computed(() => gameStore.currentPlayer)
const phase = computed(() => gameStore.phase)

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
  // Return positions from summit (pathLength) down to base (0)
  return Array.from({ length: pathLength + 1 }, (_, i) => pathLength - i)
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
          <div class="text-sm text-gray-600">
            回合 {{ state.turnCount + 1 }}
          </div>
          <div
            v-if="currentPlayer"
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

    <!-- Game Area -->
    <main class="flex-1 container mx-auto px-4 py-4 flex flex-col gap-4">
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
            <div class="text-xs text-gray-500">
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
                <!-- Goats at this position -->
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
              'flex items-center gap-2 px-3 py-2 rounded-lg',
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
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Dice Area (placeholder) -->
      <div class="bg-white rounded-xl shadow-lg p-4">
        <div class="text-center">
          <div class="text-gray-500 mb-4">骰子区域</div>
          <div class="flex justify-center gap-3 mb-4">
            <div
              v-for="die in state.currentDice"
              :key="die.id"
              class="w-12 h-12 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center text-2xl font-bold shadow"
            >
              {{ die.value || '?' }}
            </div>
          </div>
          <div class="text-sm text-gray-500">
            当前阶段: {{ phase === 'rolling' ? '掷骰' : phase === 'grouping' ? '分组' : phase === 'moving' ? '移动' : phase }}
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
