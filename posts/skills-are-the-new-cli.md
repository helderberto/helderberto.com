---
title: 'Skills Are the New CLI'
date: '2026-04-09'
excerpt: 'CLIs parse flags and print output. Skills read your project, call the right CLIs, and reason about the results. The best developer workflows combine both.'
---

Every developer tool follows the same pattern: parse flags, run logic, print output. `git commit -m "fix bug"` doesn't know your repo uses conventional commits. `npm audit` doesn't know which vulnerabilities affect code you actually changed.

The CLI doesn't know your project. You carry all the context.

Skills flip this. A skill is a single Markdown file that teaches an AI agent _how_ to do something in the context of _your specific project_. No binary, no build step, no runtime dependencies. Just instructions that adapt to whatever they find.

Skills don't replace CLIs. They orchestrate them. I've built dozens of skills that call `git`, `gh`, `npm`, and custom scripts, then reason about the results. Here's what that orchestration layer can do that no single CLI can.

## What is a skill?

A skill is a `SKILL.md` file with YAML frontmatter:

```yaml
---
name: commit
description: >
  Create git commits following repository style.
  Use when user asks to "commit changes", "/commit".
  Don't use for pushing code or creating PRs.
---
```

The `description` field is the entire API. The agent reads it to decide when to activate the skill. "Use when" defines triggers. "Don't use when" prevents misfires. That's the contract.

The body contains instructions the agent follows: not general knowledge it already has, but your project's conventions, gotchas, and preferred tools.

The `!` prefix auto-executes shell commands to pre-load context before the instructions reach the agent.

Skills follow an [open standard](https://agentskills.io) that works across Claude Code, Cursor, and other AI tools. No binary to distribute. Copy the file, the skill works.

## Five things CLIs can't do

### 1. Adapt to your project's conventions

My `commit` skill pre-loads context the moment it activates:

```markdown
## Pre-loaded context

- Status: !`git status`
- Diff: !`git diff HEAD`
- Log: !`git log --oneline -10`

## Message Style

Match repo's existing commit patterns from log.
```

By the time the skill starts working, it already knows your recent commit history, your staging area, and your diff. It reads `git log`, identifies whether you use conventional commits, semantic commits, or something custom, and matches the style.

A CLI would need a config file, a parser, and a classifier to do this. The skill just reads and reasons.

### 2. Orchestrate multiple tools and correlate results

My `coverage` skill doesn't just run tests. It correlates test coverage with your actual changes:

```markdown
1. Run `git diff -U0 --no-color` to get changed lines
2. Run test suite with coverage
3. Parse lcov.info:
   SF:src/utils/helper.ts
   DA:10,1    # line 10, covered
   DA:11,0    # line 11, NOT covered
4. Match changed lines against coverage data
5. Report only uncovered lines you actually changed
```

The output is precise: `src/utils/helper.ts:11`. This line you changed has no test coverage. Not a generic coverage report. Not a percentage. The exact lines that need attention.

A traditional CLI could run tests and generate coverage. But correlating `git diff` line ranges with lcov data, filtering to only your changes, and reporting the intersection? That's three tools piped together with custom parsing logic.

The skill handles orchestration naturally.

### 3. Detect your stack and adjust behavior

My `setup-pre-commit` skill adapts to whatever project it finds:

```markdown
1. Detect package manager from lock file:
   package-lock.json (npm), pnpm-lock.yaml (pnpm),
   yarn.lock (yarn), bun.lockb (bun)
2. Install devDependencies using detected package manager
3. Create .husky/pre-commit with detected pm
4. If repo has no typecheck script in package.json,
   omit that line and tell the user
```

It reads `package.json`, checks which scripts exist, and tailors the hook file. No `--package-manager npm` flag needed. No config file. It looks at what's there and adapts.

The `a11y-audit` skill does the same for frameworks. It detects React, Vue, or Svelte from dependencies, then reports framework-specific violations:

```tsx
// React-specific: uses htmlFor, not for
<label htmlFor="email">Email</label>
<input id="email" type="email" />

// React-specific: aria-describedby for errors
<input aria-invalid="true" aria-describedby="email-error" />
<span id="email-error" role="alert">Email is required</span>
```

A CLI tool runs the same checks everywhere. Skills read the project and adjust.

### 4. Make decisions interactively

[TracerKit](https://github.com/helderberto/tracerkit)'s `tk:prd` skill runs a full interview workflow to gather requirements:

```markdown
One question at a time. Lead with your recommended answer
(mark it "Recommended" and list first). Explore code instead
of asking when possible.

| Branch           | Key questions                  | Skip when              |
| Scope & Surface  | Where? New page? Roles?        | CLI/library            |
| Data & Concepts  | Definitions, existing data     | Never skip             |
| Behavior         | Interactions, filtering        | No user-facing behavior|
| Boundaries       | Out of scope, deferred         | Never skip             |
```

It interviews you one question at a time, explores the codebase to answer questions before asking them, and skips entire branches when they don't apply. A CLI prompt wizard can ask questions. It can't reason about whether to skip them.

### 5. Verify and interpret results

TracerKit's `tk:check` skill verifies your implementation against its plan:

```markdown
Use a general-purpose subagent (read-only, no file writes):

1. Read every section of the plan
2. For each checkbox, check against the codebase
3. Run the project's test suite
4. Compare user stories from the PRD against actual behavior

Classify findings:
- BLOCKERS — prevent transitioning to done
- SUGGESTIONS — improvements, don't block
```

It spawns a read-only subagent that reads the plan, reads the code, runs tests, and categorizes findings so you know what blocks shipping vs what's nice-to-have.

My `safe-repo` skill takes a different approach. It pairs a bash script with skill-level reasoning:

```markdown
## Workflow
1. Run `bash scripts/scan-secrets.sh`
2. Check for sensitive tracked files
3. Analyze git history for removed secrets
4. Review .gitignore for proper patterns
5. Report findings
```

The script scans for AWS keys, API tokens, hardcoded passwords (things regex does well). The skill wraps it: filters false positives, checks history, produces a contextual report.

`coverage` works the same way: a Python script parses lcov data mechanically, the skill decides what to report and why it matters.

This is the pattern worth internalizing. CLIs and scripts are deterministic: same input, same output, every time. Skills are non-deterministic: they reason, adapt, and make judgment calls. **The best workflows combine both.**

## Skills in practice

You don't always invoke skills with `/name`. The `description` field doubles as a natural language trigger. The agent reads every skill's description, matches it to what you said, and activates the right one.

A single prompt can chain multiple skills without a single slash command:

> "I'm done with this feature. Run the tests, ship my changes, and open a PR."

That sentence triggers three skills: `validate-code` runs lint and tests, `ship` groups changes into atomic commits and pushes, `create-pull-request` detects the base branch and opens a PR with a summary from the diff.

No flags, no pipes, no manual orchestration. You described the intent; the skills handled the rest.

Here's how some of those skills work under the hood.

My `ship` skill gates on quality before touching `git`:

```markdown
1. Run `npm run lint` — stop if it fails
2. Run `npm test` — stop if it fails
3. Group changes into atomic commits (invokes `atomic-commits`)
4. Push with `git push`
```

Say "ship it" or "commit and push" and the skill runs your linter, your tests, groups your changes by concern, commits each group separately, and pushes. Four CLIs, one phrase. No `--force` escape hatch.

The `atomic-commits` skill that `ship` relies on reads the full diff and reasons about which files belong together:

```markdown
1. Read `git diff HEAD` and `git status`
2. Identify logical groups:
   - Feature code (src files implementing one thing)
   - Tests for that feature
   - Config changes (package.json, tsconfig)
   - Formatting-only changes
3. For each group: stage by name, commit, verify
```

Say "group my commits" or "split changes into related commits." The skill reasons about the actual diff content, not file paths or glob patterns. One commit per reason to change.

My `create-pull-request` skill chains `git` and `gh` in sequence:

```markdown
1. Detect base branch: `git fetch origin && git remote show origin`
2. Analyze all commits since base: `git diff [base]...HEAD`
3. Push: `git push -u origin HEAD`
4. Create PR: `gh pr create` with title and body from diff analysis
```

"Open a PR," "make a PR," "submit a PR" all trigger it. The skill detects your base branch, reads your full diff, writes a title and summary from the changes, pushes, and opens the PR.

The `architecture-audit` skill goes further. It explores your codebase, identifies tightly-coupled modules, then spawns 3+ parallel subagents to design competing interfaces:

```markdown
1. Explore codebase — note friction:
   - Understanding one concept requires bouncing between many files
   - A module's interface is nearly as complex as its implementation
   - Tightly-coupled modules create integration risk at the seams
2. Present candidates with coupling analysis
3. User picks a candidate
4. Spawn 3+ sub-agents in parallel, each with different constraints:
   - "Minimize — aim for 1–3 entry points max"
   - "Maximize flexibility — support many use cases"
   - "Optimize for the most common caller"
5. Compare designs, recommend a hybrid
```

Say "find refactoring opportunities" or "improve the architecture." The skill reads code, identifies friction, presents options, and designs solutions. No CLI does that.

Each of these skills calls the same CLIs you would run manually. The difference: you don't pipe the output, parse the results, or decide what to do next. The skill handles that.

## Skills compose into workflows

Skills reference each other through "See Also" sections, forming pipelines without coupling:

```
tk:prd → tk:plan → implement with tdd → tk:check
validate-code → atomic-commits → ship
```

Each skill is standalone but designed to hand off to the next. `ship` invokes `atomic-commits`, which invokes `commit`. One phrase triggers a pipeline.

## Getting started

A minimal skill is ~20 lines of Markdown:

1. Create `SKILL.md` with frontmatter (name + description with clear triggers)
2. Write instructions. Focus on what the agent wouldn't know without you: your conventions, your gotchas, your preferred tools
3. Pre-load context with `!` commands for data the skill always needs
4. Add `scripts/` only when you need deterministic computation

The description is your API. Make it specific. "Use when user asks to commit" is clear. "Helps with git stuff" is not.

Teach _how to approach_ the task, not what to produce for a specific case. A skill that generalizes across situations beats one hard-coded for today's exact problem.

You can browse and install community skills from [skills.sh](https://skills.sh), or check out [my skills](https://github.com/helderberto/skills) covering the full development cycle, from TDD to PR creation to accessibility auditing.

## Wrapping up

CLIs are not going anywhere. `git`, `gh`, `npm`, and your custom scripts still do what they do best: deterministic, repeatable work.

Skills don't compete with that. They sit on top, calling the right tools at the right time and reasoning about what the results mean.

The shift is in where the context lives. With CLIs, you carry it. With skills, the Markdown file carries it. Your conventions, your gotchas, your preferred tools, all encoded once and applied every time.

Skills follow an [open standard](https://agentskills.io), work across multiple AI tools, and cost nothing to distribute. A single Markdown file. No build step. No runtime. For developer workflows that require project knowledge, adaptive behavior, and multi-step reasoning, that's enough.

## Resources

- [Agent Skills](https://agentskills.io/home) — the open standard for skills
- [Claude Code Skills](https://code.claude.com/docs/en/skills) — skills in Claude Code
- [Cursor Skills](https://cursor.com/docs/skills) — skills in Cursor
