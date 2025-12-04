---
id: setup.project-init
module: setup
priority: 1
status: passing
version: 1
origin: manual
dependsOn: []
supersedes: []
tags:
  - setup
  - infrastructure
tddGuidance:
  generatedAt: '2025-12-04T15:47:57.036Z'
  generatedBy: codex
  forVersion: 1
  suggestedTestFiles:
    unit:
      - tests/setup/project-init.test.ts
    e2e:
      - e2e/setup/project-init.spec.ts
  unitTestCases:
    - name: creates Vue3 Vite TypeScript scaffold
      assertions:
        - expect(pkg.dependencies.vue).toBeDefined()
        - expect(pkg.devDependencies.vite).toMatch(/^\d/)
        - >-
          expect(tsconfig.compilerOptions).toMatchObject({ jsx: "preserve",
          target: expect.stringMatching(/es/i) })
    - name: configures TailwindCSS v4
      assertions:
        - expect(pkg.devDependencies.tailwindcss).toMatch(/^4\./)
        - >-
          expect(readFileSync("tailwind.config.ts","utf8")).toContain("export
          default")
        - >-
          expect(readFileSync("src/assets/main.css","utf8")).toContain("@tailwind
          base;")
    - name: installs shadcn-vue components
      assertions:
        - 'expect(pkg.dependencies["shadcn-vue"]).toBeDefined()'
        - >-
          expect(JSON.parse(readFileSync("components.json","utf8"))).toHaveProperty("style","default")
        - expect(readdirSync("src/components/ui")).not.toHaveLength(0)
    - name: sets up project folder structure
      assertions:
        - expect(existsSync("src/pages")).toBe(true)
        - expect(existsSync("src/components")).toBe(true)
        - expect(existsSync("src/styles")).toBe(true)
    - name: configures ESLint and Prettier
      assertions:
        - expect(pkg.devDependencies.eslint).toBeDefined()
        - expect(pkg.scripts.lint).toContain("eslint")
        - >-
          expect(existsSync("prettier.config.js") ||
          existsSync("prettier.config.cjs") ||
          existsSync("prettier.config.mjs")).toBe(true)
    - name: defines dev server script
      assertions:
        - expect(pkg.scripts.dev).toMatch(/vite/)
        - >-
          expect(existsSync("vite.config.ts") || existsSync("vite.config.js") ||
          existsSync("vite.config.mts")).toBe(true)
        - 'expect(pkg.devDependencies["@vitejs/plugin-vue"]).toBeDefined()'
  e2eScenarios: []
  frameworkHint: vitest
---
# Initialize Vue3 + TypeScript + TailwindCSS + Shadcn project structure

## Acceptance Criteria

1. Create Vue3 project with Vite and TypeScript
2. Install and configure TailwindCSS v4
3. Install and configure shadcn-vue components
4. Set up project folder structure:
5. Configure ESLint and Prettier
6. Verify dev server runs without errors
