# Modal

A dialog overlay for focused tasks and confirmations.

## Usage

```tsx
import { Modal } from './Modal';

export function Example() {
  return (
    <Modal open>
      <h2>Title</h2>
      <p>Content</p>
    </Modal>
  );
}
```

## Props

- open: boolean
- onClose?: () => void