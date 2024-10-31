---
title: "ReactJS Tips & Tricks: Avoid Short-Circuit Conditional UI Rendering"
date: "2021-11-07"
excerpt: "Avoid Short-Circuit Conditional UI Rendering."
---

## ReactJS Tips & Tricks (Series)

1. [ReactJS Tips & Tricks: Avoid Short-Circuit Conditional UI Rendering](/reactjs-tips-tricks-avoid-shortcircuit-conditional-ui-rendering)
2. [ReactJS Tips & Tricks: Avoid Nested Render Functions](/reactjs-tips-tricks-avoid-nested-render-functions)

---

The goal of this articles is to share with you some insights that I have learned
over the last few years that I have been working with ReactJS.

I will start with a common one that is called **Short-Circuit Conditional** unexpected UI rendering.

## What is a Short-Circuit conditional?

This conditional is a concise way to render UI components.

Example of the **Short-Circuit conditional** approach:

```tsx
export default function ShortCircuit({ number = 0 }) {
  return number && <div>Current: {number}</div>;
}
```

The component I mentioned before will backfire a `0`.

## Why does it render zero instead of the empty UI?

The comparison operators in JavaScript don't return boolean values, they return one of the compared values.

In the case mentioned above, when we check the `number` value it will render `zero`.

## How to avoid the unexpected UI rendering

The way to avoid this issue is using the **ternary comparison** to be explicit about what will return in both scenarios.

Fixing the `Component` using the **ternary comparison** such as:

```tsx
export default function TernaryComponent({ number = 0 }) {
  return number ? <div>Current: {number}</div> : null;
}
```

Considering the value of `number` variable is zero, it will return `null` that is the second option from the ternary on this case React won't render because it is a `null` value.

## Wrapping Up

If you think this series of articles is helpful to you, or do you want to discuss some programming topics, feel free to reach out to me at @helderberto.

Thanks! ⚡️
