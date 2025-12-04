---
id: i18n.component-gameboard
module: i18n
priority: 25
status: passing
version: 1
origin: manual
dependsOn:
  - i18n.setup
  - i18n.locales-zh
supersedes: []
tags:
  - i18n
  - component
---
# 国际化 GameBoard 组件

## Acceptance Criteria

1. 替换 GameBoard.vue 中所有硬编码中文
2. 包括动态文本（分数、回合、获胜者等）
3. 包括菜单项、确认对话框、游戏状态提示
4. 构建通过，界面显示正常
