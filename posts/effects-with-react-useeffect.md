---
title: "Effects with React useEffect"
date: "2023-02-21"
excerpt: "Understanding React useEffect with practical examples"
---

Some practical examples of how to use the [React useEffect()](https://beta.reactjs.org/reference/react/useEffect) -

```tsx
export default function App() {
  const [name, setName] = React.useState("");
  const [age, setAge] = React.useState(0);

  React.useEffect(() => {
    console.log("component mounted");

    return () => {
      console.log("component unmounted");
    };
  }, []); // empty array means it will only run on mounting

  // Separation of concerns
  // This is a good example of how to separate concerns splitting into two useEffects to handle each value
  React.useEffect(() => {
    console.log("name changed", name);
  }, [name]); // only triggers when name changes

  React.useEffect(() => {
    console.log("age changed", age);
  }, [age]); // only triggers when age changes

  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="number"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />
    </div>
  );
}
```

## On Mounting

Similar to the legacy `componentDidMount` it will trigger on mounting the component:

```ts
React.useEffect(() => {
  console.log("component mounted");

  return () => {
    console.log("component unmounted");
  };
}, []); // empty array means it will only run on mounting
```

## On Changing Values

```ts
React.useEffect(() => {
  console.log("name changed", name);
}, [name]); // only triggers when name changes
```

## Separation of Concerns

Instead of watching two values at the same useEffect, like the following:

```ts
React.useEffect(() => {
  console.log({ name, age });
}, [name, age]);
```

Think in separation of concerns, and split each it will be cleaner and easier for the next person who need to read your code, eg:

```ts
// Separation of concerns
// This is a good example of how to separate concerns splitting into two useEffects to handle each value
React.useEffect(() => {
  console.log("name changed", name);
}, [name]); // only triggers when name changes

React.useEffect(() => {
  console.log("age changed", age);
}, [age]); // only triggers when age changes
```
