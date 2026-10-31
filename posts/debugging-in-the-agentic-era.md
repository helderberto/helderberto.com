---
title: 'Debugging in the Agentic Era'
date: '2026-10-31'
excerpt: "Agents write the code but can't see it run. Browser access through MCP lets them read the console, network, and Core Web Vitals themselves."
---

<!-- TODO: hook. Describe your old loop in 2-3 short paragraphs: the agent writes code, you open DevTools, copy the error, paste it back. You were the eyes. -->

Coding agents write frontend code fast. But they can't see it run. When something breaks, you open DevTools, copy the error, and paste it back into the chat.

You become the translator between the browser and the agent.

## The Shift

<!-- TODO: debugging used to mean you reading the signals. Now the agent reads them, and you judge the result. -->

Debugging used to mean reading the signals yourself: console errors, failed requests, slow paints. In agentic development, the agent can read those signals directly. Your job moves from collecting evidence to judging it.

<!-- TODO: mermaid diagram of the loop, before (agent → you → DevTools → you → agent) and after (agent ↔ Chrome). Needs accTitle/accDescr, then `npm run diagrams`. -->

## Chrome DevTools MCP

<!-- TODO: one paragraph on what it is and a link to MCP. Verify tool names against the current README. -->

[Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp) is an MCP server that lets an agent drive a real Chrome through the DevTools protocol. It sees the same data you see in DevTools.

Because [MCP](https://modelcontextprotocol.io) is an open standard, it isn't tied to one tool. The same server works in Claude Code, Cursor, VS Code with Copilot, Codex, and Gemini CLI.

## Installing It

Most clients take the same config:

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

<!-- TODO: where the config goes in Cursor and VS Code (link to their docs), how to confirm with /mcp, and a first prompt to check it works. -->

## Reading the Console

<!-- TODO: a real story. The error, the prompt you used, what the agent found and fixed without you pasting anything. -->

## Inspecting the Network

<!-- TODO: a real story. A failed request, CORS error, or wrong payload the agent matched against the code. -->

## Measuring Core Web Vitals

<!-- TODO: a real story. A performance trace showing LCP or CLS, the fix, and before/after numbers. -->

## Debugging Becomes Evidence

<!-- TODO: the agent collects traces, screenshots, and numbers, then checks its own fix. Link to /posts/ai-writes-code-you-own-quality. -->

## Limits

<!-- TODO: what you've hit in practice. -->

- It's slower than reading the code when the bug is obvious.
- Traces and logs fill the context window.
- Use a separate Chrome profile so the agent doesn't touch your signed-in sessions.

## Try It

<!-- TODO: restate the takeaway in one or two sentences, plus one prompt readers can paste into any agent. -->
