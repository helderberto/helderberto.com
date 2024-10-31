---
title: "Polymorphism with React"
date: "2023-03-04"
excerpt: "Creating a component with a different node depending on the passed props"
---

In this article, we will create an example using Polymorphism in React.

## Acceptance Criteria

- Create a `LinkButton` that render an element `button` or `a` depending on the `href` prop
- The `LinkButton` component has an optional prop called `href`
- If the `href` is provided, the component should render an `a` tag. Otherwise, it should render a `button` tag

## Solving the Problem without Polymorphism

```tsx
export default function LinkButton({ href, children }) {
  if (href) {
    return <a href={href}>{children}</a>;
  }

  return <button>{children}</button>;
}

export default function App() {
  return (
    <>
      <h2>Navigation:</h2>
      <LinkButton>Button</LinkButton>
      <LinkButton href="/products">Link</LinkButton>
    </>
  );
}
```

It solves our problem, but imagine if we need to pass the `rest` of props to the component.

It will involve updating the `button` and the `a`, like the following example:

```tsx
export default function LinkButton({ href, children, ...props }) {
  if (typeof href === "string") {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }

  return <button {...props}>{children}</button>;
}

export default function App() {
  return (
    <>
      <h2>Navigation:</h2>
      <LinkButton>Button</LinkButton>
      <LinkButton href="/products">Link</LinkButton>
    </>
  );
}
```

And for every case you want to add props, you gonna need to maintain both cases, so much work, right?

## Solving the Problem with Polymorphism

Let's create the same example using Polymorphism:

```tsx
export default function LinkButton({ href, children, ...props }) {
  const Tag = typeof href === "string" ? "a" : "button";

  return (
    <Tag href={href} {...props}>
      {children}
    </Tag>
  );
}

export default function App() {
  return (
    <>
      <h2>Navigation:</h2>
      <LinkButton>Button</LinkButton>
      <LinkButton href="/products">Link</LinkButton>
    </>
  );
}
```

You may be asking, and what about the `href` being passed to the `button`?

Since it will be `undefined` React will take control to avoid rendering this property to our HTML.

## Wrapping Up

Keeping this approach in mind, you can create a component that handles the logic you want, and it will be easier to give maintenance.

I hope this tip was useful for you!
