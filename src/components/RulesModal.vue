<script setup lang="ts">
import { ref, computed } from 'vue'

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

const ruleSections: RuleSection[] = [
  {
    id: 'objective',
    title: '游戏目标',
    content: '让你的山羊登上山顶收集筹码! 收集最多分数的玩家获胜。每座山的顶部都有筹码，先登顶的玩家可以获得筹码。另外，如果你从所有6座山都获得了筹码，可以获得奖励筹码!',
  },
  {
    id: 'setup',
    title: '游戏设置',
    content: '2-4位玩家。每位玩家选择一个颜色。所有山羊从山脚(0号位置)开始。6座山分别编号5-10，对应骰子和的有效范围。',
  },
  {
    id: 'turn',
    title: '回合流程',
    content: '1. 掷4个骰子\n2. 如果有多个1，可以将额外的1改为其他数字\n3. 将骰子分成1-4组\n4. 每组的和如果是5-10，对应的山羊向上移动一步',
    example: '例: 掷出 [2,3,4,1] 可以分组为: (2+3)=5号山, (4+1)=5号山 或 (2+3+4+1)=10号山',
  },
  {
    id: 'mountains',
    title: '山脉说明',
    content: '每座山的高度不同:\n• 5号山: 3步登顶\n• 6号山: 4步登顶\n• 7号山: 5步登顶\n• 8号山: 6步登顶\n• 9号山: 7步登顶\n• 10号山: 8步登顶\n\n矮山更容易登顶但筹码少，高山难登但筹码多。',
  },
  {
    id: 'tokens',
    title: '筹码收集',
    content: '当你的山羊第一次登上山顶时，获得该山顶部的筹码(分值1-3不等)。如果山顶已经被其他玩家占据，你的山羊会把对方挤下去!',
  },
  {
    id: 'knockoff',
    title: '挤下规则',
    content: '如果你的山羊移动到一个已经有其他玩家山羊的位置(包括山顶)，你会把对方挤下山! 被挤下的山羊回到山脚重新开始。',
  },
  {
    id: 'ones',
    title: '1点规则',
    content: '如果你掷出多个1，只有一个必须保持为1，其他的可以改成任意数字(1-6)。这是个很强大的能力，善加利用!',
    example: '例: 掷出 [1,1,1,4] 可以把两个1改成其他数字，比如改成 [1,5,4,4] 来得到 1+5+4=10号山 和 4号(无效)',
  },
  {
    id: 'bonus',
    title: '奖励筹码',
    content: '如果你从所有6座山(5-10号)都至少获得了一个筹码，你会获得一个奖励筹码! 奖励筹码堆从高到低依次是: 15, 12, 9, 6分。先集齐的玩家获得高分奖励。',
  },
  {
    id: 'endgame',
    title: '游戏结束',
    content: '当以下任一条件满足时进入最后一轮:\n• 奖励筹码堆耗尽\n• 3座或更多山的筹码被取完\n\n最后一轮所有玩家都要完成回合。最终分数=收集的筹码分值总和。分数最高者获胜!',
  },
  {
    id: 'tiebreaker',
    title: '平局处理',
    content: '如果分数相同:\n1. 比较奖励筹码数量\n2. 比较收集筹码的山的数量\n3. 都相同则并列获胜',
  },
]

const filteredSections = computed(() => {
  if (!searchQuery.value.trim()) {
    return ruleSections
  }
  const query = searchQuery.value.toLowerCase()
  return ruleSections.filter(
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
            📖 游戏规则
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
            placeholder="搜索规则..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-4">
          <div v-if="filteredSections.length === 0" class="text-center text-gray-500 py-8">
            没有找到匹配的规则
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
                  <div class="text-xs text-blue-600 font-medium mb-1">示例</div>
                  <p class="text-sm text-blue-800">{{ section.example }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Reference -->
        <div class="p-4 border-t border-gray-200 bg-gray-50">
          <div class="text-xs text-gray-500 text-center">
            提示: 山 5-10 对应骰子和 5-10 | 登顶获得筹码 | 集齐6山获得奖励
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
