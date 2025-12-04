<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, tm } = useI18n()

defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const searchQuery = ref('')
const activeSection = ref<string | null>(null)

interface RuleSection {
  id: string
  title: string
  content: string
  example?: string
}

const sectionIds = ['objective', 'setup', 'turn', 'mountains', 'tokens', 'knockoff', 'ones', 'bonus', 'endgame', 'tiebreaker']

const ruleSections = computed<RuleSection[]>(() => {
  return sectionIds.map(id => {
    const section = tm(`rules.sections.${id}`) as { title: string; content: string; example?: string }
    return {
      id,
      title: section.title,
      content: section.content,
      example: section.example,
    }
  })
})

const filteredSections = computed(() => {
  if (!searchQuery.value.trim()) {
    return ruleSections.value
  }
  const query = searchQuery.value.toLowerCase()
  return ruleSections.value.filter(
    section =>
      section.title.toLowerCase().includes(query) ||
      section.content.toLowerCase().includes(query) ||
      (section.example?.toLowerCase().includes(query) ?? false)
  )
})

function toggleSection(id: string) {
  activeSection.value = activeSection.value === id ? null : id
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      @click.self="emit('close')"
    >
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <!-- Header -->
        <div class="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
            📖 {{ t('rules.title') }}
          </h2>
          <button
            class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            @click="emit('close')"
          >
            ✕
          </button>
        </div>

        <!-- Search -->
        <div class="p-4 border-b border-gray-100">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="t('rules.searchPlaceholder')"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-4">
          <div v-if="filteredSections.length === 0" class="text-center text-gray-500 py-8">
            {{ t('rules.noResults') }}
          </div>

          <div v-else class="space-y-2">
            <div
              v-for="section in filteredSections"
              :key="section.id"
              class="border border-gray-200 rounded-lg overflow-hidden"
            >
              <!-- Section Header -->
              <button
                class="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between text-left"
                @click="toggleSection(section.id)"
              >
                <span class="font-medium text-gray-800">{{ section.title }}</span>
                <span class="text-gray-400 transform transition-transform" :class="activeSection === section.id ? 'rotate-180' : ''">
                  ▼
                </span>
              </button>

              <!-- Section Content -->
              <div
                v-if="activeSection === section.id || searchQuery"
                class="px-4 py-3 bg-white"
              >
                <p class="text-gray-700 whitespace-pre-line text-sm leading-relaxed">
                  {{ section.content }}
                </p>
                <div
                  v-if="section.example"
                  class="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200"
                >
                  <div class="text-xs text-blue-600 font-medium mb-1">{{ t('rules.exampleLabel') }}</div>
                  <p class="text-sm text-blue-800">{{ section.example }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Reference -->
        <div class="p-4 border-t border-gray-200 bg-gray-50">
          <div class="text-xs text-gray-500 text-center">
            {{ t('rules.quickRef') }}
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
