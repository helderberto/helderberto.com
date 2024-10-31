---
title: "A Complete Guide to React Hooks"
date: "2024-03-26"
excerpt: "Learn how to use React Hooks effectively with practical examples"
---

# A Complete Guide to React Hooks

React Hooks revolutionized how we write React components. Let's explore the most commonly used hooks with practical examples.

## useState Hook

The useState hook is used for managing local state in functional components:

```typescript
const Button = () => {
  const [count, setCount] = useState(0);
  const [isActive, setIsActive] = useState(false);

  return (
    <button
      className={isActive ? "active" : ""}
      onClick={() => {
        setCount(count + 1);
        setIsActive(!isActive);
      }}
    >
      Clicked {count} times
    </button>
  );
};
```

## useEffect Hook

The useEffect hook handles side effects in your components:

```typescript
const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
};
```

## useRef Hook

The useRef hook is perfect for maintaining mutable values that don't trigger re-renders:

```typescript
const AutoFocusInput = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus the input element when component mounts
    inputRef.current?.focus();
  }, []);

  return <input ref={inputRef} placeholder="I'll focus automatically" />;
};
```

## useMemo Hook

Use useMemo for expensive calculations to optimize performance:

```typescript
const ExpensiveCalculation = ({ numbers }) => {
  const sum = useMemo(() => {
    console.log("Calculating sum...");
    return numbers.reduce((acc, curr) => acc + curr, 0);
  }, [numbers]);

  return <div>Sum: {sum}</div>;
};
```

## useCallback Hook

useCallback is useful for memoizing functions:

```typescript
const ParentComponent = () => {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    setCount((c) => c + 1);
  }, []); // Empty deps array since we're using functional update

  return (
    <div>
      <ChildComponent onClick={handleClick} />
      <div>Count: {count}</div>
    </div>
  );
};
```

## Custom Hooks

You can create your own hooks to reuse stateful logic:

```typescript
const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
};
```
