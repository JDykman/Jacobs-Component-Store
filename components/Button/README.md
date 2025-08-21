# Button

A reusable button component for primary and secondary actions.

## Usage

```tsx
import { Button } from './Button';

export function Example() {
  return <Button variant="primary">Click me</Button>;
}
```

## Props

- variant: "primary" | "secondary"
- disabled: boolean
- onClick: () => void

## Notes

Accessible by default. Keyboard and screen reader friendly.