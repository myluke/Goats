---
id: i18n.language-switcher
module: i18n
priority: 30
status: passing
version: 1
origin: manual
dependsOn:
  - i18n.setup
  - i18n.locales-en
supersedes: []
tags:
  - i18n
  - ui
---
# 添加语言切换功能

## Acceptance Criteria

1. 在 Header 或 SetupScreen 添加语言切换按钮
2. 显示当前语言（中/EN）
3. 切换时保存到 localStorage
4. 页面刷新后保持语言选择
5. 切换语言后界面立即更新
