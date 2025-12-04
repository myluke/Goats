<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { setLocale } from '@/i18n'

const { locale } = useI18n()

function toggleLanguage() {
  const newLocale = locale.value === 'zh' ? 'en' : 'zh'
  setLocale(newLocale)
}
</script>

<template>
  <button
    class="px-2 py-1 text-sm rounded-lg border transition-colors hover:bg-gray-100"
    :class="locale === 'zh' ? 'border-gray-300 text-gray-700' : 'border-blue-300 text-blue-700'"
    @click="toggleLanguage"
  >
    {{ locale === 'zh' ? 'EN' : '中' }}
  </button>
</template>
