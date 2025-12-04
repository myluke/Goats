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
tddGuidance:
  generatedAt: '2025-12-04T17:05:55.858Z'
  generatedBy: codex
  forVersion: 1
  suggestedTestFiles:
    unit:
      - tests/i18n/locales-zh.test.ts
    e2e:
      - e2e/i18n/locales-zh.spec.ts
  unitTestCases:
    - name: should expose zh locale module at src/i18n/locales/zh.ts
      assertions:
        - const zh = (await import('../../src/i18n/locales/zh.ts')).default
        - expect(zh.app.title).toBe('Mountain Goats')
        - >-
          expect(Object.keys(zh)).toEqual(expect.arrayContaining(['common','app','setup','game','dice','rules','tutorial']))
    - name: should include all common module texts
      assertions:
        - const zh = (await import('../../src/i18n/locales/zh.ts')).default
        - >-
          expect(zh.common).toMatchObject({points:'分',mountain:'号山',turn:'回合',player:'玩家',remaining:'剩余',pieces:'枚'})
        - expect(Object.keys(zh.common)).toHaveLength(6)
    - name: should include all setup module texts
      assertions:
        - const zh = (await import('../../src/i18n/locales/zh.ts')).default
        - expect(zh.setup.title).toBe('开始新游戏')
        - expect(zh.setup.startGame).toBe('开始游戏')
        - >-
          expect(Object.keys(zh.setup.colors)).toEqual(['red','blue','green','yellow'])
    - name: >-
        should include all game and dice module texts for actions like rolling
        and confirming moves
      assertions:
        - const zh = (await import('../../src/i18n/locales/zh.ts')).default
        - expect(zh.game.gameMenu).toBe('游戏菜单')
        - expect(zh.dice.rollDice).toBe('掷骰子')
        - expect(zh.dice.confirmMove).toBe('确认移动')
        - 'expect(zh.game.tokensRemaining).toBe(''剩余 {count} 枚'')'
    - name: should include all rules sections (10 parts) with titles and content
      assertions:
        - const zh = (await import('../../src/i18n/locales/zh.ts')).default
        - expect(Object.keys(zh.rules.sections)).toHaveLength(10)
        - expect(zh.rules.sections.objective.title).toBe('游戏目标')
        - 'expect(zh.rules.sections.turn.example).toContain(''掷出 [2,3,4,1]'')'
    - name: should include all tutorial steps (11 steps)
      assertions:
        - const zh = (await import('../../src/i18n/locales/zh.ts')).default
        - expect(zh.tutorial.steps).toHaveLength(11)
        - >-
          expect(zh.tutorial.steps[0]).toMatchObject({id:'welcome',title:'欢迎来到
          Mountain Goats!'})
        - >-
          expect(zh.tutorial.steps[10]).toMatchObject({id:'ready',title:'准备开始!'})
    - name: should export a complete Chinese translation object for i18n
      assertions:
        - const zh = (await import('../../src/i18n/locales/zh.ts')).default
        - >-
          expect(zh).toMatchObject({common:expect.any(Object),app:expect.any(Object),setup:expect.any(Object),game:expect.any(Object),dice:expect.any(Object),rules:expect.any(Object),tutorial:expect.any(Object)})
        - expect(JSON.stringify(zh)).not.toContain('占位符')
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
