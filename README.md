# Mountain Goats 🐐🏔️

2-4 人回合制掷骰桌游网页版 - 基于经典桌游 Mountain Goats 规则实现

## 功能特性

- 完整的 Mountain Goats 桌游规则实现
- 2-4 人本地 Hotseat 模式（同屏轮流操作）
- 骰子分组交互（拖拽/点击）
- 多个 1 的特殊规则处理（可变换点数）
- 山顶争夺与击落机制
- 分数筹码收集系统
- 奖励筹码（集齐六山得分）
- 游戏存档与恢复（自动保存到 localStorage）
- 新手教程引导（首次访问自动显示）
- 中英文双语支持
- 响应式设计（桌面/移动端适配）

## 技术栈

- **框架**: Vue 3.5 + TypeScript
- **状态管理**: Pinia
- **样式**: Tailwind CSS 4
- **国际化**: vue-i18n
- **构建工具**: Vite 7
- **UI 组件**: Radix Vue

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

开发服务器默认运行在 http://localhost:5173

## 项目结构

```
src/
├── components/          # Vue 组件
│   ├── GameBoard.vue    # 游戏主界面
│   ├── DiceArea.vue     # 骰子操作区
│   ├── SetupScreen.vue  # 玩家设置界面
│   ├── RulesModal.vue   # 规则说明弹窗
│   ├── TutorialOverlay.vue  # 新手教程
│   └── LanguageSwitcher.vue # 语言切换
├── stores/
│   └── game.ts          # Pinia 游戏状态管理
├── lib/                 # 纯游戏逻辑（无 Vue 依赖）
│   ├── gameState.ts     # 状态工厂与分数计算
│   ├── rules.ts         # 核心规则引擎
│   ├── turnFlow.ts      # 回合状态机
│   └── endGame.ts       # 结束条件与排名
├── types/
│   └── game.ts          # TypeScript 类型定义
├── i18n/                # 国际化配置
│   ├── index.ts
│   └── locales/
│       ├── zh.ts        # 中文翻译
│       └── en.ts        # 英文翻译
├── App.vue              # 根组件
└── main.ts              # 入口文件
```

## 游戏规则

### 基本设置
- 6 座山，编号 5-10，高度分别为 3-8 格
- 每位玩家在每座山脚放置一只山羊
- 每座山有对应分值的筹码堆

### 回合流程

1. **掷骰**: 投掷 4 颗骰子
2. **处理多个 1**: 如果掷出多个 1，保留第一个，其余可变为任意点数（1-6）
3. **分组**: 将骰子分成若干组，每组点数之和对应一座山（5-10 有效）
4. **移动**: 有效分组对应的山上，你的山羊前进一格

### 得分规则

- **登顶得分**: 山羊到达山顶时，获得该山一枚分数筹码
- **击落对手**: 登顶时如有其他玩家山羊在顶，将其击落至山脚
- **已在山顶**: 再次触发该山移动时，不移动但仍拿一枚筹码
- **奖励筹码**: 集齐 6 座山的筹码后，获得奖励筹码（15/12/9/6 分）

### 游戏结束

满足以下任一条件后，完成当前轮次：
- 所有奖励筹码被拿光
- 3 座或更多山的筹码堆为空

**胜负判定**: 总分最高者获胜。平分时比较山顶山羊数量，仍平则比较最高编号山的占领情况。

## 架构说明

```
用户交互 (Components)
    ↓
Pinia Store (stores/game.ts)
    ↓
纯游戏逻辑 (lib/*.ts)
    ↓
不可变状态更新 → 组件重新渲染
```

游戏逻辑与 UI 完全解耦，所有 lib 函数为纯函数，便于测试和未来扩展（如 AI 对战、在线模式）。

## 添加新语言

1. 在 `src/i18n/locales/` 下创建新语言文件（如 `ja.ts`）
2. 参照 `zh.ts` 结构翻译所有文本
3. 在 `src/i18n/index.ts` 中注册新语言
4. 更新 `LanguageSwitcher.vue` 添加切换选项

## 浏览器支持

- Chrome（推荐）
- Safari
- Edge
- Firefox

## License

MIT
