---
title: 'How I Use Claude Code to Build Features'
date: '2026-03-26'
excerpt: 'My current workflow for building features with Claude Code: plan mode, a living SPEC.md, TDD, and how to resume sessions without losing context'
---

This is how I'm building features with Claude Code right now. AI tooling is evolving fast and this workflow will likely change. I'll write a follow-up when it does.

## The Problem

Claude Code loses coherence as context fills. Long sessions accumulate noise: early decisions get buried, the agent starts contradicting prior agreements, or repeats work already done.

The instinct is to keep sessions alive to preserve context. This is backwards. A well-structured `SPEC.md` is more reliable than conversation history, and the cost of not having one adds up fast.

## Why This Matters

Context loss isn't just annoying. It's expensive.

Without a spec, you spend sessions re-explaining what you already agreed on. Claude regenerates code it already wrote. You catch contradictions only after they're merged. A 2-hour feature stretches into 6 hours of back-and-forth.

The cost compounds: you start second-guessing the AI's output, micromanaging every change, or abandoning the session entirely and starting over. The tool that should multiply your speed becomes a source of friction.

A living spec eliminates this. The AI reads the same source of truth every time. You stop being a context manager and go back to being an engineer.

## The Workflow

### 1. Plan Mode First

Before writing any code, I switch to plan mode using `Shift+Tab` in Claude Code, then describe the feature. I end the prompt asking Claude to generate a `SPEC.md` once we finish the planning session:

```plaintext
I want to add a dark mode toggle that persists across sessions.
The preference should be stored in localStorage and applied on initial render.

Let's discuss the approach, identify the files involved, and clarify any open questions.
At the end of our planning, generate a SPEC.md with the agreed context, tasks, and decisions.
```

The `@` syntax in Claude Code lets you reference files directly in your prompt. Use it to point at existing files during planning so Claude has the right context before proposing anything:

```plaintext
@src/components/Header.tsx @src/hooks/

I want to add a dark mode toggle to the Header.
Let's plan the approach before writing any code.
At the end, generate a SPEC.md.
```

Plan mode keeps Claude from jumping straight to implementation. We brainstorm, I push back on things that don't fit, and only after the plan is solid does anything get written to disk.

### 2. Save the Plan as SPEC.md

Once I'm happy with the plan, I save it to `SPEC.md` at the project root. A task checklist is more useful than prose:

```markdown
# Dark Mode Toggle

## Context
Persist user theme preference using localStorage. Apply on initial render to avoid flash.

## Approach
- Store preference as `theme` key in localStorage (`"dark"` | `"light"`)
- Read on mount in `ThemeProvider`, default to system preference if unset
- Toggle button in `Header`, updates state and localStorage in sync

## Tasks
- [ ] Add `useTheme` hook in `src/hooks/useTheme.ts`
- [ ] Update `ThemeProvider` to read from localStorage on mount
- [ ] Add toggle button to `Header` component
- [ ] Write unit tests for `useTheme`
- [ ] Write integration test for persistence across render

## Decisions
- No server-side preference (client only for now)
- System preference as fallback, not default dark
```

The `## Decisions` section matters. Decisions made during planning get forgotten. Writing them down prevents re-litigating the same tradeoffs mid-implementation.

Keep the spec to: feature context, chosen approach, task checklist, and key decisions. Implementation details belong in the code. The spec should be small enough to reread in 30 seconds.

### 3. Implement

When starting a new session to implement, I always reference the spec explicitly using `@`:

```plaintext
@SPEC.md Continue from the next unchecked task.
```

Using `@SPEC.md` ensures the file content is injected directly into the context. Claude isn't guessing. It has the full spec in front of it before writing a single line.

Things like TDD, code style, and commit conventions are already defined in my [`CLAUDE.md`](https://github.com/helderberto/dotfiles/blob/main/dot_claude/CLAUDE.md). I don't repeat them in the spec or in the session prompt. The spec's only job is to describe what we're building, not how to behave.

| File        | Purpose                                        | Lifespan                     |
| ----------- | ---------------------------------------------- | ---------------------------- |
| `CLAUDE.md` | How to work (style, linting, test commands)    | Permanent / project-wide     |
| `SPEC.md`   | What to build (requirements, tasks, decisions) | Ephemeral / feature-specific |

### 4. Mark Tasks Done, Update the Spec

As each task finishes, I mark it `[x]`:

```markdown
- [x] Add `useTheme` hook in `src/hooks/useTheme.ts`
- [x] Update `ThemeProvider` to read from localStorage on mount
- [ ] Add toggle button to `Header` component
```

If the approach changes mid-implementation, I update `## Decisions` before continuing. The spec reflects reality, not the original plan.

If a task turns out heavier than expected, I stop and break it into sub-tasks directly in the spec before continuing:

```markdown
- [ ] Add toggle button to `Header` component
  - [ ] Create `ThemeToggle` component
  - [ ] Wire toggle to `useTheme` hook
  - [ ] Add accessible label and keyboard support
```

Then `/clear` and resume from the first sub-task. Same pattern, smaller scope.

### 5. `/clear` and Resume

**Resuming a session:**

```plaintext
@SPEC.md Continue from the next unchecked task.
```

One sentence. Claude reads the file, sees what's done, and picks up exactly where things left off.

**Pausing mid-session:**

```plaintext
We are pausing here. Update SPEC.md with our current progress, mark completed tasks,
and add a note under a "## Next Steps" section for the next session. Then I will /clear.
```

This keeps the spec accurate even when a session ends mid-task.

**When to `/clear`:**

- After writing the SPEC, before starting implementation
- After completing a task and marking it done
- When the agent starts contradicting prior decisions
- Between independent features

Don't clear mid-task. Finish it, mark it done, then clear.

## Agents Along the Way

The SPEC.md is the backbone, but it's not the whole picture. Throughout the workflow I also trigger specialized agents at key moments. For example, a `code-reviewer` agent at the end of implementation to catch issues before committing.

Claude Code supports custom agents and there are several I rely on regularly. That's a topic for a future post.

## The Core Idea

The spec is the memory. The session is the execution.

Every session starts by reading the spec. Every meaningful decision gets written back to it. When the session ends, nothing is lost. The spec has everything the next session needs to continue.

`/clear` isn't losing context. It's releasing noise and starting clean against a reliable source of truth.

**But the spec isn't just for AI.** It's also:

- **Onboarding docs** for teammates picking up the feature mid-flight
- **A PR description template** that explains what changed and why
- **A reference when debugging** months later ("why did we choose cookies over localStorage?")

The spec starts as an AI tool. It ends as an engineering artifact.

## Wrapping Up

This workflow won't stay the same forever. AI tooling is moving fast and what works today will likely look primitive in a year. But the core habit of writing down what you're building before you build it is older than AI and will outlast it.

I came across Martin Fowler's writing on [Spec-Driven Development](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html) after settling into this workflow. He covers tools like spec-kit that formalize parts of this process. I haven't tried them yet, but the underlying idea is the same: keep a living spec as the anchor between AI sessions.

The spec is just a file. The discipline is what makes it work.

---

**Related:**

- [Claude Code Hooks](/posts/claude-code-hooks)
- [Teaching Claude Code Your Standards](/posts/teaching-claude-code-your-standards)
