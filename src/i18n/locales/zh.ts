export default {
  // 通用文本
  common: {
    points: '分',
    mountain: '号山',
    turn: '回合',
    player: '玩家',
    remaining: '剩余',
    pieces: '枚',
  },

  // 应用级文本
  app: {
    title: 'Mountain Goats',
    foundUnfinishedGame: '发现未完成的游戏',
    playersAndTurn: '{count} 位玩家 · 第 {turn} 回合',
    savedAt: '保存于 {time}',
    continueGame: '继续游戏',
    startNewGame: '开始新游戏',
  },

  // 设置页面
  setup: {
    title: '开始新游戏',
    subtitle: '设置玩家人数和信息',
    playerCount: '玩家人数',
    playerCountUnit: '人',
    playerPlaceholder: '玩家 {index}',
    startGame: '开始游戏',
    learnGame: '学习游戏',
    rulesHint: '掷骰子 → 组合点数(5-10) → 移动山羊 → 抢占山顶得分!',
    firstTimeHint: '第一次玩? 点击学习规则',
    colors: {
      red: '红色',
      blue: '蓝色',
      green: '绿色',
      yellow: '黄色',
    },
  },

  // 游戏页面
  game: {
    // 头部
    gameMenu: '游戏菜单',
    gameRules: '游戏规则',
    saveAndQuit: '保存退出',
    deleteSave: '删除存档',
    confirmDeleteSave: '确定要删除存档吗?',
    lastRound: '最后一轮!',
    turnNumber: '第{turn}回合',
    animationEnabled: '动画启用',
    animationDisabled: '跳过动画',

    // 游戏结束
    gameOver: '游戏结束!',
    winner: '{name} 获胜!',
    playAgain: '再来一局',

    // 回合结果
    mountainMove: '{mountain}号山',
    pointsGained: '+{points}分',
    knockedOff: '挤下了{player}',
    bonusAwarded: '获得奖励筹码: +{points} 分!',

    // 山脉
    tokensRemaining: '剩余 {count} 枚',
  },

  // 骰子区域
  dice: {
    // 阶段提示
    phaseRolling: '点击掷骰开始回合',
    phaseGrouping: '选择骰子组成小组',
    phaseMoving: '移动山羊中...',

    // 声音
    soundOn: '开启声音',
    soundOff: '静音',

    // 多个1的提示
    multipleOnesTitle: '您掷出了 {count} 个 1!',
    multipleOnesRule: '规则: 一个 1 必须保留，其余的 1 可以改为其他数字 (1-6)。点击高亮的骰子来修改。',
    lockedOneTooltip: '这个1必须保留',
    modifiableOneTooltip: '点击修改这个1',
    modifiedDice: '已修改 {count} 个骰子',
    confirmModify: '确认修改',
    skipModify: '不修改，继续',
    diceModified: '此骰子已被修改',

    // 分组
    createdGroups: '已创建的分组:',
    groupHint: '点击骰子选中后创建分组 (和为5-10可移动山羊)',
    invalidTarget: '无效目标',
    removeGroup: '删除分组',
    selectedCount: '选中 {count} 个',
    clickCreateGroup: '点击"创建分组"',
    willMove: '将移动:',

    // 按钮
    rolling: '掷骰中...',
    rollDice: '掷骰子',
    createGroup: '创建分组',
    reset: '重置',
    confirmMove: '确认移动',

    // 帮助
    helpText: '点击骰子选中，然后点击"创建分组"。只有和为5-10的分组才会移动山羊。',
  },

  // 规则模态框
  rules: {
    title: '游戏规则',
    searchPlaceholder: '搜索规则...',
    noResults: '没有找到匹配的规则',
    exampleLabel: '示例',
    quickRef: '提示: 山 5-10 对应骰子和 5-10 | 登顶获得筹码 | 集齐6山获得奖励',

    sections: {
      objective: {
        title: '游戏目标',
        content: '让你的山羊登上山顶收集筹码! 收集最多分数的玩家获胜。每座山的顶部都有筹码，先登顶的玩家可以获得筹码。另外，如果你从所有6座山都获得了筹码，可以获得奖励筹码!',
      },
      setup: {
        title: '游戏设置',
        content: '2-4位玩家。每位玩家选择一个颜色。所有山羊从山脚(0号位置)开始。6座山分别编号5-10，对应骰子和的有效范围。',
      },
      turn: {
        title: '回合流程',
        content: '1. 掷4个骰子\n2. 如果有多个1，可以将额外的1改为其他数字\n3. 将骰子分成1-4组\n4. 每组的和如果是5-10，对应的山羊向上移动一步',
        example: '例: 掷出 [2,3,4,1] 可以分组为: (2+3)=5号山, (4+1)=5号山 或 (2+3+4+1)=10号山',
      },
      mountains: {
        title: '山脉说明',
        content: '每座山的高度不同:\n• 5号山: 3步登顶\n• 6号山: 4步登顶\n• 7号山: 5步登顶\n• 8号山: 6步登顶\n• 9号山: 7步登顶\n• 10号山: 8步登顶\n\n矮山更容易登顶但筹码少，高山难登但筹码多。',
      },
      tokens: {
        title: '筹码收集',
        content: '当你的山羊第一次登上山顶时，获得该山顶部的筹码(分值1-3不等)。如果山顶已经被其他玩家占据，你的山羊会把对方挤下去!',
      },
      knockoff: {
        title: '挤下规则',
        content: '如果你的山羊移动到一个已经有其他玩家山羊的位置(包括山顶)，你会把对方挤下山! 被挤下的山羊回到山脚重新开始。',
      },
      ones: {
        title: '1点规则',
        content: '如果你掷出多个1，只有一个必须保持为1，其他的可以改成任意数字(1-6)。这是个很强大的能力，善加利用!',
        example: '例: 掷出 [1,1,1,4] 可以把两个1改成其他数字，比如改成 [1,5,4,4] 来得到 1+5+4=10号山 和 4号(无效)',
      },
      bonus: {
        title: '奖励筹码',
        content: '如果你从所有6座山(5-10号)都至少获得了一个筹码，你会获得一个奖励筹码! 奖励筹码堆从高到低依次是: 15, 12, 9, 6分。先集齐的玩家获得高分奖励。',
      },
      endgame: {
        title: '游戏结束',
        content: '当以下任一条件满足时进入最后一轮:\n• 奖励筹码堆耗尽\n• 3座或更多山的筹码被取完\n\n最后一轮所有玩家都要完成回合。最终分数=收集的筹码分值总和。分数最高者获胜!',
      },
      tiebreaker: {
        title: '平局处理',
        content: '如果分数相同:\n1. 比较奖励筹码数量\n2. 比较收集筹码的山的数量\n3. 都相同则并列获胜',
      },
    },
  },

  // 教程
  tutorial: {
    skipTutorial: '跳过教程',
    prevStep: '← 上一步',
    nextStep: '下一步 →',
    startPlaying: '开始游戏!',
    keyboardHint: '使用 ← → 键或 Enter 键导航，Esc 跳过',

    steps: [
      {
        id: 'welcome',
        title: '欢迎来到 Mountain Goats!',
        content: '这是一个2-4人的骰子策略游戏。让我们学习如何玩吧!',
      },
      {
        id: 'objective',
        title: '游戏目标',
        content: '让你的山羊登上6座山的山顶，收集筹码获得分数。收集最多分数的玩家获胜!',
      },
      {
        id: 'mountains',
        title: '认识山脉',
        content: '游戏有6座山，编号5-10。数字代表需要的骰子点数和。矮山(5号)容易登顶但筹码少，高山(10号)难登但筹码多。',
      },
      {
        id: 'roll',
        title: '掷骰子',
        content: '每回合开始时，点击"掷骰子"按钮掷4个骰子。',
      },
      {
        id: 'ones-rule',
        title: '1点特殊规则',
        content: '如果掷出多个1，只有一个必须保持为1，其他的可以改成任意数字(1-6)。这是个很强大的能力!',
      },
      {
        id: 'grouping',
        title: '骰子分组',
        content: '将骰子分成1-4组。每组的和如果是5-10，对应山上的山羊就会向上移动一步。',
      },
      {
        id: 'example',
        title: '分组示例',
        content: '例如: 掷出 [2,3,4,1] 可以分组为 (2+3)=5号山 和 (4+1)=5号山，或者 (2+3+4+1)=10号山。',
      },
      {
        id: 'tokens',
        title: '收集筹码',
        content: '当你的山羊第一次登上山顶时，获得该山的筹码。如果山顶有其他玩家，你的山羊会把对方挤下山!',
      },
      {
        id: 'bonus',
        title: '奖励筹码',
        content: '如果你从所有6座山都获得了筹码，会获得一个奖励筹码(15/12/9/6分)!',
      },
      {
        id: 'endgame',
        title: '游戏结束',
        content: '当奖励筹码堆耗尽或3座山的筹码被取完时进入最后一轮。分数最高者获胜!',
      },
      {
        id: 'ready',
        title: '准备开始!',
        content: '现在你已经了解基本规则了。开始游戏吧! 游戏中可以点击 ❓ 按钮查看详细规则。',
      },
    ],
  },
}
