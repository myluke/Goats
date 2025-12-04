---
id: i18n.locales-zh
module: i18n
priority: 22
status: failing
version: 1
origin: manual
dependsOn:
  - i18n.setup
supersedes: []
tags:
  - i18n
  - locales
---
# 创建中文翻译文件

## Acceptance Criteria

1. 创建 src/i18n/locales/zh.ts
2. 包含所有 common 模块文本（分、号山、回合等）
3. 包含所有 setup 模块文本（开始新游戏、玩家人数等）
4. 包含所有 game 模块文本（掷骰子、确认移动等）
5. 包含所有 rules 模块文本（10个规则部分）
6. 包含所有 tutorial 模块文本（11个教程步骤）
7. 导出完整的中文翻译对象
