# Input

A text input with label and validation states.

## Usage

```tsx
import { Input } from './Input';

export function Example() {
  return <Input label="Email" placeholder="you@example.com" />;
}
```

## Props

- label: string
- placeholder?: string
- value?: string
- onChange?: (value: string) => void