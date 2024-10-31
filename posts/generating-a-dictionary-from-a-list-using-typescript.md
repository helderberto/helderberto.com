---
title: "Generating a Dictionary from a List using TypeScript"
date: "2021-11-02"
excerpt: "In this article, I will show you how to generate a dictionary from a list and use TypeScript Generics to help us."
---

On this article, I will show you how to generate a dictionary from a list and use
TypeScript Generics to help us.

First, I will show you the example in JavaScript, just for you to understand the issues we can avoid with the TypeScript implementation.

## JavaScript implementation of the method

Let's create our implementation using just pure JavaScript to map values from our
list to a dictionary.

```js
export function listToDict(list, idGen) {
  const dict = {};

  list.forEach((element) => {
    const dictKey = idGen(element);
    dict[dictKey] = element;
  });

  return dict;
}
```

When passes a list as example it will returns:

```js
const pets = [
  { name: "Zelda", age: 2 },
  { name: "Link", age: 4 },
];
const dict = listToDict(pets, (item) => item.name);
console.log(dict);
// => { { Zelda: { name: 'Zelda', age: 2 } }, { Link: { name: 'Link', age: 4 } } }
```

For now, everything is fine, but notice a thing when you try to execute with a non-existent key:

```ts
const pets = [
  { name: "Zelda", age: 2 },
  { name: "Link", age: 4 },
];
const dict = listToDict(pets, (item) => item.something); // => Focus here
```

With our implementation, we don't have any control of the keys that exist or not in the `list`, and maybe you will just catch this issue in the execution time or your test cases.

The point I want to show you is that it can be avoided in the development with TypeScript.

## TypeScript implementation of the method

In the following example, we will use [TypeScript - Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html) to control in a more flexible way the values we receive and return.

```ts
function listToDict<T>(
  list: T[],
  idGen: (arg: T) => string
): { [key: string]: T } {
  const dict: { [key: string]: T } = {};

  list.forEach((element) => {
    const dictKey = idGen(element);
    dict[dictKey] = element;
  });

  return dict;
}
```

I will split the code part by part to explain to you the usage of Generics to help us here.

1. Argument `T` to receive a generic value and pass to our list, idGen `arg` and return object followed by the generic value.
2. Create the empty object `dict` based on the structure `key: T`.
3. Returns dictionary mapped by the key extracted from the list as we passed before.

If you have the autocomplete configured in your editor of preference, you will receive the keys available to map your dictionary, such as:

```ts
const pets = [
  { name: 'Zelda', age: 2 },
  { name: 'Link', age: 4 },
];
const dict = listToDict(pets, (item) => item.<WILL SHOW PROPERTIES FROM THE OBJECT);
```

If you try the example with an inexistent key, you will receive an error:

```ts
const pets = [
  { name: "Zelda", age: 2 },
  { name: "Link", age: 4 },
];
const dict = listToDict(pets, (item) => item.something); // => It will returns 'undefined' but will throws an error.
```
