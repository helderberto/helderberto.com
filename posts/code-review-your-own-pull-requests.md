---
title: "Code Review your Own Pull Requests"
date: "2024-11-08"
excerpt: "Discover how self-reviewing your pull requests can elevate code quality, catch overlooked issues, and streamline the development process."
---

As engineers, we often consider our job done after opening a pull request and asking for people to do the review.

However, a common practice among the best developers I work(ed) with is reviewing their own pull requests before seeking input from others. This self-review process can significantly enhance code quality and streamline your line of thought.

## Why Should You Review Your Own Code?

After immersing yourself in a task for an extended period of time, it’s easy to lose track on the broader context of your code changes. While tests provide helpful feedback (I know you write tests, hm?) they may not catch everything. A thorough self-review can:

- Improve code quality
- Catch overlooked issues
- Enhance documentation
- Streamline your line of thought for others

## Benefits of Self-Review

### Fresh Perspective

Taking a step back allows you to view your code with fresh eyes, often revealing areas for improvement.

### Consistency Check

Ensure your changes align with the company standards and best practices.

### Documentation Improvement

Identify areas where additional comments or documentation would be beneficial.

### Optimization Opportunities

Spot potential performance improvements or code simplifications by applying concepts like DRY or KISS.

## Annotating Crucial Parts

When reviewing your own pull request, leave comments to guide future reviewers:

1. **Explain new Dependencies**: When adding a new library, comment on its purpose and the specific problems it solves. Avoid introducing dependencies without clear justification.
2. **Highlight Workarounds**: If you’ve implemented a workaround, explain the reasons and invite suggestions for better solutions.
3. **Provide Context**: Offer insights into complex logic or design decisions that might not be immediately evident.
4. **Categorize Comments**: Use labels to categorize your annotations. For example:
   - **Workaround**: “I aligned this element to the right to handle the XYZ use case.”
   - **Annotation**: “This mapper aggregates API response values before submitting.”
   - **Question**: “Is there a more efficient way to handle this edge case?”
   - **TODO**: “Need to refactor this section in the future, I’ll address it in a follow-up ticket.”

## Best Practices for Self-Review

**Wait Before Reviewing**
Give yourself some time away from the code before reviewing it. This helps in gaining a fresh perspective.

**Use Code Review Tools**
If you can use AI tools, take advantage of that to gain a different perspective on your own code.

**Run the Code**
Please don't just read it; run the code and test the changes in an environment that provides meaningful data and can be closer to the end-user behavior.

**Check for Edge Cases**
Consider various scenarios and ensure that the code works when errors are received. Also, consider what happens if network requests are blocked in your browser and how the code handles the errors.

**Review the Diff**
Double-check the changes in the context of the entire file, not just the lines you’ve modified.

## Wrapping Up

Self-reviewing your code is a powerful practice that can significantly improve your code quality and streamline the review process.

By taking the time to annotate crucial parts, explain decisions, and highlight potential areas of concern, you not only make life easier for your reviewers but also catch issues early.

This habit fosters a culture of thoughtful coding and continuous improvement. Remember, the best code is not just functional-it’s also clear, well-documented, and ready for collaboration.
