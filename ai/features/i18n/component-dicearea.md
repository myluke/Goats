---
id: i18n.component-dicearea
module: i18n
priority: 26
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
# 国际化 DiceArea 组件

## Acceptance Criteria

1. 替换 DiceArea.vue 中所有硬编码中文
2. 包括骰子操作提示、分组提示、1点规则说明
3. 包括按钮文本和工具提示
4. 构建通过，界面显示正常
