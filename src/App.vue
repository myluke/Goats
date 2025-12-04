<script setup lang="ts">
// Game store will be used when implementing game features
// import { useGameStore } from '@/stores/game'
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-sky-100 to-green-100">
    <header class="bg-white/80 backdrop-blur-sm shadow-sm py-4">
      <div class="container mx-auto px-4">
        <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
          🐐 Mountain Goats
        </h1>
      </div>
    </header>

    <main class="container mx-auto px-4 py-8">
      <div class="text-center">
        <div class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white shadow-lg mb-6">
          <span class="text-5xl">🏔️</span>
        </div>
        <h2 class="text-3xl font-bold text-gray-800 mb-4">登山山羊 - 网页版</h2>
        <p class="text-gray-600 max-w-md mx-auto mb-8">
          2-4人回合制掷骰桌游，通过组合骰子点数让山羊爬山，抢占山顶拿分！
        </p>
        <button
          class="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-lg"
        >
          开始新游戏
        </button>
      </div>
    </main>
  </div>
</template>
