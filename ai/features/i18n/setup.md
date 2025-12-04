---
id: i18n.setup
module: i18n
priority: 21
status: passing
version: 1
origin: manual
dependsOn: []
supersedes: []
tags:
  - i18n
  - setup
tddGuidance:
  generatedAt: '2025-12-04T17:01:04.763Z'
  generatedBy: codex
  forVersion: 1
  suggestedTestFiles:
    unit:
      - tests/i18n/setup.test.ts
    e2e:
      - e2e/i18n/setup.spec.ts
  unitTestCases:
    - name: installs vue-i18n@9 dependency in package.json
      assertions:
        - 'expect(pkgJson.dependencies["vue-i18n"]).toBeDefined()'
        - 'expect(pkgJson.dependencies["vue-i18n"]).toMatch(/^\^?9\./)'
    - name: creates src/i18n/index.ts exporting configured i18n instance
      assertions:
        - expect(i18n.global.locale).toBeDefined()
        - expect(typeof i18n.install).toBe("function")
    - name: registers i18n plugin in main.ts
      assertions:
        - expect(appUseSpy).toHaveBeenCalledWith(i18n)
        - expect(appUseSpy).toHaveBeenCalledTimes(1)
    - name: reads locale preference from localStorage when available
      assertions:
        - expect(i18n.global.locale.value).toBe("en-US")
        - expect(localStorage.getItem).toHaveBeenCalledWith("locale")
    - name: defaults locale and fallback to zh when no stored preference
      assertions:
        - expect(i18n.global.locale.value).toBe("zh")
        - expect(i18n.global.fallbackLocale).toBe("zh")
  e2eScenarios: []
  frameworkHint: vitest
---
# 安装 vue-i18n 并创建 i18n 配置

## Acceptance Criteria

1. 安装 vue-i18n@9 依赖
2. 创建 src/i18n/index.ts 配置文件
3. 在 main.ts 中注册 i18n 插件
4. 支持从 localStorage 读取语言偏好
5. 默认语言为中文(zh)，fallback 为中文
