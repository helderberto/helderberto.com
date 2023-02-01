---
title: Controlled vs Uncontrolled Elements
date: '2023-02-01'
tags: ['reactjs', 'javascript']
summary: What do controlled and uncontrolled elements mean?
---

When working with React, you will notice often used naming called "Controlled" and "Uncontrolled".

So, what does it means? Let's dive into it.

## Uncontrolled Element

In the React world, a controlled element is an element that is managed by React.

Let's check the following example:

```js
function Input() {
  const [name, setName] = React.useState();

  return (
    <input
      value={name},
      onChange={(event) => setName(event.target.value)}
    />
  );
}
```

Because you don't set an initial value, when the user starts typing on the input, it will show a warning in the console tab of your browser, like:

```
Warning: A component is changing an uncontrolled input to be controlled.
```

**Why is this happening?**

The default value of the state is an `undefined` value. On rendering the `input` element will be considered an `uncontrolled` element.

## Controlled Element

Using the same example, let's move it to a controlled element.

```js
function Input() {
  const [name, setName] = React.useState(''); // Start as an empty string

  return (
    <input
      value={name},
      onChange={(event) => setName(event.target.value)}
    />
  );
}
```

Since you set it as an empty string, it will be a controlled element.

When the user starts typing in the input, the `onChange` event updates the value of `name` from `''` to a new string.

## Wrapping Up

It's a common mistake updating `uncontrolled` elements to `controlled` raising this kind of warning.

When you understand how it works, it's easier to avoid these issues.
