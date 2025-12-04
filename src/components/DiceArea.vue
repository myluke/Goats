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
    <div v-if="showOneModifier && modifiableOneIndices.length > 0" class="mb-4 p-3 bg-yellow-50 rounded-lg">
      <div class="text-sm font-medium text-yellow-800 mb-2">
        您掷出了多个1! 可以将额外的1改为其他数字:
      </div>
      <div class="flex gap-4 items-center justify-center flex-wrap">
        <div
          v-for="dieIndex in modifiableOneIndices"
          :key="dieIndex"
          class="flex items-center gap-2"
        >
          <span class="text-sm text-gray-600">骰子 {{ dieIndex + 1 }}:</span>
          <select
            :value="oneModifications.get(dieIndex) ?? 1"
            class="px-2 py-1 border rounded"
            @change="handleModifyOne(dieIndex, parseInt(($event.target as HTMLSelectElement).value))"
          >
            <option v-for="v in 6" :key="v" :value="v">{{ v }}</option>
          </select>
        </div>
      </div>
      <button
        class="mt-3 w-full py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
        @click="handleConfirmOnes"
      >
        确认修改
      </button>
    </div>

    <!-- Dice Display -->
    <div class="flex justify-center gap-3 mb-4">
      <button
        v-for="(die, index) in localDice"
        :key="die.id"
        :class="[
          'dice-button w-14 h-14 rounded-lg flex items-center justify-center text-2xl font-bold transition-all border-2',
          die.value === 0 && !isRolling ? 'bg-gray-100 border-gray-200 text-gray-400' : 'bg-white shadow-md',
          selectedDice.has(index) ? 'ring-4 ring-green-500 scale-110' : '',
          getDieGroupIndex(index) !== null ? groupColors[getDieGroupIndex(index)! % groupColors.length] + ' ring-2' : 'border-gray-300',
          die.isModified ? 'border-yellow-400' : '',
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
