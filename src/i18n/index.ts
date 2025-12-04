import { createI18n } from 'vue-i18n'
import zh from './locales/zh'
import en from './locales/en'

const LOCALE_STORAGE_KEY = 'mountain-goats-locale'

// 从 localStorage 读取语言偏好，默认中文
function getStoredLocale(): string {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem(LOCALE_STORAGE_KEY) || 'zh'
  }
  return 'zh'
}

export const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: getStoredLocale(),
  fallbackLocale: 'zh',
  messages: {
    zh,
    en,
  },
})

// 切换语言并保存到 localStorage
export function setLocale(locale: 'zh' | 'en') {
  i18n.global.locale.value = locale
  localStorage.setItem(LOCALE_STORAGE_KEY, locale)
}

// 获取当前语言
export function getLocale(): string {
  return i18n.global.locale.value
}
