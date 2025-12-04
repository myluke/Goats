---
id: i18n.locales-zh
module: i18n
priority: 22
status: passing
version: 1
origin: manual
dependsOn:
  - i18n.setup
supersedes: []
tags:
  - i18n
  - locales
tddGuidance:
  generatedAt: '2025-12-04T17:03:51.231Z'
  generatedBy: codex
  forVersion: 1
  suggestedTestFiles:
    unit:
      - tests/i18n/locales.zh.test.ts
    e2e: []
  unitTestCases:
    - name: creates zh locale file
      assertions:
        - const zh = await import('src/i18n/locales/zh')
        - expect(zh).toBeDefined()
        - expect(zh.default || zh).toBeTypeOf('object')
    - name: includes all common module texts
      assertions:
        - >-
          const zh = (await import('src/i18n/locales/zh')).default || (await
          import('src/i18n/locales/zh'))
        - expect(zh.common.score).toBe('分')
        - expect(zh.common.round).toBe('回合')
        - expect(zh.common.hill).toBe('号山')
    - name: includes all setup module texts
      assertions:
        - >-
          const zh = (await import('src/i18n/locales/zh')).default || (await
          import('src/i18n/locales/zh'))
        - expect(zh.setup.startNewGame).toBe('开始新游戏')
        - expect(zh.setup.playerCount).toBe('玩家人数')
    - name: includes all game module texts
      assertions:
        - >-
          const zh = (await import('src/i18n/locales/zh')).default || (await
          import('src/i18n/locales/zh'))
        - expect(zh.game.rollDice).toBe('掷骰子')
        - expect(zh.game.confirmMove).toBe('确认移动')
    - name: includes all rules sections
      assertions:
        - >-
          const zh = (await import('src/i18n/locales/zh')).default || (await
          import('src/i18n/locales/zh'))
        - expect(Object.keys(zh.rules)).toHaveLength(10)
    - name: includes all tutorial steps
      assertions:
        - >-
          const zh = (await import('src/i18n/locales/zh')).default || (await
          import('src/i18n/locales/zh'))
        - expect(Array.isArray(zh.tutorial.steps)).toBe(true)
        - expect(zh.tutorial.steps).toHaveLength(11)
    - name: exports complete zh translation object
      assertions:
        - >-
          const zh = (await import('src/i18n/locales/zh')).default || (await
          import('src/i18n/locales/zh'))
        - >-
          expect(zh).toMatchObject({ common: expect.any(Object), setup:
          expect.any(Object), game: expect.any(Object), rules:
          expect.any(Object), tutorial: expect.any(Object) })
  e2eScenarios: []
  frameworkHint: vitest
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
