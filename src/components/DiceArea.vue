<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Die, MountainId } from '@/types/game'
import {
  calculateGroupSum,
  isValidMountainSum,
  findModifiableOnes,
} from '@/lib/rules'

const props = defineProps<{
  dice: Die[]
  phase: string
  canRoll: boolean
  canGroup: boolean
}>()

const emit = defineEmits<{
  roll: []
  modifyOnes: [modifications: Map<number, number>]
  confirmGroups: [groups: number[][]]
}>()

// Local grouping state
const localDice = ref<Die[]>([...props.dice])
const selectedDice = ref<Set<number>>(new Set())
const groups = ref<number[][]>([])
const showOneModifier = ref(false)
const oneModifications = ref<Map<number, number>>(new Map())

// Animation state
const isRolling = ref(false)
const rollingValues = ref<number[]>([0, 0, 0, 0])
const diceAnimationClasses = ref<string[]>(['', '', '', ''])

// Sound mute state (stored in localStorage)
const isMuted = ref(localStorage.getItem('diceSoundMuted') === 'true')

function toggleMute() {
  isMuted.value = !isMuted.value
  localStorage.setItem('diceSoundMuted', String(isMuted.value))
}

// Sync local dice with props
watch(
  () => props.dice,
  (newDice) => {
    if (!isRolling.value) {
      localDice.value = newDice.map((d) => ({ ...d }))
      // Check for multiple ones
      const modifiableOnes = findModifiableOnes(newDice)
      if (modifiableOnes.length > 0 && !newDice.some((d) => d.isModified)) {
        showOneModifier.value = true
      } else {
        showOneModifier.value = false
      }
    }
  },
  { deep: true, immediate: true }
)

const modifiableOneIndices = computed(() => findModifiableOnes(localDice.value))

// Find the first (locked) one index
const lockedOneIndex = computed(() => {
  const firstOne = localDice.value.findIndex(d => d.value === 1)
  return firstOne !== -1 ? firstOne : null
})

// Check if a die is the locked one (cannot be modified)
function isLockedOne(index: number): boolean {
  return lockedOneIndex.value === index && modifiableOneIndices.value.length > 0
}

// Check if a die is a modifiable one
function isModifiableOne(index: number): boolean {
  return modifiableOneIndices.value.includes(index) && showOneModifier.value
}

// Track which die is being edited (for inline value selector)
const editingDieIndex = ref<number | null>(null)

function startEditingDie(index: number) {
  if (isModifiableOne(index)) {
    editingDieIndex.value = index
  }
}

function finishEditingDie(index: number, value: number) {
  handleModifyOne(index, value)
  editingDieIndex.value = null
}

const groupSums = computed(() => {
  return groups.value.map((group) => {
    const sum = calculateGroupSum(localDice.value, group)
    return {
      indices: group,
      sum,
      isValid: isValidMountainSum(sum),
      mountainId: isValidMountainSum(sum) ? (sum as MountainId) : null,
    }
  })
})

const allDiceGrouped = computed(() => {
  const grouped = new Set(groups.value.flat())
  return grouped.size === localDice.value.length
})

const hasValidMoves = computed(() => {
  return groupSums.value.some((g) => g.isValid)
})

// Dice rolling animation
async function animateDiceRoll(): Promise<void> {
  isRolling.value = true

  // Play sound if not muted
  if (!isMuted.value) {
    playDiceSound()
  }

  // Generate random animation directions for each die
  const directions = ['rotate-x', 'rotate-y', 'rotate-xy', 'rotate-yx']
  diceAnimationClasses.value = Array.from({ length: 4 }, () =>
    directions[Math.floor(Math.random() * directions.length)]!
  )

  // Animate for ~1 second with random interim values
  const duration = 1000
  const intervalTime = 80
  const iterations = Math.floor(duration / intervalTime)

  for (let i = 0; i < iterations; i++) {
    rollingValues.value = Array.from({ length: 4 }, () =>
      Math.floor(Math.random() * 6) + 1
    )
    await new Promise(resolve => setTimeout(resolve, intervalTime))
  }

  // Clear animation classes
  diceAnimationClasses.value = ['', '', '', '']
  isRolling.value = false
}

function playDiceSound() {
  // Create a simple click sound using Web Audio API
  try {
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = 200
    oscillator.type = 'square'
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.1)
  } catch {
    // Audio not supported, silently fail
  }
}

async function handleRoll() {
  if (isRolling.value) return // Prevent double clicks

  groups.value = []
  selectedDice.value.clear()

  // Start animation
  await animateDiceRoll()

  // Emit roll event after animation
  emit('roll')
}

function handleDieClick(index: number) {
  if (props.phase !== 'grouping' || showOneModifier.value || isRolling.value) return

  if (selectedDice.value.has(index)) {
    selectedDice.value.delete(index)
  } else {
    selectedDice.value.add(index)
  }
  selectedDice.value = new Set(selectedDice.value)
}

function handleCreateGroup() {
  if (selectedDice.value.size === 0) return

  const newGroup = Array.from(selectedDice.value)
  groups.value.push(newGroup)
  selectedDice.value.clear()
}

function handleRemoveGroup(groupIndex: number) {
  groups.value.splice(groupIndex, 1)
}

function handleReset() {
  groups.value = []
  selectedDice.value.clear()
}

function handleConfirm() {
  if (allDiceGrouped.value && hasValidMoves.value) {
    emit('confirmGroups', groups.value)
    groups.value = []
    selectedDice.value.clear()
  }
}

function handleModifyOne(dieIndex: number, newValue: number) {
  oneModifications.value.set(dieIndex, newValue)
}

function handleConfirmOnes() {
  if (oneModifications.value.size > 0) {
    emit('modifyOnes', new Map(oneModifications.value))
    showOneModifier.value = false
    oneModifications.value.clear()
  }
}

function getDieGroupIndex(dieIndex: number): number | null {
  for (let i = 0; i < groups.value.length; i++) {
    if (groups.value[i]?.includes(dieIndex)) {
      return i
    }
  }
  return null
}

// Get display value for die (animated or actual)
function getDieDisplayValue(index: number): string | number {
  if (isRolling.value) {
    return rollingValues.value[index] ?? '?'
  }
  const die = localDice.value[index]
  return die?.value || '?'
}

const groupColors = [
  'ring-blue-500 bg-blue-50',
  'ring-green-500 bg-green-50',
  'ring-purple-500 bg-purple-50',
  'ring-orange-500 bg-orange-50',
]
</script>

<template>
  <div class="bg-white rounded-xl shadow-lg p-4">
    <!-- Phase Indicator -->
    <div class="text-center text-sm text-gray-500 mb-3 flex items-center justify-center gap-2">
      <span>{{ phase === 'rolling' ? '点击掷骰开始回合' : phase === 'grouping' ? '选择骰子组成小组' : '移动山羊中...' }}</span>
      <!-- Mute Button -->
      <button
        class="text-gray-400 hover:text-gray-600 transition-colors"
        :title="isMuted ? '开启声音' : '静音'"
        @click="toggleMute"
      >
        {{ isMuted ? '🔇' : '🔊' }}
      </button>
    </div>

    <!-- Multiple Ones Modifier -->
    <div v-if="showOneModifier && modifiableOneIndices.length > 0" class="mb-4 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
      <div class="flex items-start gap-2 mb-3">
        <span class="text-xl">💡</span>
        <div>
          <div class="text-sm font-medium text-yellow-800">
            您掷出了 {{ modifiableOneIndices.length + 1 }} 个 1!
          </div>
          <div class="text-xs text-yellow-700 mt-1">
            规则: 一个 1 必须保留，其余的 1 可以改为其他数字 (1-6)。点击高亮的骰子来修改。
          </div>
        </div>
      </div>

      <!-- Visual dice with modification UI -->
      <div class="flex justify-center gap-3 mb-4">
        <div
          v-for="(die, index) in localDice"
          :key="die.id"
          class="relative"
        >
          <!-- Locked one indicator -->
          <div
            v-if="isLockedOne(index)"
            class="absolute -top-2 -right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs z-10"
            title="这个1必须保留"
          >
            🔒
          </div>

          <!-- Modifiable indicator -->
          <div
            v-if="isModifiableOne(index)"
            class="absolute -top-2 -right-2 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs z-10 animate-pulse cursor-pointer"
            title="点击修改这个1"
          >
            ✏️
          </div>

          <!-- Die display or value selector -->
          <div
            v-if="editingDieIndex === index"
            class="w-14 h-14 rounded-lg bg-white shadow-lg border-2 border-yellow-400 flex flex-wrap items-center justify-center p-1 gap-0.5"
          >
            <button
              v-for="v in 6"
              :key="v"
              :class="[
                'w-4 h-4 rounded text-xs font-bold transition-colors',
                v === (oneModifications.get(index) ?? 1) ? 'bg-yellow-500 text-white' : 'bg-gray-100 hover:bg-yellow-200'
              ]"
              @click="finishEditingDie(index, v)"
            >
              {{ v }}
            </button>
          </div>
          <button
            v-else
            :class="[
              'w-14 h-14 rounded-lg flex items-center justify-center text-2xl font-bold transition-all border-2',
              isLockedOne(index) ? 'bg-blue-50 border-blue-300 text-blue-700' : '',
              isModifiableOne(index) ? 'bg-yellow-100 border-yellow-400 text-yellow-700 hover:scale-105 cursor-pointer ring-2 ring-yellow-300 ring-offset-2' : '',
              !isLockedOne(index) && !isModifiableOne(index) ? 'bg-white border-gray-300 text-gray-700' : '',
              oneModifications.has(index) ? 'bg-green-100 border-green-400 text-green-700' : ''
            ]"
            :disabled="!isModifiableOne(index)"
            @click="startEditingDie(index)"
          >
            {{ oneModifications.get(index) ?? die.value }}
          </button>
        </div>
      </div>

      <!-- Modification summary -->
      <div v-if="oneModifications.size > 0" class="text-center text-sm text-green-700 mb-3">
        已修改 {{ oneModifications.size }} 个骰子
      </div>

      <button
        class="w-full py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium shadow-sm"
        @click="handleConfirmOnes"
      >
        {{ oneModifications.size > 0 ? '确认修改' : '不修改，继续' }}
      </button>
    </div>

    <!-- Dice Display -->
    <div class="flex justify-center gap-3 mb-4">
      <div
        v-for="(die, index) in localDice"
        :key="die.id"
        class="relative"
      >
        <!-- Modified indicator badge -->
        <div
          v-if="die.isModified"
          class="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center z-10"
          title="此骰子已被修改"
        >
          <span class="text-white text-xs">✓</span>
        </div>
        <button
          :class="[
            'dice-button w-14 h-14 rounded-lg flex items-center justify-center text-2xl font-bold transition-all border-2',
            die.value === 0 && !isRolling ? 'bg-gray-100 border-gray-200 text-gray-400' : 'bg-white shadow-md',
            selectedDice.has(index) ? 'ring-4 ring-green-500 scale-110' : '',
            getDieGroupIndex(index) !== null ? groupColors[getDieGroupIndex(index)! % groupColors.length] + ' ring-2' : 'border-gray-300',
            die.isModified ? 'border-yellow-400 bg-yellow-50' : '',
            phase === 'grouping' && !showOneModifier && !isRolling ? 'cursor-pointer hover:scale-105' : 'cursor-default',
            isRolling ? diceAnimationClasses[index] : ''
          ]"
          :disabled="phase !== 'grouping' || showOneModifier || isRolling"
          :style="isRolling ? { willChange: 'transform' } : {}"
          @click="handleDieClick(index)"
        >
          {{ getDieDisplayValue(index) }}
        </button>
      </div>
    </div>

    <!-- Groups Display -->
    <div v-if="groups.length > 0" class="mb-4">
      <div class="text-sm text-gray-600 mb-2">已创建的分组:</div>
      <div class="flex gap-2 flex-wrap justify-center">
        <div
          v-for="(group, gIndex) in groupSums"
          :key="gIndex"
          :class="[
            'px-3 py-1 rounded-full text-sm flex items-center gap-2',
            group.isValid ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
          ]"
        >
          <span>
            {{ group.indices.map(i => localDice[i]?.value).join('+') }} = {{ group.sum }}
          </span>
          <span v-if="group.mountainId" class="font-bold">
            → {{ group.mountainId }}号山
          </span>
          <button
            class="ml-1 text-gray-400 hover:text-red-500"
            @click="handleRemoveGroup(gIndex)"
          >
            ✕
          </button>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-2 justify-center">
      <button
        v-if="phase === 'rolling'"
        :disabled="!canRoll || isRolling"
        :class="[
          'px-6 py-3 rounded-lg font-medium transition-all',
          canRoll && !isRolling
            ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        ]"
        @click="handleRoll"
      >
        {{ isRolling ? '🎲 掷骰中...' : '🎲 掷骰子' }}
      </button>

      <template v-if="phase === 'grouping' && !showOneModifier">
        <button
          :disabled="selectedDice.size === 0"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-all',
            selectedDice.size > 0
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          ]"
          @click="handleCreateGroup"
        >
          创建分组
        </button>

        <button
          :disabled="groups.length === 0"
          class="px-4 py-2 rounded-lg font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all"
          @click="handleReset"
        >
          重置
        </button>

        <button
          :disabled="!allDiceGrouped || !hasValidMoves"
          :class="[
            'px-6 py-2 rounded-lg font-medium transition-all',
            allDiceGrouped && hasValidMoves
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          ]"
          @click="handleConfirm"
        >
          确认移动
        </button>
      </template>
    </div>

    <!-- Help Text -->
    <div v-if="phase === 'grouping' && !showOneModifier" class="mt-3 text-xs text-gray-500 text-center">
      点击骰子选中，然后点击"创建分组"。只有和为5-10的分组才会移动山羊。
    </div>
  </div>
</template>

<style scoped>
/* Dice rolling animations */
@keyframes dice-rotate-x {
  0% { transform: rotateX(0deg) scale(1); }
  25% { transform: rotateX(90deg) scale(1.1); }
  50% { transform: rotateX(180deg) scale(1); }
  75% { transform: rotateX(270deg) scale(1.1); }
  100% { transform: rotateX(360deg) scale(1); }
}

@keyframes dice-rotate-y {
  0% { transform: rotateY(0deg) scale(1); }
  25% { transform: rotateY(90deg) scale(1.1); }
  50% { transform: rotateY(180deg) scale(1); }
  75% { transform: rotateY(270deg) scale(1.1); }
  100% { transform: rotateY(360deg) scale(1); }
}

@keyframes dice-rotate-xy {
  0% { transform: rotateX(0deg) rotateY(0deg) scale(1); }
  25% { transform: rotateX(90deg) rotateY(45deg) scale(1.15); }
  50% { transform: rotateX(180deg) rotateY(90deg) scale(1); }
  75% { transform: rotateX(270deg) rotateY(135deg) scale(1.15); }
  100% { transform: rotateX(360deg) rotateY(180deg) scale(1); }
}

@keyframes dice-rotate-yx {
  0% { transform: rotateY(0deg) rotateX(0deg) scale(1); }
  25% { transform: rotateY(90deg) rotateX(45deg) scale(1.15); }
  50% { transform: rotateY(180deg) rotateX(90deg) scale(1); }
  75% { transform: rotateY(270deg) rotateX(135deg) scale(1.15); }
  100% { transform: rotateY(360deg) rotateX(180deg) scale(1); }
}

.dice-button.rotate-x {
  animation: dice-rotate-x 0.3s ease-in-out infinite;
}

.dice-button.rotate-y {
  animation: dice-rotate-y 0.3s ease-in-out infinite;
}

.dice-button.rotate-xy {
  animation: dice-rotate-xy 0.4s ease-in-out infinite;
}

.dice-button.rotate-yx {
  animation: dice-rotate-yx 0.4s ease-in-out infinite;
}
</style>
