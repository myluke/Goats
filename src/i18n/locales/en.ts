export default {
  // Common texts
  common: {
    points: 'pts',
    mountain: 'Mountain',
    turn: 'Turn',
    player: 'Player',
    remaining: 'Remaining',
    pieces: 'tokens',
  },

  // App-level texts
  app: {
    title: 'Mountain Goats',
    foundUnfinishedGame: 'Unfinished Game Found',
    playersAndTurn: '{count} players · Turn {turn}',
    savedAt: 'Saved at {time}',
    continueGame: 'Continue Game',
    startNewGame: 'Start New Game',
  },

  // Setup page
  setup: {
    title: 'Start New Game',
    subtitle: 'Set up players',
    playerCount: 'Number of Players',
    playerCountUnit: 'players',
    playerPlaceholder: 'Player {index}',
    startGame: 'Start Game',
    learnGame: 'Learn to Play',
    rulesHint: 'Roll dice → Group (sum 5-10) → Move goats → Reach summits!',
    firstTimeHint: 'First time? Click to learn the rules',
    colors: {
      red: 'Red',
      blue: 'Blue',
      green: 'Green',
      yellow: 'Yellow',
    },
  },

  // Game page
  game: {
    // Header
    gameMenu: 'Game Menu',
    gameRules: 'Game Rules',
    saveAndQuit: 'Save & Quit',
    deleteSave: 'Delete Save',
    confirmDeleteSave: 'Delete saved game?',
    lastRound: 'Last Round!',
    turnNumber: 'Turn {turn}',
    animationEnabled: 'Animations On',
    animationDisabled: 'Skip Animations',

    // Game over
    gameOver: 'Game Over!',
    winner: '{name} Wins!',
    playAgain: 'Play Again',

    // Turn results
    mountainMove: 'Mountain {mountain}',
    pointsGained: '+{points} pts',
    knockedOff: 'Knocked off {player}',
    bonusAwarded: 'Bonus token: +{points} pts!',

    // Mountains
    tokensRemaining: '{count} tokens left',
  },

  // Dice area
  dice: {
    // Phase hints
    phaseRolling: 'Click to roll dice',
    phaseGrouping: 'Select dice to create groups',
    phaseMoving: 'Moving goats...',

    // Sound
    soundOn: 'Sound On',
    soundOff: 'Mute',

    // Multiple ones hint
    multipleOnesTitle: 'You rolled {count} ones!',
    multipleOnesRule: 'Rule: One 1 must stay, others can be changed to any number (1-6). Click highlighted dice to modify.',
    lockedOneTooltip: 'This 1 must stay',
    modifiableOneTooltip: 'Click to modify this 1',
    modifiedDice: 'Modified {count} dice',
    confirmModify: 'Confirm Changes',
    skipModify: 'Skip, Continue',
    diceModified: 'This die was modified',

    // Grouping
    createdGroups: 'Created groups:',
    groupHint: 'Select dice then create group (sum 5-10 moves goats)',
    invalidTarget: 'Invalid target',
    removeGroup: 'Remove group',
    selectedCount: '{count} selected',
    clickCreateGroup: 'Click "Create Group"',
    willMove: 'Will move:',

    // Buttons
    rolling: 'Rolling...',
    rollDice: 'Roll Dice',
    createGroup: 'Create Group',
    reset: 'Reset',
    confirmMove: 'Confirm Move',

    // Help
    helpText: 'Select dice, then click "Create Group". Only groups summing to 5-10 will move goats.',
  },

  // Rules modal
  rules: {
    title: 'Game Rules',
    searchPlaceholder: 'Search rules...',
    noResults: 'No matching rules found',
    exampleLabel: 'Example',
    quickRef: 'Tip: Mountains 5-10 match dice sums 5-10 | Reach summit for tokens | Collect all 6 for bonus',

    sections: {
      objective: {
        title: 'Objective',
        content: 'Get your goats to mountain summits to collect tokens! The player with the most points wins. Each summit has tokens - first to reach it gets them. Collect tokens from all 6 mountains for a bonus!',
      },
      setup: {
        title: 'Setup',
        content: '2-4 players. Each player picks a color. All goats start at the base (position 0). 6 mountains numbered 5-10 correspond to valid dice sum ranges.',
      },
      turn: {
        title: 'Turn Flow',
        content: '1. Roll 4 dice\n2. If multiple 1s, you may change extras to other numbers\n3. Divide dice into 1-4 groups\n4. Groups summing to 5-10 move the corresponding goat up one step',
        example: 'Ex: Rolling [2,3,4,1] can group as: (2+3)=Mt.5, (4+1)=Mt.5 or (2+3+4+1)=Mt.10',
      },
      mountains: {
        title: 'Mountains',
        content: 'Each mountain has different heights:\n• Mt. 5: 3 steps to summit\n• Mt. 6: 4 steps to summit\n• Mt. 7: 5 steps to summit\n• Mt. 8: 6 steps to summit\n• Mt. 9: 7 steps to summit\n• Mt. 10: 8 steps to summit\n\nShorter mountains are easier but have fewer tokens; taller ones are harder but more rewarding.',
      },
      tokens: {
        title: 'Collecting Tokens',
        content: "When your goat first reaches a summit, take the top token (worth 1-3 points). If another player's goat is there, yours knocks them off!",
      },
      knockoff: {
        title: 'Knockoff Rule',
        content: "If your goat lands on a space with another player's goat (including summits), you knock them off! The knocked-off goat returns to the base.",
      },
      ones: {
        title: 'Ones Rule',
        content: 'If you roll multiple 1s, only one must remain a 1 - others can become any number (1-6). Use this powerful ability wisely!',
        example: 'Ex: Rolling [1,1,1,4] - change two 1s to get [1,5,4,4] for 1+5+4=Mt.10 and 4 (invalid)',
      },
      bonus: {
        title: 'Bonus Tokens',
        content: 'Collect at least one token from all 6 mountains (5-10) to earn a bonus token! Bonus values: 15, 12, 9, 6 points. First to complete gets the highest bonus.',
      },
      endgame: {
        title: 'End Game',
        content: 'Last round triggers when:\n• All bonus tokens are claimed\n• 3+ mountains have no tokens left\n\nAll players complete the round. Highest total score wins!',
      },
      tiebreaker: {
        title: 'Tiebreaker',
        content: 'If scores are tied:\n1. Compare bonus token count\n2. Compare number of mountains with collected tokens\n3. Still tied = shared victory',
      },
    },
  },

  // Tutorial
  tutorial: {
    skipTutorial: 'Skip Tutorial',
    prevStep: '← Previous',
    nextStep: 'Next →',
    startPlaying: 'Start Playing!',
    keyboardHint: 'Use ← → or Enter to navigate, Esc to skip',

    steps: [
      {
        id: 'welcome',
        title: 'Welcome to Mountain Goats!',
        content: "This is a 2-4 player dice strategy game. Let's learn how to play!",
      },
      {
        id: 'objective',
        title: 'Objective',
        content: 'Guide your goats to the summits of 6 mountains, collecting tokens for points. Most points wins!',
      },
      {
        id: 'mountains',
        title: 'The Mountains',
        content: 'There are 6 mountains numbered 5-10. The number represents the dice sum needed. Lower mountains (5) are easier but have fewer tokens; higher ones (10) are harder but more rewarding.',
      },
      {
        id: 'roll',
        title: 'Rolling Dice',
        content: 'Each turn starts by clicking "Roll Dice" to roll 4 dice.',
      },
      {
        id: 'ones-rule',
        title: 'Special Ones Rule',
        content: 'If you roll multiple 1s, only one must stay as 1 - others can become any number (1-6). A powerful ability!',
      },
      {
        id: 'grouping',
        title: 'Grouping Dice',
        content: 'Divide dice into 1-4 groups. Groups summing to 5-10 move the corresponding goat up one step.',
      },
      {
        id: 'example',
        title: 'Grouping Example',
        content: 'Rolling [2,3,4,1] could group as (2+3)=Mt.5 and (4+1)=Mt.5, or (2+3+4+1)=Mt.10.',
      },
      {
        id: 'tokens',
        title: 'Collecting Tokens',
        content: "When your goat first reaches a summit, you get that mountain's token. If someone else is there, your goat knocks them off!",
      },
      {
        id: 'bonus',
        title: 'Bonus Tokens',
        content: 'Collect tokens from all 6 mountains to earn a bonus token (15/12/9/6 points)!',
      },
      {
        id: 'endgame',
        title: 'End Game',
        content: 'Last round starts when all bonus tokens are claimed or 3 mountains are empty. Highest score wins!',
      },
      {
        id: 'ready',
        title: 'Ready to Play!',
        content: "You now know the basics. Start playing! Click the ❓ button in-game for detailed rules.",
      },
    ],
  },
}
