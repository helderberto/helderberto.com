---
title: 'Claude Code Hooks'
date: '2026-03-19'
excerpt: 'How to use hooks to enforce your standards automatically and keep Claude Code in check'
---

Claude Code moves fast: editing files, running commands, pushing code in quick succession. Hooks let you intercept that flow and enforce your standards automatically.

## What Are Hooks?

Hooks are shell commands that run at lifecycle events during a Claude Code session. They're configured in `settings.json` and execute outside Claude's control. The harness runs them, not the AI.

**This matters:** Claude can't skip hooks or work around them. They're infrastructure, not suggestions.

## Hook Types

| Hook           | When it runs                     | Can block?          |
| -------------- | -------------------------------- | ------------------- |
| `PreToolUse`   | Before a tool executes           | Yes (non-zero exit) |
| `PostToolUse`  | After a tool executes            | No                  |
| `Notification` | When Claude sends a notification | No                  |
| `Stop`         | When Claude's turn ends          | No                  |
| `SubagentStop` | When a subagent finishes         | No                  |

`PreToolUse` is the most powerful: it can stop a tool from running entirely.

## Configuration

Hooks live in `settings.json`. Two scopes:

- `~/.claude/settings.json` (global, applies everywhere)
- `.claude/settings.json` (project-level, merged with global)

**Structure:**

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "your-shell-command-here",
            "timeout": 60,
            "statusMessage": "Running check..."
          }
        ]
      }
    ]
  }
}
```

**Fields:**

- `matcher`: tool name to match (`"Bash"`, `"Edit"`, `"Write"`, `""` for all)
- `command`: shell command to run
- `timeout`: milliseconds before the hook is killed
- `statusMessage`: shown in the UI while the hook runs

## Hook Input

Hooks receive the tool's input via `stdin` as JSON. Use `jq` to extract what you need:

```sh
# Get the bash command being run
cmd=$(jq -r '.tool_input.command')

# Get the file path being edited
path=$(jq -r '.tool_input.file_path')
```

This lets you write conditional hooks that only fire for specific operations.

## Practical Examples

### Lint Before Push

Block `git push` unless lint passes:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "cmd=$(jq -r '.tool_input.command'); echo \"$cmd\" | grep -q 'git push' || exit 0; npm run lint",
            "timeout": 120,
            "statusMessage": "Running lint before push..."
          }
        ]
      }
    ]
  }
}
```

`exit 0` on non-push commands lets them through. Only push triggers the lint check. Lint fails = push blocked.

### Type-Check After TypeScript Edits

Run `tsc` after editing `.ts` files:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit",
        "hooks": [
          {
            "type": "command",
            "command": "path=$(jq -r '.tool_input.file_path'); echo \"$path\" | grep -q '\\.ts$' || exit 0; npx tsc --noEmit",
            "timeout": 60,
            "statusMessage": "Type-checking..."
          }
        ]
      }
    ]
  }
}
```

### Desktop Notification When Claude Stops

Know when a long task finishes without watching the terminal:

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "osascript -e 'display notification \"Claude finished\" with title \"Claude Code\"'"
          }
        ]
      }
    ]
  }
}
```

### Block Writes to Sensitive Files

Prevent accidental edits to `.env` files:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "path=$(jq -r '.tool_input.file_path'); echo \"$path\" | grep -q '\\.env' && echo 'Blocked: cannot write to .env files' && exit 1 || exit 0"
          }
        ]
      }
    ]
  }
}
```

Non-zero exit blocks the tool. Claude sees the output and adjusts.

## Frontend-Specific Examples

### Run Tests After Component Changes

Trigger Vitest after editing React components:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit",
        "hooks": [
          {
            "type": "command",
            "command": "path=$(jq -r '.tool_input.file_path'); echo \"$path\" | grep -qE '\\.(tsx|jsx)$' || exit 0; npx vitest run --reporter=verbose 2>&1 | tail -20",
            "timeout": 120,
            "statusMessage": "Running component tests..."
          }
        ]
      }
    ]
  }
}
```

Only fires on `.tsx`/`.jsx` edits. You see failing tests immediately, not after the next push.

### Block `console.log` Before Commit

Prevent debug statements from shipping:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "cmd=$(jq -r '.tool_input.command'); echo \"$cmd\" | grep -q 'git commit' || exit 0; git diff --cached | grep -q 'console\\.log' && echo 'Blocked: staged changes contain console.log' && exit 1 || exit 0",
            "statusMessage": "Checking for console.log..."
          }
        ]
      }
    ]
  }
}
```

Scans the staged diff before every commit. Fails if `console.log` is found.

### ESLint on Every File Write

Catch lint errors the moment a file is created:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "path=$(jq -r '.tool_input.file_path'); echo \"$path\" | grep -qE '\\.(ts|tsx|js|jsx)$' || exit 0; npx eslint \"$path\" --max-warnings=0",
            "timeout": 30,
            "statusMessage": "Linting new file..."
          }
        ]
      }
    ]
  }
}
```

Useful when Claude writes new files from scratch. Errors surface before any follow-up edits build on broken code.

### Accessibility Check After Component Edits

Run `axe-core` via CLI after touching UI components:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit",
        "hooks": [
          {
            "type": "command",
            "command": "path=$(jq -r '.tool_input.file_path'); echo \"$path\" | grep -q 'components/' || exit 0; echo \"$path\" | grep -qE '\\.tsx$' || exit 0; npx axe-cli http://localhost:3000 --exit",
            "timeout": 60,
            "statusMessage": "Checking accessibility..."
          }
        ]
      }
    ]
  }
}
```

Requires a running dev server. Best paired with a `PreToolUse` hook that starts it if not running.

### Prettier Format Check After Write

Enforce consistent formatting on new files without running format-on-save globally:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "path=$(jq -r '.tool_input.file_path'); echo \"$path\" | grep -qE '\\.(ts|tsx|css|json)$' || exit 0; npx prettier --check \"$path\" || (echo \"Run: npx prettier --write \\\"$path\\\"\" && exit 1)",
            "timeout": 15,
            "statusMessage": "Checking formatting..."
          }
        ]
      }
    ]
  }
}
```

Outputs the fix command when it fails, so Claude can auto-correct.

## Hooks vs. CLAUDE.md

**CLAUDE.md** tells Claude what to do. Claude might forget or skip steps under pressure.

**Hooks** run regardless of what Claude does. They're external to the AI.

Use CLAUDE.md for preferences. Use hooks for guarantees.

**Example:** "Run lint before committing" in CLAUDE.md = a suggestion. A PreToolUse hook on Bash that checks for `git commit` = enforced.

## Ordering Multiple Hooks

You can stack hooks on the same event:

```json
{
  "PreToolUse": [
    {
      "matcher": "Bash",
      "hooks": [
        {
          "type": "command",
          "command": "check-push-lint.sh"
        },
        {
          "type": "command",
          "command": "check-push-secrets.sh"
        }
      ]
    }
  ]
}
```

Hooks run in order. First failure blocks the rest.

## What I Use Hooks For

- Lint before push (catches style errors before CI)
- Type-check on edit (immediate feedback on TypeScript errors)
- Tests after component changes (know immediately if something broke)
- `console.log` guard on commit (never ship debug statements)
- Secret scanning on push (last line of defense before remote)
- Notifications on stop (no more watching the terminal)

## When Not to Use Hooks

The real cost isn't latency. A `grep` or `jq` command adds single-digit milliseconds. The cost is pairing a **slow operation with a high-frequency tool call**.

Avoid:

- Pairing heavy operations with broad matchers. Running `tsc --noEmit` on every `Edit` recompiles the full project each time. Scope it to `Bash` and trigger only on `git push`.
- Overly broad matchers. If your hook only cares about `.ts` files, don't match all `Write` calls and filter inside the script. Use the most specific matcher you can.

Lightweight checks (grep, jq, file path tests) are essentially free. Save the heavy tools (tsc, vitest, npm run build) for infrequent triggers like `git push` or `git commit`.

## Wrapping Up

Hooks are the difference between hoping Claude does the right thing and knowing it will.

Your CI catches broken builds. Your hooks catch them before the push. The earlier you catch problems, the cheaper they are to fix.

Define your quality gates once. Let hooks enforce them on every session.

**Further reading:**

- [Teaching Claude Code Your Standards](/posts/teaching-claude-code-your-standards)
- [Building Shareable AI Agent Skills](/posts/building-shareable-ai-agent-skills)
- [Claude Code Hooks documentation](https://code.claude.com/docs/en/hooks)
