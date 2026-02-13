---
title: "Building Shareable AI Agent Skills"
date: "2026-02-13"
excerpt: "How to create reusable AI workflows that work across coding agents, version control them, and share them with the community"
---

You're typing the same instructions to Claude Code every session. "Create a commit following repo style." "Run tests before pushing." "Check coverage on these changes."

What if those workflows were reusable slash commands? What if they worked in Cursor, Continue, and Cline too?

That's what Skills are - version-controlled AI workflows that work across agents.

## The Problem

AI agents lose context between sessions. Every new chat, you're re-explaining:

- Git workflow preferences
- PR creation templates
- Testing requirements
- Quality gates before shipping

You're doing the AI's job - providing context - instead of letting it do yours.

## The Solution: Skills as Code

Skills are markdown files that encode workflows. Install once, invoke with `/skill-name`.

`/ship` = stage, commit with style-matched message, push, verify.

No more manual `git add -A && git commit && git push` dance.

## Why Skills Matter

**Cross-agent portability** - Write once, works in multiple agents:

- Claude Code
- Cursor
- Continue
- Cline
- Windsurf
- Replit
- + more

**Version controlled** - Skills are git-tracked markdown:

- Iterate based on real usage
- Roll back if needed
- See what changed and why

**Shareable** - Install anyone's skills:

```sh
npx skills add helderberto/skills
npx skills add vercel-labs/agent-skills
```

**Team workflows** - Codify team conventions:

- Commit message style
- PR templates
- Security checks
- Quality gates

**Context efficiency** - Skills reduce token usage:

- `/ship` uses fewer tokens than repeating full workflow instructions
- Agent loads skill once, executes steps without re-explanation
- Longer conversations stay within context window limits

## Real Example: Evolving the Ship Skill

Started simple:

```markdown
1. Stage all changes
2. Commit
3. Push
```

Hit a problem: Failed on non-Node projects when trying to run `npm test`.

**Fix:**

```markdown
3. Check for quality checks:
   - If package.json exists, check for lint and test scripts
   - Run available checks in parallel
   - If no package.json, skip quality checks
```

Pushed update. Everyone benefits via `npx skills update`.

This is what version control for AI instructions looks like.

## Building Your Skills Repo

**1. Create repository structure:**

```sh
skills/
├── ship/
│   └── SKILL.md
├── commit/
│   └── SKILL.md
└── coverage/
    └── SKILL.md
```

**2. Write SKILL.md:**

**Example:**

```markdown
---
name: ship
description: Stage all changes, commit, and push
---

# Ship Changes

## Workflow

1. Run git status (never -uall)
2. Review all changes
3. Generate commit message matching repo style
4. Stage all files: git add -A
5. Commit with HEREDOC format
6. Push to current branch
7. Verify with git status

## Rules

- Match repo commit style from git log
- NEVER force push
- NEVER skip hooks
- Push to current branch only
```

**3. Install:**

```sh
npx skills add yourusername/skills --all
```

**4. Use:**

**Example:**

```sh
# In Claude Code, Cursor, Continue, etc.
/ship
```

## My Skills Collection

I maintain a collection covering git workflows, quality gates, safety checks, and development practices at [helderberto/skills](https://github.com/helderberto/skills).

Install: `npx skills add helderberto/skills --all`

## Skills vs. Docs

**Docs** (CLAUDE.md) = passive instructions AI reads

**Skills** = active workflows AI executes

**Key difference:**

- CLAUDE.md loads **every session** - takes context tokens upfront
- Skills load **only when invoked** - no token cost until you use them

**When to use each:**

- CLAUDE.md: Always-on rules (code style, immutability, testing principles)
- Skills: On-demand workflows (commit, PR creation, coverage checks)

Docs say "prefer immutability." Skills enforce it by running lint checks before commit.

**Example:** Put "no array mutations" in CLAUDE.md. Put "/ship workflow with lint checks" in skills.

Both matter. Docs set standards. Skills enforce them. Skills save context for when you need it.

## How Skills Work

The Skills CLI uses symlinks to share files across agents:

```sh
~/.agents/skills/ship/     # Source
~/.claude/skills/ship/     # Symlink for Claude Code
~/.cursor/skills/ship/     # Symlink for Cursor
~/.continue/skills/ship/   # Symlink for Continue
```

One file, multiple agent directories.

Update the source, all agents see the changes.

## Discovery and Sharing

**Find skills:**

**Example:**

```sh
npx skills find typescript
npx skills find testing
```

**Install specific skills:**

**Example:**

```sh
npx skills add helderberto/skills --skill ship --skill commit
```

**Install everything:**

**Example:**

```sh
npx skills add helderberto/skills --all
```

**Update all:**

**Example:**

```sh
npx skills update
```

Browse more: [skills.sh](https://skills.sh)

## Benefits in Practice

**Before skills:**

**Example:**

- Repeat instructions every session
- Inconsistent commit messages
- Forget quality checks
- Manual git commands

**After skills:**

- `/ship` handles entire workflow
- Commits match repo style automatically
- Quality gates always run
- Zero manual git operations

**Impact:**

- Skills replace dozens of repeated prompts
- Works across all my coding agents
- Team members install same skills = consistent workflows
- Improvements benefit everyone via update
- Fewer tokens spent on context = longer, more productive conversations

## Skills = Infrastructure for AI

**This isn't about shortcuts. It's about encoding:**

- Team conventions (commit message style, PR templates, etc.)
- Security practices
- Quality gates (lint, test, coverage)
- Organizational knowledge

## Getting Started

1. Create skills repo
2. Write 2-3 workflows you repeat most
3. Install with `npx skills add yourusername/skills`
4. Iterate based on real usage
5. Share with team/community

Start small. My first skill was just "commit and push." It evolved from there.

## Wrapping Up

You're already teaching AI agents your workflows. Skills make those teachings reusable, shareable, and version controlled.

Stop repeating yourself. Start building skills.

**Resources:**

- My skills: [github.com/helderberto/skills](https://github.com/helderberto/skills)
- Skills CLI: [skills.sh](https://skills.sh)
- Vercel's collection: [github.com/vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills)

Write once. Use everywhere. Improve continuously.
