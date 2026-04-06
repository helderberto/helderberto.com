---
title: 'Why I Built TracerKit'
date: '2026-04-06'
excerpt: "My manual SPEC.md workflow had friction I couldn't ignore, so I built TracerKit: a spec-driven development tool with PRD interviews, tracer-bullet plans, and automated verification."
---

[In a previous post](/posts/how-i-use-claude-code-to-build-features), I described a workflow for building features with Claude Code: plan in conversation, save the plan as `SPEC.md`, implement task by task, `/clear` between sessions. The spec is the memory, the session is the execution.

I ended that post saying the workflow would change. It did.

## Where the Manual Workflow Broke

The `SPEC.md` approach worked, but three problems kept surfacing:

1. **Inconsistent specs.** Every feature started from scratch. Some specs had decisions sections, some didn't. Some had task checklists, others had prose. Quality depended on how disciplined I was that day.

2. **No verification.** I'd mark tasks `[x]` by hand. Sometimes before tests passed. Sometimes I'd forget to update the spec entirely. The source of truth drifted from reality.

3. **No lifecycle.** Finished specs sat in the project root next to active ones. No archive, no status tracking, no way to see what was in flight.

I kept patching these with better prompts and more discipline. Then I realized the workflow itself should be the tool.

## The Workflow Now

[TracerKit](https://github.com/helderberto/tracerkit) is what came out of that realization. A set of AI agent skills (pure Markdown, zero runtime deps) that replace the manual spec workflow with a structured one.

Here's the same dark mode feature from the [previous post](/posts/how-i-use-claude-code-to-build-features), this time through TracerKit.

### 1. Orient

```
/tk:brief
```

At the start of any session, this shows what's in flight:

```
| Feature   | Status      | Age | Progress | Next                        |
|-----------|-------------|-----|----------|-----------------------------|
| dark-mode | in_progress | 1d  | 4/7      | Add accessible toggle label |

**Focus -> dark-mode**
```

One command to orient. No digging through files to remember where I left off.

### 2. Define the PRD

```
/tk:prd enable dark mode
```

The skill explores the codebase first, then interviews me one question at a time. It pushes back on vague answers, flags contradictions, and forces me to define scope boundaries before writing anything.

The output is a structured PRD at `.tracerkit/prds/dark-mode.md` with frontmatter tracking status:

```markdown
---
created: 2026-04-06T10:00:00Z
status: created
---

# Dark Mode

## Problem Statement
...

## User Stories
1. As a user, I want to toggle between light and dark themes...

## Implementation Decisions
...

## Out of Scope
...
```

Every PRD follows the same structure. No more specs that vary by discipline level.

### 3. Plan in Tracer-Bullet Slices

```
/tk:plan dark-mode
```

The skill reads the PRD, explores the codebase, and breaks the feature into **tracer-bullet vertical slices**, a concept from _The Pragmatic Programmer_.

Instead of building layer by layer (all schema, then all services, then all UI), each phase cuts a thin path through every layer and is demoable on its own. Integration problems surface in phase 1, not at the end.

```markdown
## Phase 1 — Theme toggles end-to-end

### Done when

- [ ] `useTheme` hook reads/writes localStorage
- [ ] `ThemeProvider` applies theme class on mount
- [ ] Toggle button in Header switches theme
- [ ] No flash of wrong theme on reload

---

## Phase 2 — Polish and accessibility

### Done when

- [ ] System preference used as default when no localStorage value
- [ ] Toggle has accessible label and keyboard support
- [ ] All tests pass
```

The key difference from a flat task list: each phase is independently verifiable. The "Done when" items are testable conditions, not prose. An agent can verify them by reading files or running commands.

### 4. Implement Phase by Phase

```
@.tracerkit/plans/dark-mode.md do phase 1
```

Same as before: reference the plan, implement, run tests. But the plan has structure that survives context loss. Each phase has explicit acceptance criteria. I don't need to re-explain what "done" means.

Between phases, `/clear`. The plan is the memory.

### 5. Verify and Archive

```
/tk:check dark-mode
```

This is the step that didn't exist before. The skill launches a read-only review agent that checks every "Done when" item against the actual codebase. It runs the test suite, compares user stories from the PRD against behavior, and reports findings:

```
## Verification: dark-mode

### Status: done

### Progress
Phase 1 — Theme toggles end-to-end: 4/4
Phase 2 — Polish and accessibility: 3/3
Total: 7/7

### BLOCKERS
- None

### SUGGESTIONS
- None
```

On `done`, it archives the PRD and plan to `.tracerkit/archives/dark-mode/` and cleans up the active files. No stale specs sitting in the project root.

## What Changed, What Didn't

| Before (manual SPEC.md) | After (TracerKit) |
| --- | --- |
| Spec structure varies per feature | Same structure every time via interview |
| Tasks marked done by hand | Verification agent checks against codebase |
| Finished specs accumulate | Auto-archived on completion |
| No cross-feature visibility | `/tk:brief` dashboard |
| Flat task lists | Phased tracer-bullet slices |
| Decisions drift mid-session | Architectural decisions locked in plan header |

What didn't change:

- `CLAUDE.md` still defines _how_ to work. TracerKit defines _what_ to build.
- `/clear` between phases. The plan is the context, not the conversation.
- TDD during implementation. TracerKit structures the spec work, not the coding.
- The spec is still a Markdown file. No database, no server, no lock-in.

The core habit is the same: write down what you're building before you build it. TracerKit made the habit consistent and added the verification step I was too lazy to do manually.

## The Core Idea

Same as before, with one addition:

> The spec is the memory. The session is the execution. **Verification closes the loop.**

Without verification, specs become wish lists. Tasks get marked done without evidence. `/tk:check` forces honesty: either the codebase matches the plan or it doesn't.

The other addition: lifecycle. Features have a clear path: `created -> in_progress -> done -> archived`. At any point, `/tk:brief` shows where everything stands.

Not every task needs the full workflow. A one-line fix or a small config change doesn't need a PRD and a phased plan. Use your judgment. That said, I've had consistent success following the full flow even for tasks that seemed small at first. Small tasks have a way of growing, and the spec catches that early.

## Get Started

TracerKit is open source and stack-agnostic. It currently supports Claude Code, with Cursor and Copilot on the roadmap.

```bash
npm install -g tracerkit
tracerkit init
```

**Repository**: [github.com/helderberto/tracerkit](https://github.com/helderberto/tracerkit)

The idea for TracerKit came out of [Claude Code for Real Engineers](https://www.aihero.dev/cohorts/claude-code-for-real-engineers-2026-04), a cohort by [Matt Pocock](https://github.com/mattpocock). The hands-on approach to building real things with Claude Code made the friction in my manual workflow impossible to ignore.

The entire project was built using its own workflow. Dog-fooding from day one. The walkthrough above is a real example, not a demo.

Ideas, feedback, and feature requests are welcome as [GitHub issues](https://github.com/helderberto/tracerkit/issues?q=sort%3Aupdated-desc+is%3Aissue+is%3Aopen).

The [previous workflow](/posts/how-i-use-claude-code-to-build-features) was the right instinct: structure your AI sessions around a living spec. TracerKit is what happens when you stop maintaining that structure by hand and let the tools enforce it.

AI tooling will keep evolving. The habit of specifying before building won't.

If you try TracerKit, I'd like to hear how it fits your workflow. Share what worked, what didn't, and what's missing. The best features so far came from real usage, not guesses. Open an [issue](https://github.com/helderberto/tracerkit/issues?q=sort%3Aupdated-desc+is%3Aissue+is%3Aopen) with ideas, friction points, or your own spec-driven flow. Building in public works better when the feedback loop is open.

---

**Related:**

- [How I Use Claude Code to Build Features](/posts/how-i-use-claude-code-to-build-features)
- [Claude Code Hooks](/posts/claude-code-hooks)
- [Teaching Claude Code Your Standards](/posts/teaching-claude-code-your-standards)
