---
title: "Code Got Cheap. Review Didn't."
date: '2026-05-14'
excerpt: 'AI-assisted development turned the human checkpoint into the most expensive part of shipping software. The teams that win are the ones who stop optimizing for code and start optimizing for attention.'
---

Across the engineering teams I've been part of over the years, there's always some version of the same ritual, usually unnamed. Every Monday, someone posts in Slack: "anyone reviewing my PR?" Then another. Then three more. By Wednesday, the channel is a graveyard of unblocked work.

And half the comments, when they finally come, are the same comments from the week before: "extract this", "rename that", "missing test for the null case", "don't use `any`".

These aren't insights. They're rules. They could live in an `AGENTS.md`, a linter config, an AI reviewer like Copilot. Sometimes they do. Often they live in senior engineers' heads, surfacing one PR at a time, with their morning attention.

PR backlogs and repeated review comments aren't new. They've been a quiet drag on engineering teams for as long as pull requests have existed. What's new is that AI-assisted development has made the problem impossible to ignore.

## The shift nobody priced in

Imagine a factory that finds a way to produce ten times more units per hour. The inspection line stays the same. By the end of the week, the inspection bench is the bottleneck for the entire factory. Production keeps accelerating; inspection can't.

That's what happened to software in the last two years. Writing code got dramatically faster. Reviewing code did not.

The ratio inverted. Writing a hundred lines used to take hours of thinking, designing, testing. Reviewing those hundred lines took maybe forty minutes.

Now writing those same hundred lines can take ten minutes: the AI drafts, the engineer guides. Reviewing them still takes forty minutes, because human cognition is the same human cognition.

This isn't a temporary calibration problem. It's a permanent change in the economics of building software, and most teams haven't updated their process for it.

## Why "just add AI to review too" makes it worse

The intuitive fix is symmetric: if AI helps write, let AI help review. The problem is that this creates a new failure mode: two systems with similar blind spots agreeing with each other.

AI reviewing AI-generated code is useful for the obvious things: missing tests, drift from project conventions, surface-level security patterns, dead code. Worth doing. Don't confuse it with judgment.

What AI reviewers cannot do:

- Decide whether the feature should exist at all
- Catch "code that works but solves the wrong problem"
- Evaluate cross-system implications
- Tell whether a test tests something meaningful, or just exercises lines
- Understand the unwritten conventions that live in someone's head, not in a doc

The trap isn't AI review itself. The trap is letting AI review create false confidence, and then merging at the speed AI can generate. Plausible code shipping faster than anyone can question it is worse than slow shipping.

## Use AI as your thinking partner, not your replacement

There's a third use of AI in review that often gets missed. Not AI writing the code. Not AI auto-flagging issues before a human sees the PR. AI as the reviewer's private rehearsal partner.

When I'm reviewing a PR and something feels off but I can't yet articulate why, I paste the diff into an AI chat and think out loud: "is this naming inconsistent with the rest of the file?" or "could this error-handling pattern hide a race condition?"

The AI doesn't decide. It helps me turn a hunch into a comment that lands.

Pairing with AI this way is a conversation with my own taste for code. The AI mirrors back what I half-noticed and lets me decide if it holds up.

Letting an agent run the review is the opposite: it forms the opinion, I rubber-stamp. One builds my judgment over time. The other quietly outsources it.

The author never sees this exchange. It happens in the reviewer's private workspace, the same way a senior engineer might walk over to a peer and ask "tell me if this looks fishy."

AI is faster, available at any hour, and doesn't tire by the fifth PR of the day.

This is the use of AI that amplifies human review instead of replacing it. My reasoning gets sharper. The comments get clearer, so the author learns the _why_ behind the change, not just the _what_.

Both sides come out of the review smarter, and the human attention that drives it stays human, which is what matters.

## The real scarce resource

The scarce resource in AI-assisted development is **human attention of high quality**. Not tools. Not engineering talent. Not even raw time.

Every process decision around code review should be evaluated by a single test: does this protect attention, or fragment it?

- A linter rule that auto-rejects bad formatting protects attention. The reviewer never has to think about it.
- A Slack notification for every PR comment fragments attention. The reviewer breaks flow, loses depth, returns shallower than before.
- AI pre-review protects attention when it filters trivialities. It fragments attention when it generates so many low-signal comments that the reviewer reads past everything.
- A two-day review SLA protects attention when it batches the work. It fragments attention when it turns into anxiety pressure.

Treat attention as the budget you're allocating. Code is the artifact. Attention is the currency.

## Move the rules out of human heads

Repeated review comments are a symptom of missing written conventions. Look at the Slack graveyard from the opening: "use the existing util", "we never throw raw errors", "this naming doesn't match our convention".

Those weren't reviewer insights. They were rules the team already knew, with no durable place to live.

`AGENTS.md`, `CLAUDE.md`, ESLint configs, custom Copilot instructions, project-specific review bots. These are the places those rules belong.

Once a rule lives there, two things happen. The AI writing the code already knows it, so the rule rarely gets violated in the first place. And when it is violated, the AI review catches it before a human ever sees the PR.

The discipline is simple: every time a senior engineer types the same review comment for the third time, that comment is a bug in the project's written conventions, not a useful review. Fix the convention. Stop typing the comment.

Most teams underuse this lever by an order of magnitude. They treat repeated review comments as part of the job, instead of a signal that institutional knowledge is leaking out of the team and into individual reviewers' Mondays.

## Triage by risk, not by author urgency

Most teams treat every pull request with the same level of scrutiny. A CSS tweak and a payments migration are not the same review. Authors will always feel their own PR is urgent. That's not a useful signal. Risk is.

A simple split that works:

- **Trivial**: copy, config, dependency bumps, isolated styling. AI pre-review plus a light human pass. Same day.
- **Standard**: most feature work, refactors inside one module. AI pre-review plus one human reviewer who knows the area. One business day.
- **High-risk**: auth, billing, migrations, anything irreversible. AI pre-review plus two humans. Architecture discussed before code lands. Two business days, and that's fine.
- **Architectural**: touches multiple services or changes a contract. No PR until a written proposal lands first. The PR ratifies a decision, doesn't make one.

The shift here isn't about adding ceremony. It's about removing ceremony where it's wasteful, so the high-risk PRs get the attention they deserve.

## Reviewers need depth, not interruptions

Most engineering organizations get this backwards. Reviewers in interrupt-driven mode (Slack pinging, GitHub notifications, "got a sec?" walk-ins) deliver shallow reviews. They miss the race condition. They catch the typo. They approve to clear the queue.

The fix is unsexy: blocked time. Two dedicated windows per day, sixty to ninety minutes each. Notifications muted outside those windows.

The reviewer batches three or four PRs in a single block with depth, instead of context-switching into ten PRs across a fragmented day.

Math sanity check: a team of six engineers producing two PRs per day generates about twelve reviews to distribute. That's two PRs per person, totaling thirty to sixty minutes of real review.

A ninety-minute block absorbs that comfortably and leaves room for the PRs that need deeper thought.

The cost of _not_ doing this is invisible: reviews look fast, but the bugs that escape, the architectural drift, the senior engineers quietly burning out. Those don't show up on a cycle-time dashboard.

## The cultural shift nobody talks about

All of the above collapses if review is still treated as a favor.

In most engineering cultures, shipping is the deliverable. Review is the tax you pay between writing your own code.

Performance reviews count features built, not bugs prevented, not knowledge transferred during a thoughtful review, not the design conversation that stopped a bad abstraction before it spread.

That has to change.

Review needs to be a first-class deliverable. It shows up in one-on-ones. It shows up in performance reviews.

The engineer who consistently catches the subtle bug in someone else's payment flow is doing more for the team than the engineer who shipped three features and merged them all on green CI.

Until the incentive structure recognizes this, every process change above is theater. People do what gets rewarded, and most companies still reward output, not attention to others' output.

A small move that signals the shift: at the start of each quarter, every engineer names what they want to be better at as a reviewer, and that becomes a tracked goal.

Not "review more PRs." Specifically: "catch more state-management bugs before they merge." "Push back more on premature abstraction." "Review the migration tier I usually avoid."

Suddenly review is craft, not chore.

## Who wins this era

The team that wins the AI-assisted development era is not the team that produces the most code. Code is no longer the scarce thing.

The team that wins is the one that protects attention best. They figured out that AI multiplied output, but attention is still a finite human resource. They didn't bolt AI onto both ends of the pipeline and call it done.

They paired with AI to amplify their own judgment, not outsource it. They moved their rules into `AGENTS.md` so the same comment never gets typed twice. They triaged review by risk instead of by author urgency. They blocked time for depth. They made review a deliverable, not a favor.

Everyone else will keep typing the same review comment for the seventh time this month, while the AI churns out plausible code faster than anyone can question it.

Attention is the scarce resource, not code. The teams that internalize that will pull ahead.
