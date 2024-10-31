---
title: "ReactJS Tips & Tricks: Avoid Nested Render Functions"
date: "2021-11-10"
excerpt: "Avoid Nested Render Functions."
---

## ReactJS Tips & Tricks (Series)

1. [ReactJS Tips & Tricks: Avoid Short-Circuit Conditional UI Rendering](/reactjs-tips-tricks-avoid-shortcircuit-conditional-ui-rendering)
2. [ReactJS Tips & Tricks: Avoid Nested Render Functions](/reactjs-tips-tricks-avoid-nested-render-functions)

---

A common thing I noticed in a lot of projects I worked on is the `Nested Render Functions` approach to render UI elements.

Let's dive into this approach and how to change in a better way.

## What are Nested Render Functions?

Basically, it is when you declare a part of UI render in a function inside of a component, such as:

```tsx
export default function Wrapper() {
  function renderSection() {
    return <section>A section under a React component.</section>;
  }

  return <div>{renderSection()}</div>;
}
```

Since components are just functions, it is the same as declaring new components inside the current `Component`.

## Extracting to a New Component

It is much better to extract to a new component, it will help you to create unit tests more easily and isolated to the component.

Let's re-create the example I mentioned before, like the following:

```tsx
function Section() {
  return <section>A section under a method.</section>;
}

export default function Wrapper() {
  return (
    <div>
      <Section />
    </div>
  );
}
```

Instead of using closures, now you have a pure function for `Section` component, that's more readable and easy to give their props.

## Wrapping Up

With this approach, you will create more deterministic components taking the benefit of React pure component.

It will help you to test the component and create isolated behavior for every component.
