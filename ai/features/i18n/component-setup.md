---
id: i18n.component-setup
module: i18n
priority: 24
status: failing
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
# 国际化 SetupScreen 组件

## Acceptance Criteria

1. 替换 SetupScreen.vue 中所有硬编码中文
2. 使用 $t() 或 useI18n() 调用翻译
3. 包括：玩家人数、颜色名称、按钮文本、提示文本
4. 构建通过，界面显示正常
