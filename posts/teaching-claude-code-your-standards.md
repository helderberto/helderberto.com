---
title: "Teaching Claude Code Your Standards"
date: "2026-02-06"
excerpt: "How to configure Claude Code with custom skills, docs, and workflows to enforce your coding standards consistently"
---

Claude Code is a powerful CLI tool, but its power comes from configuration. Without clear instructions, it's chaotic. With them, it becomes an extension of your development standards. This article shows how I've configured Claude Code to enforce immutability, follow TDD, automate workflows, and maintain consistency across all my projects.

> **Note:** AI tooling moves fast. This reflects my current workflow, which will likely shift as the tools evolve.

Ever had an AI refactor your entire file when you asked for a one-line fix? Or add comments to every function? Claude Code can be powerful or chaotic depending on how you configure it.

After using it extensively, I've learned that treating it like a junior dev who needs clear instructions yields the best results. Here's what works now.

## Know What You're Doing First

**Critical:** Don't blindly trust AI output. You must understand what the code does before shipping it.

Claude Code is a productivity multiplier, not a replacement for engineering judgment. It automates patterns you already know, enforces standards you've already defined, and catches mistakes you'd catch in review - but faster.

**Before using these configs:**

- **Understand the fundamentals** - Know why immutability matters, not just that it's a rule
- **Review every change** - Read diffs before committing. AI makes mistakes.
- **Test everything** - Run tests, check behavior. Don't assume it works.
- **Own the output** - You ship it, you're responsible. AI is a tool, not an excuse.

The configs below work because I know what good code looks like in my context. They encode decisions I've already made. If you copy them without understanding why, you'll ship bad code faster.

Use AI to accelerate what you already know how to do well.

## The `.claude/` Directory

Global config lives at `~/.claude/`.

**Structure:**

```sh
~/.claude/
├── CLAUDE.md # Global instructions
├── docs/     # Conventions (git, typescript, testing, etc.)
├── skills/   # Custom slash commands
└── agents/   # Specialized workflows for specific tasks
```

## Write Short, Prescriptive Docs

Forget lengthy style guides. Write terse, imperative docs. Examples:

**Bad:** "We generally prefer to avoid using `any` in TypeScript because it defeats the purpose of type safety."

**Good:** "No `any` - use `unknown` if needed"

Your docs become the AI's memory. Every session, it reads them.

## Custom Skills = Workflow Automation

Skills are slash commands that trigger workflows. Mine:

- `/ship` - Stage all, commit, push
- `/create-pr` - Create PR with template
- `/coverage` - Check test coverage on unstaged changes
- `/safe-repo` - Scan for leaked secrets

**Before:** Manually running commands every deployment

```sh
# Manual commands
git add -A
git commit -m "fix: update validation logic"
git push
git status  # verify it worked
```

**After:** `/ship` - done

```sh
# Claude handles: status check, staging, commit with style-matched message, push, verification
```

**Structure:**

```sh
skills/ship/
└── skill.md
```

The markdown defines the workflow. AI executes it.

## Enforce Immutability Through Instructions

I mandate immutability in `code-principles.md`:

```markdown
## Immutability (mandatory)

- No array mutations: `push`, `pop`, `splice`, `shift`, `unshift`
- No object mutations: `obj.key=`, `delete obj.key`
- Use: spread `[...]`, `slice`, `map`, destructuring
```

The AI catches mutations I'd miss in review.

## TDD By Default

My `testing.md` enforces test-first:

```markdown
## Rules

- Prefer `vi.spyOn` over `vi.mock` for your own code
- Only use `vi.mock` for third-party libraries
- Test output must be pristine (zero warnings/errors)
```

Fewer mocks = more confidence.

## Concision Is a Feature

My global instruction: "Extreme concision in all interactions and commits. Sacrifice grammar for brevity."

**Results:**

- Faster responses
- Less noise
- Commit messages match my style

## Measuring Impact

Using the tool to improve the tool itself - I asked Claude Code to analyze my git history and code reviews after implementing these configs:

**Immutability enforcement:**

- Caught 8 `.push()` mutations in first two weeks
- Zero array mutation bugs reached code review
- Reduced mutation-related bugs by ~90%

**Commit consistency:**

- 95% of commits match conventional commit style
- No more "fix stuff" or "wip" messages
- PR descriptions follow template structure 100%

**Code review velocity:**

- 40% reduction in "why did you do this?" comments
- Fewer rounds of revision per PR
- Reviewers focus on logic, not style violations

## Learnings

1. **Invest in docs early** - They compound. Every session benefits.
2. **Skills > repetition** - If you do it 3x, make it a skill.
3. **Prescriptive > descriptive** - "Do X" beats "we usually prefer X"
4. **Test your instructions** - AI follows literally. Ambiguity = inconsistency.
5. **Version control your config** - Treat `.claude/` like code.

## The Setup

```sh
# Global config
~/.claude/CLAUDE.md

# Project-specific overrides (optional)
.claude/PROJECT.md
```

AI reads both. Project overrides global.

My full config: [github.com/helderberto/dotfiles](https://github.com/helderberto/dotfiles/tree/main/claude/.claude)

## Result

Consistent code, faster reviews, fewer "why did you do that?" moments. The AI becomes an extension of your standards, not a wildcard.

---

Config approach: Teach once, enforce forever.
