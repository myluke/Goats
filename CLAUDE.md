# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 工作原则

### 基本规范

- **语言要求**:使用简体中文回复用户问题
- **代码质量**:我们的代码会被 Linus Review,要避免被他骂!
- **高标准执行**:重视代码质量、安全性、可维护性
- **如果有方案文档输出，就全部输出到./docs/ 目录下。**

## Commands

```bash
npm run dev          # Start Vite dev server (http://localhost:5173)
npm run build        # Type check (vue-tsc) + production build
npx vue-tsc -b       # Type check only
```

## Architecture

### State Flow
```
User Interactions (Components)
    ↓
Pinia Store (src/stores/game.ts)
    ↓
Pure Game Logic (src/lib/*.ts)
    ↓
Immutable State Updates → Components re-render
```

### Key Directories
- **src/types/game.ts** - All TypeScript types (GameState, Player, Mountain, Die, GamePhase)
- **src/stores/game.ts** - Pinia store: single source of truth, dispatches to lib functions
- **src/lib/** - Pure game logic (no Vue dependencies):
  - `gameState.ts` - Factory functions, score calculation
  - `rules.ts` - Core rules engine (dice, movement, knockoffs, tokens)
  - `turnFlow.ts` - Turn state machine (roll → group → move → end)
  - `endGame.ts` - Win conditions, rankings, tiebreakers
- **src/components/** - Vue components (UI only, dispatch actions to store)

### Game Phases
`'setup'` → `'rolling'` → `'grouping'` → `'moving'` → `'ended'`

Phase controls valid actions via `getTurnState()` computed property.

### Immutability Pattern
All lib functions use `cloneGameState()` (JSON parse/stringify) and return new state rather than mutating. This enables Pinia reactivity.

### Component Hierarchy
```
App.vue
├── SetupScreen.vue (+ TutorialOverlay.vue)
└── GameBoard.vue
    ├── DiceArea.vue (dice rolling, grouping, ones modification)
    └── RulesModal.vue
```

### Persistence
- Auto-saves to localStorage with 500ms debounce
- Key: `mountain-goats-save`
- Tutorial completion: `mountain-goats-tutorial-completed`

## Game Rules Quick Reference
- 6 mountains numbered 5-10 (sum of dice group targets that mountain)
- Mountain heights: 5→3 steps, 6→4, 7→5, 8→6, 9→7, 10→8
- Multiple 1s rule: First 1 kept, others can change to any value (1-6)
- Reaching summit: collect token, knock off any opponent there
- Bonus token: awarded when player has ≥1 token from all 6 mountains
- End game triggers: all bonus tokens claimed OR 3+ mountains empty

---

## Long-Task Harness

This project uses the **agent-foreman** harness for feature-driven development with AI agents.

### Project Goal

桌游 Mountain Goats

### Core Files

| File | Purpose |
|------|---------|
| `ai/features/index.json` | Feature index with status summary (new format) |
| `ai/features/{module}/{id}.md` | Individual feature definitions (new format) |
| `ai/feature_list.json` | Legacy feature backlog (auto-migrated) |
| `ai/progress.log` | Session handoff audit log |
| `ai/init.sh` | Bootstrap script (install/dev/check) |

### Modular Feature Storage

Agent-foreman uses a modular markdown-based storage system where each feature is stored in its own file. This enables efficient operations on individual features without loading the entire list.

#### Directory Structure

```
ai/features/
├── index.json           # Lightweight index for quick lookups
├── auth/                # Module directory
│   ├── login.md        # Feature: auth.login
│   └── logout.md       # Feature: auth.logout
├── chat/
│   └── message.edit.md # Feature: chat.message.edit
└── ...
```

#### Index Format (`ai/features/index.json`)

```json
{
  "version": "2.0.0",
  "updatedAt": "2024-01-15T10:00:00Z",
  "metadata": {
    "projectGoal": "Project goal description",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z",
    "version": "1.0.0"
  },
  "features": {
    "auth.login": {
      "status": "passing",
      "priority": 1,
      "module": "auth",
      "description": "User can log in"
    }
  }
}
```

#### Feature Markdown Format

Each feature is stored as a markdown file with YAML frontmatter:

```markdown
---
id: auth.login
module: auth
priority: 1
status: failing
version: 1
origin: manual
dependsOn: []
supersedes: []
tags:
  - auth
---
# User can log in

## Acceptance Criteria

1. User enters valid credentials and is logged in
2. Invalid credentials show error message
3. Session persists across page reloads
```

#### Auto-Migration

When loading features, agent-foreman automatically detects and migrates from the legacy `ai/feature_list.json` format to the new modular format:

1. **Detection**: Checks if `ai/features/index.json` exists
2. **Migration**: If only legacy format exists, automatically migrates
3. **Backup**: Creates backup at `ai/feature_list.json.bak`
4. **Transparent**: No manual intervention required

To manually trigger migration:
```bash
agent-foreman migrate           # Migrate to new format
agent-foreman migrate --dry-run # Preview without changes
agent-foreman migrate --force   # Force re-migration
```

### Feature Status Values

- `failing` - Not yet implemented or incomplete
- `passing` - Acceptance criteria met
- `blocked` - External dependency blocking
- `needs_review` - Potentially affected by recent changes
- `deprecated` - No longer needed

### Workflow for Each Session

1. **Start** - Read `ai/features/index.json` (or legacy `ai/feature_list.json`) and recent `ai/progress.log`
2. **Select** - Pick the highest priority feature (`needs_review` > `failing`)
3. **Plan** - Review acceptance criteria before coding
4. **Implement** - Work on ONE feature at a time
5. **Done** - Run `agent-foreman done <feature_id>` (auto-verifies + commits)
6. **Log** - Entry automatically added to progress log
7. **Next** - Move to next feature or celebrate completion

### Rules

1. **One feature per session** - Complete or pause cleanly before switching
2. **Don't modify acceptance criteria** - Only change `status` and `notes`
3. **Update status promptly** - Mark features passing when criteria met
4. **Leave clean state** - No broken code between sessions
5. **Use single-line log format** - One line per entry, not verbose Markdown
6. **Never kill running processes** - Let `agent-foreman` commands complete naturally, even if they appear slow or timed out. They may be doing important work (verification, git commits, survey regeneration). Just wait for completion.
7. **Use CI=true for tests** - Always set `CI=true` environment variable when running any test commands (e.g., `CI=true npm test`, `CI=true pnpm test`, `CI=true vitest`) to ensure non-interactive mode and consistent behavior.

### Progress Log Format

Append entries to `ai/progress.log` using this **single-line format only**:

```
2025-01-15T10:30:00Z STEP feature=auth.login status=passing summary="Implemented login flow"
2025-01-15T11:00:00Z CHANGE feature=auth.login action=refactor reason="Improved error handling"
2025-01-15T12:00:00Z REPLAN summary="Splitting auth into submodules" note="Original scope too large"
```

**Log types**: `INIT` | `STEP` | `CHANGE` | `REPLAN` | `VERIFY`

**IMPORTANT**: Do NOT write verbose Markdown session notes. Keep each entry as a single line.

### Commands

```bash
# View project status
agent-foreman status

# Work on next priority feature
agent-foreman next

# Work on specific feature
agent-foreman next <feature_id>

# Mark feature as done (auto-runs verification + auto-commit)
# Quick mode is default - runs only related tests based on testRequirements.unit.pattern
agent-foreman done <feature_id>

# Full mode - run all tests (slower, for final verification)
agent-foreman done <feature_id> --full

# Skip E2E tests (faster iterations)
agent-foreman done <feature_id> --skip-e2e

# Skip auto-commit (manual commit)
agent-foreman done <feature_id> --no-commit

# Skip verification (not recommended)
agent-foreman done <feature_id> --skip-verify

# Analyze impact of changes
agent-foreman impact <feature_id>

# Detect project verification capabilities
agent-foreman detect-capabilities

# Bootstrap/development/testing
./ai/init.sh bootstrap
./ai/init.sh dev
./ai/init.sh check
./ai/init.sh check --quick  # Selective testing mode
```

### Feature ID Convention

Feature IDs use dot notation: `module.submodule.action`

Examples:
- `auth.login`
- `chat.message.edit`
- `api.users.create`

### Acceptance Criteria Format

Write criteria as testable statements:
- "User can submit the form and see a success message"
- "API returns 201 status with created resource"
- "Error message displays when validation fails"

### Feature JSON Schema

**IMPORTANT**: When adding or modifying features in individual `ai/features/{module}/{id}.md` files, use the markdown format shown above. For legacy `ai/feature_list.json`, use this schema:

```json
{
  "features": [
    {
      "id": "module.feature.action",
      "description": "Human-readable description of the feature",
      "module": "parent-module-name",
      "priority": 1,
      "status": "failing",
      "acceptance": [
        "First acceptance criterion",
        "Second acceptance criterion"
      ],
      "dependsOn": ["other.feature.id"],
      "supersedes": [],
      "tags": ["optional-tag"],
      "version": 1,
      "origin": "manual",
      "notes": "",
      "testRequirements": {
        "unit": { "required": false, "pattern": "tests/module/**/*.test.ts" }
      }
    }
  ],
  "metadata": {
    "projectGoal": "Project goal description",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "version": "1.0.0"
  }
}
```

**Required fields**: `id`, `description`, `module`, `priority`, `status`, `acceptance`, `version`, `origin`

**Auto-generated fields**: `testRequirements` (auto-generated during init with pattern `tests/{module}/**/*.test.*`)

**Optional fields**: `testRequirements` (can be overridden), `e2eTags` (Playwright tags for E2E filtering)

### testRequirements Structure

```json
"testRequirements": {
  "unit": {
    "required": false,
    "pattern": "tests/auth/**/*.test.ts",
    "cases": ["should login", "should logout"]
  },
  "e2e": {
    "required": false,
    "pattern": "e2e/auth/**/*.spec.ts",
    "tags": ["@auth"],
    "scenarios": ["user can login"]
  }
}
```

- `required: true` → Feature cannot complete without matching test files (TDD enforcement)
- `pattern` → Glob pattern for selective test execution in quick mode
- `cases`/`scenarios` → Expected test names (optional, for documentation)

**Status values**: `failing` | `passing` | `blocked` | `needs_review` | `deprecated`

**Origin values**: `init-auto` | `init-from-routes` | `init-from-tests` | `manual` | `replan`

### TDD Workflow

Run `agent-foreman next` to see TDD guidance:
- Suggested test files for the current feature
- Acceptance criteria → test case mapping
- Test skeleton preview

Follow the **RED → GREEN → REFACTOR** cycle:
1. **RED**: View acceptance criteria (they are your failing tests)
2. **GREEN**: Write minimum code to satisfy criteria
3. **REFACTOR**: Clean up under test protection

---

*Generated by agent-foreman - https://github.com/mylukin/agent-foreman*
