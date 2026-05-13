---
title: 'MigFlow: Contracts for AI Migrations'
date: '2026-05-12'
excerpt: 'Every migration I asked an AI agent to run came out different. The fix was not a better prompt. It was a contract: structured playbooks that read the same way whether a human or an agent runs them.'
---

I asked Claude to migrate a few Enzyme tests to React Testing Library. It worked. I ran the same prompt on a different file and got a different result: different imports, different cleanup, different assertions for the same behavior.

That is the migration problem. Not the model. Not the prompt. Something is missing in between.

## Why AI Migrations Drift

On paper, code migrations look like ideal agent work: mechanical, repetitive, well-documented. In practice three things keep biting:

1. **Docs are written for humans.** Narrative, context, exceptions. A human reader fills the gaps with judgement. An agent fills them with guesses.

2. **Prompts drift.** "Migrate this Enzyme test to RTL" gets a plausible answer, never the same answer twice. Without explicit constraints, every run is a new interpretation.

3. **There is no verification step.** The agent finishes, declares success, moves on. Whether the result meets the team's standards lands on a human reviewer.

I kept patching this with longer prompts and more context. It improved individual sessions. It did nothing for the next one.

If you have not felt this yet, the trigger is scale. Migrating 5 files by hand is fast. Migrating 500 with an agent is also fast, until you reconcile 500 plausible-but-different outputs. The cost is not the migration. It is the variance across it. And the variance does not show up in the PR you are reviewing today. It shows up six months later, when a new engineer reads three files migrated the same week and finds three different idioms.

## Migrations Need Contracts, Not Tutorials

That sentence is the whole reframe.

A tutorial optimizes for understanding: it tells a story, fills in why, hopes the reader internalizes the rest. A contract optimizes for execution: do these transformations, do not leave these patterns behind, verify these conditions before declaring done.

Humans can run on tutorials because they bring judgement. Agents cannot. Agents need contracts.

That is the entire premise of [MigFlow](https://migflow.dev): every migration becomes a structured playbook that an agent (or a human) can execute the same way, every time. The source is on [GitHub](https://github.com/helderberto/migflow).

## What a Playbook Looks Like

Every playbook has the same nine sections:

1. **Philosophy shift**: the mental model change in one paragraph
2. **Setup**: exact install / uninstall commands
3. **Core transformations**: real before/after pairs
4. **When NOT to migrate**: explicit anti-cases
5. **Pitfalls**: known gotchas with workarounds
6. **Validation checklist**: yes/no questions the agent can answer
7. **Codemod references**: automated tools where they exist
8. **AI Prompt**: a ready-to-run prompt that includes the playbook
9. **References**: authoritative docs

The structure is rigid on purpose. The Enzyme → RTL playbook has the same shape as CommonJS → ESM. Different content, same contract.

The core of every playbook is a before/after pair. For Enzyme → RTL, it looks like this:

```jsx
// Before: Enzyme
const wrapper = shallow(<Button onClick={handleClick} />);
wrapper.find('button').simulate('click');
expect(handleClick).toHaveBeenCalled();

// After: React Testing Library
render(<Button onClick={handleClick} />);
await userEvent.click(screen.getByRole('button'));
expect(handleClick).toHaveBeenCalled();
```

The agent does not have to guess what "idiomatic RTL" means. The pair shows it. And the validation checklist closes the loop:

```markdown
## Validation checklist

- [ ] No `enzyme` or `enzyme-adapter-*` imports remain
- [ ] No `shallow()` or `mount()` calls
- [ ] All assertions use `screen.*` queries
- [ ] `user-event` used over `fireEvent` for interaction tests
- [ ] No snapshot of rendered HTML
```

The agent does not declare done. The checklist does.

## Three Channels for Agents, One Click for Humans

The same playbooks are exposed three different ways for machines, plus a browsable site for humans:

| Channel | Endpoint | Use case |
|---|---|---|
| **MCP** (Model Context Protocol, the standard for plugging tools into AI assistants) | `/api/mcp` | Native integration for Claude Code, Claude Desktop, Cursor, Windsurf, any MCP-compatible client |
| **JSON API** | `/playbooks.json`, `/playbooks/<slug>.json` | Scripts, CI pipelines, anything that speaks HTTP |
| **llms.txt** (a small text file convention for telling AI tools what your site contains) | `/llms.txt` | Retrieval systems, ChatGPT context loaders, llmstxt.org-aware tools |

Over MCP, the agent can call `list_playbooks`, `get_playbook`, or `search_playbooks` as if they were built-in tools. No copy-paste, no scraping. It calls `get_playbook("enzyme-to-rtl")` and gets the structured content directly.

For humans, every detail page has one-click buttons: copy for Claude, copy for Gemini, copy as raw markdown. Same content the agent would see. The only difference is the wrapper.

## Design Principles

Three ideas drive every decision:

- **Deterministic over clever.** A boring, predictable playbook beats a creative one every time.
- **Explicit over implicit.** If a constraint is not in the validation checklist, an agent will not enforce it.
- **Real examples over abstractions.** Before/after pairs are the contract. Diagrams are decoration.

What this means in practice: MigFlow is not a prompt collection (prompts without structure decay across sessions), not human-only documentation (the machine channels are first-class, not afterthoughts), and not theoretical (every playbook has been used to migrate real code).

## How to Use It

The fastest path: open [migflow.dev](https://migflow.dev), find your migration, click "Copy for Claude Code", paste into your agent. The full playbook lands in context.

For repeated use, point your MCP client at `https://migflow.dev/api/mcp`. Your agent can then list, fetch, and search playbooks as first-class tools. No copy-paste needed.

For CI and automation, hit the JSON endpoints. Every playbook also carries `prompts.claude` and `prompts.gemini` fields pre-formatted for direct use.

### Contribute a playbook

The `/submit` page on the site asks for the metadata, lets you fill in the nine sections, and opens a pre-filled GitHub PR. You review it like any other contribution.

The PR checklist is the same one agents use: nine sections present, real before/after examples, concrete validation items, an AI Prompt that runs end-to-end. If you can copy your playbook into Claude Code and it migrates a file correctly, the playbook is ready.

The repository is [github.com/helderberto/migflow](https://github.com/helderberto/migflow). Issues, ideas, and "this playbook would have saved me three days" stories are all welcome.

## Wrapping Up

> A migration is a contract, not a tutorial.

Structure beats discipline. Asking an agent to migrate code without a contract is asking it to be disciplined on your behalf. It will not be. None of us are, every time.

MigFlow is the contract. The agent does the work.

AI tooling will keep evolving. The need for deterministic, structured contracts between humans, agents, and code will not.

---

**Related:**

- [AI Writes Code. You Own Quality.](/posts/ai-writes-code-you-own-quality)
- [Skills Are the New CLI](/posts/skills-are-the-new-cli)
- [Teaching Claude Code Your Standards](/posts/teaching-claude-code-your-standards)
