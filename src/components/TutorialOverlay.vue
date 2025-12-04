<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  complete: []
  skip: []
}>()

interface TutorialStep {
  id: string
  title: string
  content: string
  position: 'top' | 'bottom' | 'center'
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: '欢迎来到 Mountain Goats!',
    content: '这是一个2-4人的骰子策略游戏。让我们学习如何玩吧!',
    position: 'center',
  },
  {
    id: 'objective',
    title: '游戏目标',
    content: '让你的山羊登上6座山的山顶，收集筹码获得分数。收集最多分数的玩家获胜!',
    position: 'center',
  },
  {
    id: 'mountains',
    title: '认识山脉',
    content: '游戏有6座山，编号5-10。数字代表需要的骰子点数和。矮山(5号)容易登顶但筹码少，高山(10号)难登但筹码多。',
    position: 'center',
  },
  {
    id: 'roll',
    title: '掷骰子',
    content: '每回合开始时，点击"掷骰子"按钮掷4个骰子。',
    position: 'bottom',
  },
  {
    id: 'ones-rule',
    title: '1点特殊规则',
    content: '如果掷出多个1，只有一个必须保持为1，其他的可以改成任意数字(1-6)。这是个很强大的能力!',
    position: 'center',
  },
  {
    id: 'grouping',
    title: '骰子分组',
    content: '将骰子分成1-4组。每组的和如果是5-10，对应山上的山羊就会向上移动一步。',
    position: 'bottom',
  },
  {
    id: 'example',
    title: '分组示例',
    content: '例如: 掷出 [2,3,4,1] 可以分组为 (2+3)=5号山 和 (4+1)=5号山，或者 (2+3+4+1)=10号山。',
    position: 'center',
  },
  {
    id: 'tokens',
    title: '收集筹码',
    content: '当你的山羊第一次登上山顶时，获得该山的筹码。如果山顶有其他玩家，你的山羊会把对方挤下山!',
    position: 'center',
  },
  {
    id: 'bonus',
    title: '奖励筹码',
    content: '如果你从所有6座山都获得了筹码，会获得一个奖励筹码(15/12/9/6分)!',
    position: 'center',
  },
  {
    id: 'endgame',
    title: '游戏结束',
    content: '当奖励筹码堆耗尽或3座山的筹码被取完时进入最后一轮。分数最高者获胜!',
    position: 'center',
  },
  {
    id: 'ready',
    title: '准备开始!',
    content: '现在你已经了解基本规则了。开始游戏吧! 游戏中可以点击 ❓ 按钮查看详细规则。',
    position: 'center',
  },
]

const currentStepIndex = ref(0)

const currentStep = computed(() => tutorialSteps[currentStepIndex.value])
const progress = computed(() => ((currentStepIndex.value + 1) / tutorialSteps.length) * 100)
const isLastStep = computed(() => currentStepIndex.value === tutorialSteps.length - 1)

function nextStep() {
  if (isLastStep.value) {
    emit('complete')
  } else {
    currentStepIndex.value++
  }
}

function prevStep() {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--
  }
}

function skip() {
  emit('skip')
}

// Keyboard navigation
function handleKeydown(e: KeyboardEvent) {
  if (!props.show) return
  if (e.key === 'ArrowRight' || e.key === 'Enter') {
    nextStep()
  } else if (e.key === 'ArrowLeft') {
    prevStep()
  } else if (e.key === 'Escape') {
    skip()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <!-- Progress Bar -->
        <div class="h-1 bg-gray-200">
          <div
            class="h-full bg-green-500 transition-all duration-300"
            :style="{ width: `${progress}%` }"
          />
        </div>

        <!-- Content -->
        <div class="p-6">
          <!-- Step indicator -->
          <div class="text-xs text-gray-400 mb-2 text-center">
            {{ currentStepIndex + 1 }} / {{ tutorialSteps.length }}
          </div>

          <!-- Icon based on step -->
          <div class="text-4xl text-center mb-4">
            <span v-if="currentStep?.id === 'welcome'">👋</span>
            <span v-else-if="currentStep?.id === 'objective'">🎯</span>
            <span v-else-if="currentStep?.id === 'mountains'">🏔️</span>
            <span v-else-if="currentStep?.id === 'roll'">🎲</span>
            <span v-else-if="currentStep?.id === 'ones-rule'">1️⃣</span>
            <span v-else-if="currentStep?.id === 'grouping'">✋</span>
            <span v-else-if="currentStep?.id === 'example'">📝</span>
            <span v-else-if="currentStep?.id === 'tokens'">🪙</span>
            <span v-else-if="currentStep?.id === 'bonus'">🏆</span>
            <span v-else-if="currentStep?.id === 'endgame'">🏁</span>
            <span v-else-if="currentStep?.id === 'ready'">🐐</span>
            <span v-else>📖</span>
          </div>

          <!-- Title -->
          <h2 class="text-xl font-bold text-gray-800 text-center mb-3">
            {{ currentStep?.title }}
          </h2>

          <!-- Description -->
          <p class="text-gray-600 text-center leading-relaxed">
            {{ currentStep?.content }}
          </p>
        </div>

        <!-- Navigation -->
        <div class="px-6 pb-6 flex items-center justify-between">
          <button
            v-if="currentStepIndex > 0"
            class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors min-w-[44px] min-h-[44px]"
            @click="prevStep"
          >
            ← 上一步
          </button>
          <button
            v-else
            class="px-4 py-2 text-gray-400 hover:text-gray-600 transition-colors min-w-[44px] min-h-[44px]"
            @click="skip"
          >
            跳过教程
          </button>

          <button
            class="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors min-w-[44px] min-h-[44px]"
            @click="nextStep"
          >
            {{ isLastStep ? '开始游戏!' : '下一步 →' }}
          </button>
        </div>

        <!-- Keyboard hint -->
        <div class="text-xs text-gray-400 text-center pb-3 hidden sm:block">
          使用 ← → 键或 Enter 键导航，Esc 跳过
        </div>
      </div>
    </div>
  </Teleport>
</template>
