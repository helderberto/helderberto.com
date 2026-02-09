---
title: "What Your Claude Code Agents Don't Need to Be Told"
date: "2026-02-09"
excerpt: "How to identify and remove generic noise from your Claude Code configuration so the context window is spent on what actually matters"
---

Claude Code has a finite context window. Every token matters. Your agent definitions, skill files, and docs all compete for that space with the actual code you're asking it to analyze.

The problem: it's tempting to write exhaustive agent configurations, detailed examples, scripted responses, repeated boilerplate. It feels like you're being thorough. But you're actually teaching the model things it already knows, while leaving less room for the things it doesn't.

I hit this wall while working on a frontend feature. My agents were loaded with generic programming examples, and I started wondering: is any of this actually helping, or is it just consuming context?

> This is a follow-up to [Teaching Claude Code Your Standards](/posts/teaching-claude-code-your-standards), where I covered the initial setup of `~/.claude/` with docs, skills, and agents.

## The Real Problem: Teaching the Model What It Already Knows

My TypeScript enforcer agent included examples of how to use spread operators, how to write early returns, and when to use `Set` instead of `Array.find()`. The model already knows all of that.

What it *doesn't* know: our project uses a formatjs babel plugin with `ast: true`, which compiles i18n messages to AST at build time. This causes parameterized messages like `{count} active` to render variable names literally in tests. That's a gotcha worth documenting, it cost me real debugging time.

The distinction is simple: **generic programming knowledge is noise. Project-specific knowledge is signal.**

## Three Filters for Every Line in Your Config

### 1. Does the model already know this?

The model knows common patterns. It knows early returns, immutability with spread, N+1 query problems, React memoization. Including examples of these doesn't make it better at applying them, it just takes up space.

**Delete**: Generic code examples, common design patterns, standard best practices.

**Keep**: Gotchas specific to your project, team conventions the model can't infer, configuration quirks that cause surprising behavior.

### 2. Is this repeated across agents?

I found identical sections copy-pasted across every agent:

```markdown
## Commands to Use
- `Glob` - Find files
- `Grep` - Search for patterns
- `Read` - Examine content
- `Bash` - Run scripts

## Success Criteria
The agent is successful when...
```

The model already knows its available tools from the system prompt. "Success criteria" sections just reword the agent's description. These are filler.

### 3. Is this a checklist or an essay?

The model doesn't need you to explain *how* to extract a function. It needs to know *when* you want it flagged.

**Before (essay with examples):**

```markdown
### Readability Review

Evaluate function complexity and cognitive load...

**Long functions example:**
// ⚠️ Too long (>50 lines)
const processOrder = (order) => {
  // ... 80 lines of logic
};

// ✅ Extracted
const validateOrder = (order) => { /* ... */ };
const calculateTotal = (order) => { /* ... */ };
...
```

**After (checklist):**

```markdown
### Readability
- Functions >50 lines → extract
- Nesting >3 levels → early returns
- Magic numbers → named constants
- Unclear names
```

Same rules. The model fills in the *how*.

## Agents vs Skills: Different Problems, Different Tools

I had a "dependency auditor" agent, hundreds of lines of instructions for what amounts to running `npm audit` and `npm outdated`. That's not a judgment call. That's a command sequence.

**Agents** solve problems requiring judgment: code review, test quality assessment, TypeScript enforcement. They need checklists of *what to look for*.

**Skills** solve problems with deterministic steps: commit, push, lint, audit. They need a sequence of commands and rules about when to stop.

The dependency auditor became a skill:

```markdown
# Dependency Audit

## Commands
Run in parallel:
- `npm audit` - security vulnerabilities
- `npm outdated` - outdated packages

## Workflow
1. Run security audit and outdated check
2. Report critical vulnerabilities with fix commands
3. List outdated packages (major vs minor/patch)
4. Check for unused deps: grep imports in src/

## Rules
- Use `npm audit`, never `npx`
- Prioritize: security > major updates > unused > minor updates
```

Clear. Deterministic. No essays needed.

## Overlapping Agents Dilute Focus

I had three agents doing related work:

- **code-review**: logic errors, readability, pattern consistency
- **refactor-assistant**: code smells, complexity, dead code, duplication
- **perf-analyzer**: algorithm complexity, unnecessary re-renders, memoization

The overlap was significant. The refactor-assistant's unique value was a code smells checklist. The perf-analyzer's unique value was React-specific checks. Both fit naturally as sections in one focused code-review agent.

One agent with clear sections beats three agents competing for the same territory.

## Your Workflows Should Fail Fast

My `/ship` skill (stage → commit → push) had no quality gates. It would happily push broken code. The fix was simple:

```markdown
## Workflow
1. Review all changes
2. Run quality checks in parallel:
   - `npm run lint`
   - `npm test`
3. If checks fail: report errors, STOP do not commit or push
4. Generate commit message
5. Stage, commit, push
```

The key is the hard-stop rule. Without it, the skill optimizes for speed over correctness.

## Document What Only You Know

The highest-value documentation is knowledge the model can't infer from your code alone:

**Internationalization gotchas**:

- Whitespace between elements: use layout (Flex/gap) instead of `{' '}` - linters flag literal strings in JSX

**Accessibility testing**:

- `getByRole` as primary query - if it can't find the element, the a11y is likely wrong
- Prefer `getByRole` over `container.querySelector` - query by accessibility, not DOM structure

**Team conventions**:

- `vi.spyOn` over `vi.mock` for your own code
- `vi.mock` only for third-party libraries

These are decisions your team made. The model can't infer them from reading your code. They prevent real mistakes. That's what your config should contain.

## What I Can't Prove

I can't prove this made my agents "better." There's no benchmark for agent configuration effectiveness. What I can say: the content I removed was generic programming knowledge the model already has. The content I kept, and added, is specific to my projects and workflows. Every token saved on instructions is a token available for analyzing actual code.

Whether that tradeoff matters depends on how close to the context limit you work. For long sessions with large codebases, it adds up.

## Takeaways

1. **Generic knowledge is noise**: If the model already knows it, it doesn't belong in your config
2. **Checklists over essays**: Tell it *what* to check, not *how*
3. **Skills for commands, agents for judgment**: Match the tool to the problem
4. **One focused agent beats three overlapping ones**: Merge and consolidate
5. **Document what only you know**: Project gotchas, team conventions, configuration quirks
6. **Workflows should fail fast**: Add quality gates before destructive operations

Your Claude Code configuration should contain what only *you* know about your project. Everything else is already in the model.

My full config: [github.com/helderberto/dotfiles](https://github.com/helderberto/dotfiles/tree/main/claude/.claude)
