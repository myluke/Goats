---
id: i18n.component-setup
module: i18n
priority: 24
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
tddGuidance:
  generatedAt: '2025-12-04T17:09:02.905Z'
  generatedBy: codex
  forVersion: 1
  suggestedTestFiles:
    unit:
      - tests/i18n/i18n.component-setup.test.ts
    e2e:
      - e2e/i18n/i18n.component-setup.spec.ts
  unitTestCases:
    - name: replaces all hardcoded Chinese strings in SetupScreen.vue
      assertions:
        - 'expect(renderedHtml).not.toMatch(/[\u4e00-\u9fff]/)'
        - expect(renderedHtml).toContain(t('setup.playerCount.label'))
    - name: uses i18n helpers ($t or useI18n) for rendered copy
      assertions:
        - expect(useI18n).toHaveBeenCalled()
        - expect(t).toHaveBeenCalledWith('setup.playerCount.label')
    - name: >-
        uses translation keys for player count, color names, buttons, and hint
        text
      assertions:
        - expect(t).toHaveBeenCalledWith('setup.colors.red')
        - expect(t).toHaveBeenCalledWith('setup.buttons.start')
    - name: renders without errors and shows translated labels
      assertions:
        - expect(() => renderComponent()).not.toThrow()
        - expect(screen.getByText(t('setup.playerCount.label'))).toBeTruthy()
  e2eScenarios:
    - name: user sees all SetupScreen texts localized
      steps:
        - navigate to SetupScreen route
        - wait for i18n to load
        - verify displayed player count label equals locale value
        - verify color options show translated names
        - verify start/confirm buttons show translated text
        - verify hint/helper text matches locale
    - name: page renders cleanly with localized content
      steps:
        - open app build
        - navigate to SetupScreen
        - confirm no UI errors or missing translation keys
        - verify layout and controls are visible
  frameworkHint: vitest
---
# 国际化 SetupScreen 组件

## Acceptance Criteria

1. 替换 SetupScreen.vue 中所有硬编码中文
2. 使用 $t() 或 useI18n() 调用翻译
3. 包括：玩家人数、颜色名称、按钮文本、提示文本
4. 构建通过，界面显示正常
