<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import type { PlayerColor } from '@/types/game'
import { PLAYER_COLORS } from '@/types/game'
import TutorialOverlay from './TutorialOverlay.vue'

const { t } = useI18n()

const emit = defineEmits<{
  startGame: [players: { name: string; color: PlayerColor }[]]
}>()

const TUTORIAL_COMPLETED_KEY = 'mountain-goats-tutorial-completed'

// Tutorial state
const showTutorial = ref(false)
const isFirstVisit = ref(false)

onMounted(() => {
  // Check if first time visitor
  const tutorialCompleted = localStorage.getItem(TUTORIAL_COMPLETED_KEY)
  if (!tutorialCompleted) {
    isFirstVisit.value = true
    // Auto-show tutorial for first-time visitors
    showTutorial.value = true
  }
})

function handleTutorialComplete() {
  localStorage.setItem(TUTORIAL_COMPLETED_KEY, 'true')
  showTutorial.value = false
  isFirstVisit.value = false
}

function handleTutorialSkip() {
  localStorage.setItem(TUTORIAL_COMPLETED_KEY, 'true')
  showTutorial.value = false
  isFirstVisit.value = false
}

function openTutorial() {
  showTutorial.value = true
}

const playerCount = ref(2)
const players = ref<{ name: string; color: PlayerColor }[]>([
  { name: '', color: 'red' },
  { name: '', color: 'blue' },
  { name: '', color: 'green' },
  { name: '', color: 'yellow' },
])

const activePlayers = computed(() => players.value.slice(0, playerCount.value))

const colorLabels = computed(() => ({
  red: t('setup.colors.red'),
  blue: t('setup.colors.blue'),
  green: t('setup.colors.green'),
  yellow: t('setup.colors.yellow'),
}))

const colorClasses: Record<PlayerColor, string> = {
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
}

const availableColors = computed(() => {
  return (index: number) => {
    const usedColors = players.value
      .slice(0, playerCount.value)
      .filter((_, i) => i !== index)
      .map((p) => p.color)
    return PLAYER_COLORS.filter((c) => !usedColors.includes(c))
  }
})

const isValid = computed(() => {
  const active = activePlayers.value
  // Check all names are non-empty
  if (active.some((p) => !p.name.trim())) return false
  // Check all colors are unique
  const colors = active.map((p) => p.color)
  return new Set(colors).size === colors.length
})

function handlePlayerCountChange(count: number) {
  playerCount.value = count
}

function handleStartGame() {
  if (isValid.value) {
    emit('startGame', activePlayers.value)
  }
}
</script>

<template>
  <!-- Tutorial Overlay -->
  <TutorialOverlay
    :show="showTutorial"
    @complete="handleTutorialComplete"
    @skip="handleTutorialSkip"
  />

  <div class="min-h-screen bg-gradient-to-b from-sky-100 to-green-100 flex flex-col">
    <!-- Header -->
    <header class="bg-white/80 backdrop-blur-sm shadow-sm py-4">
      <div class="container mx-auto px-4 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
          🐐 Mountain Goats
        </h1>
        <button
          class="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-1"
          @click="openTutorial"
        >
          📖 {{ t('setup.learnGame') }}
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 container mx-auto px-4 py-8">
      <div class="max-w-lg mx-auto">
        <!-- Title Card -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-lg mb-4">
            <span class="text-4xl">🏔️</span>
          </div>
          <h2 class="text-2xl font-bold text-gray-800 mb-2">{{ t('setup.title') }}</h2>
          <p class="text-gray-600">{{ t('setup.subtitle') }}</p>
        </div>

        <!-- Setup Card -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <!-- Player Count Selection -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ t('setup.playerCount') }}
            </label>
            <div class="flex gap-2">
              <button
                v-for="count in [2, 3, 4]"
                :key="count"
                :class="[
                  'flex-1 py-3 px-4 rounded-lg font-medium transition-all',
                  playerCount === count
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]"
                @click="handlePlayerCountChange(count)"
              >
                {{ count }} {{ t('setup.playerCountUnit') }}
              </button>
            </div>
          </div>

          <!-- Player Settings -->
          <div class="space-y-4">
            <div
              v-for="(player, index) in activePlayers"
              :key="index"
              class="flex gap-3 items-center p-3 rounded-lg bg-gray-50"
            >
              <!-- Color Indicator -->
              <div
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm',
                  colorClasses[player.color]
                ]"
              >
                {{ index + 1 }}
              </div>

              <!-- Name Input -->
              <input
                v-model="player.name"
                type="text"
                :placeholder="t('setup.playerPlaceholder', { index: index + 1 })"
                class="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              />

              <!-- Color Select -->
              <select
                v-model="player.color"
                class="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              >
                <option
                  v-for="color in availableColors(index)"
                  :key="color"
                  :value="color"
                >
                  {{ colorLabels[color] }}
                </option>
                <!-- Keep current color as option even if "used" (for display) -->
                <option
                  v-if="!availableColors(index).includes(player.color)"
                  :value="player.color"
                >
                  {{ colorLabels[player.color] }}
                </option>
              </select>
            </div>
          </div>

          <!-- Start Button -->
          <button
            :disabled="!isValid"
            :class="[
              'w-full mt-6 py-3 px-6 rounded-lg font-medium transition-all',
              isValid
                ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            ]"
            @click="handleStartGame"
          >
            {{ t('setup.startGame') }} 🎲
          </button>
        </div>

        <!-- Rules Preview -->
        <div class="mt-6 text-center text-sm text-gray-500">
          <p>{{ t('setup.rulesHint') }}</p>
          <button
            class="mt-2 text-blue-600 hover:text-blue-700 underline"
            @click="openTutorial"
          >
            {{ t('setup.firstTimeHint') }}
          </button>
        </div>
      </div>
    </main>
  </div>
</template>
