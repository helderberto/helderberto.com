---
title: 'Debugging in the Agentic Era'
date: '2026-10-31'
excerpt: "Agents write the code but can't see it run. Browser MCP servers let them debug the page, compare a migration against the legacy version, and lock the result in with end-to-end tests."
---

Coding agents write frontend code fast, but they can't see it run. When the page breaks, you open DevTools, copy the error, and paste it back into the chat.

You become the agent's eyes. Browser access through MCP removes that step: the agent reads the browser itself, and you review the result.

```mermaid
flowchart LR
  accTitle: Before and after browser access
  accDescr: Before, the agent writes code, the browser shows an error, and you paste that error back to the agent. After, the agent writes code and reads the browser directly through MCP, with no one in between.
  subgraph Before
    direction TB
    a1[Agent] -- writes code --> b1[Browser]
    b1 -- error --> y1[You]
    y1 -- paste --> a1
  end
  subgraph After
    direction TB
    a2[Agent] -- writes code --> b2[Browser]
    b2 -- MCP --> a2
  end
  Before ~~~ After
```

<!-- TODO: one short real example of the old copy-paste loop, from your own work. -->

## What Chrome DevTools MCP Gives the Agent

[Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp) is Google's MCP server for Chrome. It lets an agent open pages, click, and read the same data you see in DevTools:

- **Console**: errors, warnings, and logs
- **Network**: requests, status codes, and payloads
- **Performance**: traces with Core Web Vitals like LCP and CLS

[MCP](https://modelcontextprotocol.io) is an open standard, so this isn't a Claude Code feature. The same server works in Cursor, VS Code with Copilot, Codex, and Gemini CLI.

## Installing It

Most agents read the same config:

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["chrome-devtools-mcp@latest"]
    }
  }
}
```

In Claude Code, one command adds it:

```bash
claude mcp add chrome-devtools -- npx chrome-devtools-mcp@latest
```

Run `/mcp` to confirm it's connected. Then ask the agent to open your local app and list the console messages.

<!-- TODO: verify the commands against the README. Add where the config file lives in Cursor and VS Code, and the option to attach to a Chrome you already have open. -->

## The Debug Loop

With browser access, every fix follows the same loop. The agent changes the code, reloads the page, and reads the signals. It repeats until they're clean, then hands the fix to you.

```mermaid
flowchart TD
  accTitle: The agent's debug loop
  accDescr: The agent edits the code, reloads the page, and reads the console, network, and performance trace. If problems remain, it edits again. When the signals are clean, you review the fix.
  edit[Agent edits code] --> reload[Reload page] --> read[Read console, network, trace]
  read --> clean{Signals clean?}
  clean -- no --> edit
  clean -- yes --> review[You review the fix]
```

The next three sections show the loop with each signal.

### Console Errors

<!-- TODO: a real story. The error, the prompt you used, and what the agent found and fixed without you pasting anything. -->

### Network Requests

<!-- TODO: a real story. A failed request, CORS error, or wrong payload the agent matched against the code. -->

### Core Web Vitals

<!-- TODO: a real story. The trace, the LCP or CLS problem, the fix, and before/after numbers. -->

## Validating a Migration

The same tools catch the worst migration bug: a new page that looks almost like the old one. The agent can open both versions and compare them, instead of you clicking through each page by hand.

### Start with a Contract

Before the agent touches the code, write down what must stay the same. This is the contract, and every check after it tests against it.

```markdown
## Contract: /checkout

- Same visible text and layout at 390px and 1280px
- Same API requests, in the same order, with the same payloads
- No new console errors or warnings
- LCP and CLS no worse than the legacy page
- Every action reachable with the keyboard
```

The idea is the same as in [MigFlow](/posts/migflow-contracts-for-ai-migrations): agents need a contract, not a tutorial.

### Compare Legacy and New

With Chrome DevTools MCP, the agent opens the legacy and new pages at the same viewport. It compares screenshots, console messages, network requests, and Core Web Vitals, then fixes the new page until the contract holds.

```mermaid
flowchart TD
  accTitle: Validating a migration
  accDescr: Write the contract first. The agent compares the legacy and new pages with Chrome DevTools MCP. If the contract doesn't hold, it fixes the new page and compares again. When it holds, Playwright end-to-end tests lock the contract in.
  contract[Write the contract] --> compare[Compare legacy and new]
  compare --> holds{Contract holds?}
  holds -- no --> fix[Fix the new page]
  fix --> compare
  holds -- yes --> tests[Lock in with e2e tests]
```

<!-- TODO: a real migration from your work. What differed between the pages, and did the agent catch it? -->

### Lock It In with End-to-End Tests

A comparison proves the migration once. Tests keep it true after the agent is gone.

With [Playwright MCP](https://github.com/microsoft/playwright-mcp), the agent walks through the page in a real browser and writes Playwright tests from the contract. Each line in the contract becomes at least one test that runs in CI.

Screenshots compared by the agent are a judgment call. Playwright's `toHaveScreenshot()` makes them a pixel diff, so visual regressions fail the build.

<!-- TODO: a short example test from one contract line, e.g. the API requests or the screenshot check. -->

## Chrome DevTools MCP or Playwright MCP?

Use both, for different jobs. Chrome DevTools MCP is for looking inside one page: debugging, comparing, and measuring. Playwright MCP is for tests you can rerun, including in Firefox and Safari.

```mermaid
flowchart TD
  accTitle: Choosing a browser MCP server
  accDescr: To debug, compare pages, or measure performance in Chrome, use Chrome DevTools MCP. To write end-to-end tests or check Firefox and Safari, use Playwright MCP.
  need{What do you need?}
  need -- "debug, compare,<br>measure" --> devtools[Chrome DevTools MCP]
  need -- "e2e tests,<br>other browsers" --> playwright[Playwright MCP]
```

## Limits

- It's slower than reading the code when the bug is obvious.
- Traces and logs fill the context window, so ask for the specific signal you need.
- The agent can read cookies and local storage. Use a separate Chrome profile, not the one with your accounts.

<!-- TODO: anything else you've hit in practice. -->

## Try It

The agent no longer needs you to read the browser for it. Your job is to judge what it finds.

Start with one prompt in any agent: "Open localhost:3000, list the console errors, and fix them."

Migrating a page? Write the contract first, then ask: "Compare the legacy and new pages against this contract, and write Playwright tests for each line."

<!-- TODO: tie back to /posts/ai-writes-code-you-own-quality in one sentence. -->
