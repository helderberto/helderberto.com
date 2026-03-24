---
title: 'AI Writes Code. You Own Quality.'
date: '2026-03-24'
excerpt: 'Engineering skills are what make AI output worth shipping'
---

The more I use AI tools like Claude Code, the clearer it becomes: engineering skills are what make AI output worth shipping.

AI makes writing code faster. But shipping good software still requires the same judgment it always did. Speed without engineering discipline just means shipping bugs faster.

## You Own the Code

AI is a tool in your toolset. Like a compiler, a linter, or a test runner. It doesn't own the code. You do.

When something breaks in production, nobody asks "which AI generated this?" They ask who shipped it. The PR has your name on it. The review was your responsibility. The decision to merge was yours.

AI is a multiplier. If your engineering skills are weak, it multiplies that too.

## What AI Can't Do For You

- **Think about edge cases.** AI covers the happy path. You guide it to the edges.
- **Understand the system.** AI sees the file. You see the architecture.
- **Make tradeoffs.** AI doesn't know your team's priorities, deadlines, or tech debt tolerance.
- **Carry team context.** You were in the meeting where the team decided to deprecate that service. You know the naming conventions, the architectural decisions, the "we tried X and it didn't work" history. AI has none of that unless you provide it.

## Guide AI With Tests

### Red-Green-Refactor

TDD becomes even more powerful with AI. The engineer defines WHAT to test. AI handles the HOW.

**Red.** Write failing tests that cover expected behavior and edge cases:

```tsx
describe('SearchFilter', () => {
  it('renders input with placeholder', () => {
    render(<SearchFilter onSearch={vi.fn()} />);
    expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();
  });

  it('calls onSearch after user stops typing', async () => {
    const onSearch = vi.fn();
    render(<SearchFilter onSearch={onSearch} debounceMs={300} />);

    await userEvent.type(screen.getByRole('searchbox'), 'shoes');

    expect(onSearch).not.toHaveBeenCalled();
    await waitFor(() => expect(onSearch).toHaveBeenCalledWith('shoes'));
  });

  it('does not call onSearch for empty input', async () => {
    const onSearch = vi.fn();
    render(<SearchFilter onSearch={onSearch} debounceMs={300} />);

    await userEvent.type(screen.getByRole('searchbox'), 'a');
    await userEvent.clear(screen.getByRole('searchbox'));

    await waitFor(() => expect(onSearch).not.toHaveBeenCalled());
  });

  it('shows loading spinner while searching', () => {
    render(<SearchFilter onSearch={vi.fn()} isLoading />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('trims whitespace before calling onSearch', async () => {
    const onSearch = vi.fn();
    render(<SearchFilter onSearch={onSearch} debounceMs={300} />);

    await userEvent.type(screen.getByRole('searchbox'), '  shoes  ');
    await waitFor(() => expect(onSearch).toHaveBeenCalledWith('shoes'));
  });
});
```

You wrote zero implementation. But you defined the component's contract, its edge cases, and its behavior. That's engineering.

**Green.** AI implements the minimal code to pass all tests.

**Refactor.** You guide AI to clean up. Extract helpers, apply single responsibility, name things clearly. The goal: make it easy for the next engineer who touches this code.

Without test discipline, AI gives you untested code that "looks right." With TDD, AI works within constraints you defined.

### Cover Entire Flows With E2E Tests

Unit tests verify pieces. E2E tests verify the whole flow works together.

AI can scaffold e2e tests, but you define which flows are critical. A checkout flow, an authentication sequence, a data export pipeline. These are decisions that require understanding the business, not just the code.

```typescript
test('user completes checkout flow', async ({ page }) => {
  await page.goto('/products');
  await page.click('[data-testid="add-to-cart"]');
  await page.click('[data-testid="checkout"]');
  await page.fill('#email', 'test@example.com');
  await page.fill('#card-number', '4242424242424242');
  await page.click('[data-testid="place-order"]');
  await expect(page.locator('.confirmation')).toBeVisible();
});
```

You defined the critical path. AI can fill in the details, add assertions, handle setup/teardown. But the decision of WHAT to test end-to-end is yours. The same applies to edge cases: what happens when payment fails? When the session expires mid-checkout? When the cart is empty? You define those scenarios. AI writes the assertions.

## Enforce Standards Before Code Ships

Standards only matter if they're enforced. Three layers:

**Linting rules.** Create rules that encode team conventions. AI follows them when configured, but you need to know which rules matter for your codebase.

**Git hooks.** Pre-push hooks that run linting and tests. Code that doesn't pass doesn't ship. No exceptions, not even for AI-generated code.

**AI tool hooks.** Tools like Claude Code support [hooks](/posts/claude-code-hooks) that intercept actions and enforce standards automatically. Run lint before every commit. Run tests before every push. The AI operates within guardrails you defined.

The engineer's job: define the guardrails. AI works within them.

## Close the Loop With Verification Tools

Every AI-generated change needs verification. The faster you catch problems, the faster AI can fix them.

Verification feedback loops exist at every level: CI pipelines that run visual regression tests, browser automation that captures screenshots, performance audits that flag regressions. The principle is the same. Every output becomes input for the next iteration.

In my workflow, I use Playwright MCP and Chrome DevTools MCP to close this loop directly inside the AI session:

- Screenshot shows a broken layout? AI fixes the CSS.
- Console error from a missing prop? AI adds the prop.
- Lighthouse audit flags an accessibility issue? AI adds the missing aria label.
- Network tab shows a redundant API call? AI refactors the data fetching.

This turns AI from "generate and hope" into "generate, verify, iterate." The engineer who sets up this loop gets better results than one who just prompts and ships.

The skill isn't writing the code. It's knowing what to verify and how to feed that information back.

## Review AI Output Like You'd Review a Junior's PR

AI-generated code compiles. It passes the tests you wrote. It looks reasonable. But that doesn't mean it's good.

Read the diff. Every line. Look for:

- **Unnecessary complexity.** AI loves abstractions. Does this need a factory pattern, or would a plain function do?
- **Subtle bugs.** Off-by-one errors, missing null checks, race conditions. AI generates plausible code, not provably correct code.
- **Deviations from patterns.** Your codebase uses a specific error handling pattern. AI might invent a different one.
- **Security holes.** Unsanitized input, exposed secrets, missing auth checks. AI doesn't think adversarially by default.

The skill of reading code critically matters more when someone (or something) else writes it. You can't review what you don't understand. Invest in reading code as much as writing it.

## Comment the Why, Not the How

AI tends to over-comment. It explains the obvious:

```typescript
// Loop through the array and filter items
const filtered = items.filter(item => item.active);

// Set the state with filtered items
setItems(filtered);
```

These comments add noise. The code already says HOW it works.

Good comments explain why something exists or what business logic it represents:

```typescript
// Archived items are processed by a nightly batch job, not shown in the UI
const filtered = items.filter(item => item.active);
```

But before writing any comment, ask: can the code explain itself? A well-named function or variable often eliminates the need for a comment entirely. Comments should exist only when the code can't tell the full story on its own.

That's the difference between AI-generated noise and engineering judgment.

## Small Chunks for the Next Engineer

AI generates 500 lines in seconds. Your job: break it into reviewable, understandable pieces.

Extract functions. Apply single responsibility. Name things clearly. The next engineer (or the next AI session) touching this code benefits from clean structure.

This is a human judgment call. AI optimizes for the current prompt. You optimize for the project's lifetime. A function that does one thing well is easier to test, easier to reuse, and easier to replace than a monolith that "works."

Small PRs > big PRs, even when AI writes them.

## Takeaways

1. **You own the code.** AI is a tool, not an excuse. Your name is on the PR.
2. **TDD guides AI.** Write failing tests first, let AI implement, then refactor.
3. **E2E tests catch what unit tests miss.** Define the critical flows and edge cases.
4. **Enforce standards with linting and hooks.** Guardrails before code ships.
5. **Close the loop.** Feed screenshots, errors, and audits back to AI for better iterations.
6. **Review like it's a junior's PR.** Read every line. Question every abstraction.
7. **Comment the why, not the how.** Business context over implementation details.
8. **Small chunks > big dumps.** Break AI output into pieces the next engineer can follow.

## Wrapping Up

AI didn't make engineering skills optional. It made them the differentiator.

AI is a tool. A powerful one. But tools don't ship software, engineers do. Study the fundamentals. Master testing. Understand your architecture. Define your standards. Then use AI to execute at a speed you never could alone.

The code is AI's job. The quality is yours.
