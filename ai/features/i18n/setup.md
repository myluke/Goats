---
id: i18n.setup
module: i18n
priority: 21
status: failing
version: 1
origin: manual
dependsOn: []
supersedes: []
tags:
  - i18n
  - setup
---
# 安装 vue-i18n 并创建 i18n 配置

## Acceptance Criteria

1. 安装 vue-i18n@9 依赖
2. 创建 src/i18n/index.ts 配置文件
3. 在 main.ts 中注册 i18n 插件
4. 支持从 localStorage 读取语言偏好
5. 默认语言为中文(zh)，fallback 为中文
