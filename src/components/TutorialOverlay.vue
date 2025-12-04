<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, tm } = useI18n()

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
}

const tutorialSteps = computed<TutorialStep[]>(() => {
  const steps = tm('tutorial.steps') as { id: string; title: string; content: string }[]
  return steps
})

const currentStepIndex = ref(0)

const currentStep = computed(() => tutorialSteps.value[currentStepIndex.value])
const progress = computed(() => ((currentStepIndex.value + 1) / tutorialSteps.value.length) * 100)
const isLastStep = computed(() => currentStepIndex.value === tutorialSteps.value.length - 1)

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
            {{ t('tutorial.prevStep') }}
          </button>
          <button
            v-else
            class="px-4 py-2 text-gray-400 hover:text-gray-600 transition-colors min-w-[44px] min-h-[44px]"
            @click="skip"
          >
            {{ t('tutorial.skipTutorial') }}
          </button>

          <button
            class="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors min-w-[44px] min-h-[44px]"
            @click="nextStep"
          >
            {{ isLastStep ? t('tutorial.startPlaying') : t('tutorial.nextStep') }}
          </button>
        </div>

        <!-- Keyboard hint -->
        <div class="text-xs text-gray-400 text-center pb-3 hidden sm:block">
          {{ t('tutorial.keyboardHint') }}
        </div>
      </div>
    </div>
  </Teleport>
</template>
