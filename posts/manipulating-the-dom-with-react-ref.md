---
title: "Manipulating the DOM with React Ref"
date: "2023-02-21"
excerpt: "Using React ref to manipulate DOM nodes"
---

When you found something like `document.querySelector('.something')` in your React codebase, it's probably a code smell.

To manipulate the DOM you should consider using "ref" - [React Docs - ref](https://beta.reactjs.org/reference/react/useRef#manipulating-the-dom-with-a-ref)

After rendering the DOM element, it will enable the DOM node and its methods to be called.

To ensure the "inputRef.current" will be available at the moment of the trigger "focus()", you can do an "early return" to bail out the effect early, like the following snippet:

```tsx
export default function Page() {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!inputRef.current) {
      return;
    }

    inputRef.current.focus();
  }, []);

  return <input ref={inputRef} type="text" />;
}
```
