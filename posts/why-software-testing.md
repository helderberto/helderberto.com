---
title: "Why Software Testing?"
date: "2021-10-17"
excerpt: "Some principles about Software Testing."
---

"It is unthinkable to develop professionally without including tests" - Fabio Vedovelli

## The 5 whys to test the software

1. Confidence to refactor.
2. Confidence to add new features.
3. Confidence to update dependencies.
4. Facilitates understanding of implementation.
5. Works as software documentation.

## What do I need to test?

- Everything that makes sense to test!
- Ask yourself: "Do I need to comment here?", if the answer is "yes", it's better to write a test.

## The most common software testing types

1. Unit Tests
   - Do one thing, and do it well. [The UNIX Philosophy](https://en.wikipedia.org/wiki/Unix_philosophy#Do_One_Thing_and_Do_It_Well)
   - Avoid external dependencies.
   - Most common in the universe of tests.
2. Integration Tests
   - They focus on validating multiple parts of the application work together.
3. End to End (E2E) Tests
   - Normally runs in the browser, you can see the browser working like a real user.
   - You write a simulation-like user behavior.

- This is the most expensive type of test, not in terms of value, but because
  it involves the application running, services responding, and the browser
  running that is heavy.

### The Test Pyramid

![The Test Pyramid](/static/images/test-pyramid.png)

## Resources

- [PT-BR | Aprenda a testar Aplicações Javascript](https://javascript.tv.br/)
