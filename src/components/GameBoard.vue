<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import { useGameStore } from '@/stores/game'
import { MOUNTAIN_IDS, MOUNTAIN_PATH_LENGTHS } from '@/types/game'
import type { MountainId, PlayerColor, Player } from '@/types/game'
import DiceArea from './DiceArea.vue'
import RulesModal from './RulesModal.vue'

const gameStore = useGameStore()

const _emit = defineEmits<{
  endGame: []
}>()

const state = computed(() => gameStore.state)
const currentPlayer = computed(() => gameStore.currentPlayer)
const phase = computed(() => gameStore.phase)
const turnState = computed(() => gameStore.turnState)
const lastTurnResult = computed(() => gameStore.lastTurnResult)
const isGameOver = computed(() => gameStore.isGameOver)
const gameResults = computed(() => gameStore.gameResults)

// Animation state
const skipAnimations = ref(localStorage.getItem('skipAnimations') === 'true')
const isAnimating = ref(false)
const animatingGoats = ref<Map<string, { mountainId: MountainId; fromPos: number; toPos: number; progress: number }>>(new Map())
const knockoffAnimations = ref<Map<string, { mountainId: MountainId; fromPos: number }>>(new Map())
const tokenAnimations = ref<{ mountainId: MountainId; value: number; playerId: string }[]>([])
const scoreAnimations = ref<Map<string, { delta: number; show: boolean }>>(new Map())

// Toggle skip animations
function toggleSkipAnimations() {
  skipAnimations.value = !skipAnimations.value
  localStorage.setItem('skipAnimations', String(skipAnimations.value))
}

// Get animated position for a goat
function getAnimatedPosition(player: Player, mountainId: MountainId): number {
  const key = `${player.id}-${mountainId}`
  const anim = animatingGoats.value.get(key)
  if (anim && anim.mountainId === mountainId) {
    // Interpolate between positions
    return Math.round(anim.fromPos + (anim.toPos - anim.fromPos) * anim.progress)
  }
  return player.goatPositions[mountainId]
}

// Check if a goat is being knocked off
function isBeingKnockedOff(player: Player, mountainId: MountainId): boolean {
  const key = `${player.id}-${mountainId}`
  return knockoffAnimations.value.has(key)
}

// Animate a single move
async function animateMove(
  playerId: string,
  mountainId: MountainId,
  fromPos: number,
  toPos: number,
  knockedOffPlayer?: string,
  tokenCollected?: number
): Promise<void> {
  if (skipAnimations.value) return

  const key = `${playerId}-${mountainId}`
  const steps = Math.abs(toPos - fromPos)
  const duration = 300 * steps // 300ms per step
  const startTime = Date.now()

  // Step-by-step animation
  return new Promise((resolve) => {
    function animate() {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      animatingGoats.value.set(key, {
        mountainId,
        fromPos,
        toPos,
        progress
      })
      animatingGoats.value = new Map(animatingGoats.value) // Trigger reactivity

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        animatingGoats.value.delete(key)
        animatingGoats.value = new Map(animatingGoats.value)

        // Trigger knockoff animation
        if (knockedOffPlayer) {
          animateKnockoff(knockedOffPlayer, mountainId, toPos)
        }

        // Trigger token collection animation
        if (tokenCollected !== undefined) {
          animateTokenCollection(mountainId, tokenCollected, playerId)
        }

        resolve()
      }
    }
    requestAnimationFrame(animate)
  })
}

// Animate knockoff
async function animateKnockoff(playerId: string, mountainId: MountainId, fromPos: number): Promise<void> {
  if (skipAnimations.value) return

  const key = `${playerId}-${mountainId}`
  knockoffAnimations.value.set(key, { mountainId, fromPos })
  knockoffAnimations.value = new Map(knockoffAnimations.value)

  await new Promise(resolve => setTimeout(resolve, 500))

  knockoffAnimations.value.delete(key)
  knockoffAnimations.value = new Map(knockoffAnimations.value)
}

// Animate token collection
async function animateTokenCollection(mountainId: MountainId, value: number, playerId: string): Promise<void> {
  if (skipAnimations.value) return

  tokenAnimations.value.push({ mountainId, value, playerId })
  tokenAnimations.value = [...tokenAnimations.value]

  // Show score increment
  const existing = scoreAnimations.value.get(playerId)
  scoreAnimations.value.set(playerId, {
    delta: (existing?.delta ?? 0) + value,
    show: true
  })
  scoreAnimations.value = new Map(scoreAnimations.value)

  await new Promise(resolve => setTimeout(resolve, 600))

  tokenAnimations.value = tokenAnimations.value.filter(t =>
    !(t.mountainId === mountainId && t.value === value && t.playerId === playerId)
  )

  // Clear score animation after a delay
  setTimeout(() => {
    scoreAnimations.value.delete(playerId)
    scoreAnimations.value = new Map(scoreAnimations.value)
  }, 1000)
}

// Process turn results with animations
async function processTurnAnimations(): Promise<void> {
  if (!lastTurnResult.value || lastTurnResult.value.moves.length === 0) return
  if (skipAnimations.value) return

  isAnimating.value = true

  const playerId = currentPlayer.value?.id
  if (!playerId) {
    isAnimating.value = false
    return
  }

  // Sequential animations for each move
  for (const move of lastTurnResult.value.moves) {
    // Find current position before move (we need to calculate this)
    const player = state.value?.players.find(p => p.id === playerId)
    if (!player) continue

    const currentPos = player.goatPositions[move.mountainId]
    const fromPos = currentPos > 0 ? currentPos - 1 : 0 // Estimate: moved up by 1

    await animateMove(
      playerId,
      move.mountainId,
      fromPos,
      currentPos,
      move.knockedOff ? state.value?.players.find(p => p.name === move.knockedOff)?.id : undefined,
      move.tokenCollected ?? undefined
    )
  }

  isAnimating.value = false
}

// Watch for turn results to trigger animations
watch(lastTurnResult, async (newResult) => {
  if (newResult && newResult.moves.length > 0) {
    await nextTick()
    processTurnAnimations()
  }
}, { deep: true })

// Track which mountains will receive movement from current grouping
const targetMountains = ref<Set<MountainId>>(new Set())

function handleTargetMountainsChanged(mountainIds: MountainId[]) {
  targetMountains.value = new Set(mountainIds)
}

function isTargetMountain(mountainId: MountainId): boolean {
  return targetMountains.value.has(mountainId)
}

// Game menu state
const showGameMenu = ref(false)

function toggleGameMenu() {
  showGameMenu.value = !showGameMenu.value
}

function handleSaveAndQuit() {
  gameStore.saveGame()
  gameStore.resetGame()
  showGameMenu.value = false
}

function handleClearSave() {
  if (confirm('确定要删除存档吗?')) {
    gameStore.clearSavedGame()
    showGameMenu.value = false
  }
}

// Rules modal state
const showRulesModal = ref(false)

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
  return state.value.players.filter((p) => {
    // Use animated position if available
    const animatedPos = getAnimatedPosition(p, mountainId)
    return animatedPos === position
  })
}

function getGoatAnimationClass(player: Player, mountainId: MountainId): string {
  if (isBeingKnockedOff(player, mountainId)) {
    return 'animate-knockoff'
  }
  const key = `${player.id}-${mountainId}`
  if (animatingGoats.value.has(key)) {
    return 'animate-climb'
  }
  return ''
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
        <div class="flex items-center gap-2">
          <h1 class="text-xl font-bold text-gray-800 flex items-center gap-2">
            🐐 Mountain Goats
          </h1>
          <!-- Game Menu Button -->
          <div class="relative">
            <button
              class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              @click="toggleGameMenu"
              title="游戏菜单"
            >
              ☰
            </button>
            <!-- Dropdown Menu -->
            <div
              v-if="showGameMenu"
              class="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 min-w-[140px]"
            >
              <button
                class="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                @click="handleSaveAndQuit"
              >
                💾 保存退出
              </button>
              <button
                class="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-red-600 flex items-center gap-2"
                @click="handleClearSave"
              >
                🗑️ 删除存档
              </button>
            </div>
          </div>
          <!-- Rules Button -->
          <button
            class="p-2 rounded-lg hover:bg-gray-100 transition-colors text-lg"
            title="游戏规则"
            @click="showRulesModal = true"
          >
            ❓
          </button>
        </div>
        <div class="flex items-center gap-4">
          <!-- Skip Animations Toggle -->
          <button
            class="text-xs px-2 py-1 rounded transition-colors"
            :class="skipAnimations ? 'bg-gray-200 text-gray-600' : 'bg-blue-100 text-blue-700'"
            :title="skipAnimations ? '动画已跳过' : '动画已启用'"
            @click="toggleSkipAnimations"
          >
            {{ skipAnimations ? '⏩ 跳过动画' : '✨ 动画启用' }}
          </button>
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
          <div class="text-center mb-2 relative">
            <div class="text-2xl font-bold text-gray-800">{{ mountainId }}</div>
            <div
              :class="[
                'text-xs',
                state.mountains[mountainId].tokenPile.length === 0 ? 'text-red-500 font-bold' : 'text-gray-500'
              ]"
            >
              剩余 {{ state.mountains[mountainId].tokenPile.length }} 枚
            </div>
            <!-- +1 indicator when this mountain will receive movement -->
            <div
              v-if="isTargetMountain(mountainId) && phase === 'grouping'"
              class="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full animate-bounce"
            >
              +1
            </div>
          </div>

          <!-- Mountain Path -->
          <div
            :class="[
              'rounded-t-3xl bg-gradient-to-t p-2 w-20 transition-all',
              mountainColors[mountainId],
              isTargetMountain(mountainId) && phase === 'grouping' ? 'ring-4 ring-green-400 ring-offset-2' : ''
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
                    'w-5 h-5 rounded-full border-2 text-xs flex items-center justify-center text-white font-bold transition-all',
                    playerColorClasses[player.color],
                    getGoatAnimationClass(player, mountainId)
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
            <div class="relative">
              <div class="font-medium text-sm">{{ player.name }}</div>
              <div class="text-xs text-gray-500">
                {{ gameStore.playerScores.find(s => s.player.id === player.id)?.score ?? 0 }} 分
                <span v-if="player.bonusTokens.length > 0" class="text-green-600">
                  (+{{ player.bonusTokens.reduce((a, b) => a + b, 0) }})
                </span>
              </div>
              <!-- Score increment animation -->
              <div
                v-if="scoreAnimations.get(player.id)?.show"
                class="absolute -top-4 right-0 text-green-500 font-bold text-sm animate-score-float"
              >
                +{{ scoreAnimations.get(player.id)?.delta }}
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
        @target-mountains-changed="handleTargetMountainsChanged"
      />

      <!-- Next Turn Button -->
      <div v-if="phase === 'moving'" class="text-center">
        <button
          class="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-lg"
          :disabled="isAnimating"
          @click="handleNextTurn"
        >
          {{ isAnimating ? '动画中...' : '结束回合 →' }}
        </button>
      </div>

      <!-- Token Collection Animation Overlay -->
      <div
        v-for="(token, index) in tokenAnimations"
        :key="`token-${index}`"
        class="fixed z-50 pointer-events-none animate-token-fly"
        style="top: 50%; left: 50%;"
      >
        <div class="w-8 h-8 rounded-full bg-yellow-400 border-2 border-yellow-500 flex items-center justify-center text-xs font-bold">
          {{ token.value }}
        </div>
      </div>
    </main>

    <!-- Rules Modal -->
    <RulesModal :show="showRulesModal" @close="showRulesModal = false" />
  </div>
</template>

<style scoped>
/* Goat climb animation */
@keyframes goat-climb {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

.animate-climb {
  animation: goat-climb 0.2s ease-in-out infinite;
}

/* Knockoff animation */
@keyframes knockoff {
  0% { transform: scale(1) rotate(0deg); opacity: 1; }
  50% { transform: scale(1.2) rotate(15deg); opacity: 1; }
  100% { transform: scale(0.5) rotate(-30deg) translateY(20px); opacity: 0; }
}

.animate-knockoff {
  animation: knockoff 0.5s ease-out forwards;
}

/* Score float animation */
@keyframes score-float {
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(-20px); opacity: 0; }
}

.animate-score-float {
  animation: score-float 1s ease-out forwards;
}

/* Token fly animation */
@keyframes token-fly {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -300%) scale(0.5);
    opacity: 0;
  }
}

.animate-token-fly {
  animation: token-fly 0.6s ease-out forwards;
}
</style>
