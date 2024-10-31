---
title: "Controlled vs Uncontrolled Elements"
date: "2023-02-01"
excerpt: "What do controlled and uncontrolled elements mean?"
---

When working with React, you will notice often used naming called _Controlled_ and _Uncontrolled_.

So, what do it mean? Let's dive into it.

## Uncontrolled Element

This type of element is not managed by React.

In the following example, you have an uncontrolled input element:

```tsx
export default function UncontrolledInput() {
  return <input value="Empty Value" />;
}
```

Notice the component isn't doing anything, just printing an empty value `Empty value`.

You can't update, nor delete the value.

Let's add an event handler for updating the value state:

```tsx
export default function UncontrolledInput() {
  const [value, setValue] = React.useState();

  return (
    <>
      <input value={value} onChange={(event) => setValue(event.target.value)} />
      <p>Current value: {value}</p>
    </>
  );
}
```

Notice that even if we can update the input now, you have a warning on your browser console. Like the following:

> Warning: A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component.

### Why is this happening?

Since the default value is not initialized in the `useState()`, React will consider the initial value as `undefined`, so it means the input still uncontrolled at the first render.

It only will be controlled when the user starts typing on the input.

## Controlled Element

The Controlled element is an element that is managed the event and values by React.

Let's create an input managed by React:

```tsx
export default function ControlledInput() {
  const [value, setValue] = React.useState(""); // Start as an empty string

  return (
    <>
      <input value={value} onChange={(event) => setValue(event.target.value)} />
      <p>Current name: {value}</p>
    </>
  );
}
```

Since you set it as an empty string, it will be a controlled element.

When the user starts typing in the input, the `onChange` event updates the value of _name_ from `''` to a new string.

## Wrapping Up

It's a common mistake updating `uncontrolled` elements to `controlled` raising this kind of warning.

When you understand how it works, it's easier to avoid these issues.
