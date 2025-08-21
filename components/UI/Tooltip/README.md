# Tooltip Component

A tooltip component for displaying additional information on hover or focus.

## Features

- Multiple positioning options
- Hover and focus triggers
- Customizable content
- Animation support
- Responsive positioning

## Usage

```jsx
import Tooltip from './Tooltip';

<Tooltip content="This is a helpful tooltip" position="top">
  <Button>Hover me</Button>
</Tooltip>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| content | string/element | - | Tooltip content |
| position | string | 'top' | Tooltip position |
| trigger | string | 'hover' | Trigger method |
| delay | number | 200 | Delay before showing (ms) |
| maxWidth | number | 200 | Maximum tooltip width |
| showArrow | boolean | true | Show positioning arrow |

## Positions

- `top`: Above the trigger element
- `bottom`: Below the trigger element
- `left`: To the left of the trigger element
- `right`: To the right of the trigger element

## Triggers

- `hover`: Show on mouse hover
- `focus`: Show on focus
- `click`: Show on click
- `manual`: Controlled visibility

## Examples

### Basic Tooltip
```jsx
<Tooltip content="Click to save your changes">
  <Button>Save</Button>
</Tooltip>
```

### Positioned Tooltip
```jsx
<Tooltip content="Help information" position="right">
  <Icon name="help" />
</Tooltip>
```

### Custom Content
```jsx
<Tooltip 
  content={
    <div>
      <strong>Important:</strong> This action cannot be undone.
    </div>
  }
  position="bottom"
>
  <Button variant="danger">Delete</Button>
</Tooltip>
```

### Focus Trigger
```jsx
<Tooltip content="Enter your full name" trigger="focus">
  <Input placeholder="Name" />
</Tooltip>
```

### Custom Delay
```jsx
<Tooltip 
  content="This tooltip appears after 1 second"
  delay={1000}
  position="top"
>
  <span>Hover me</span>
</Tooltip>
```

## Accessibility

- Proper ARIA attributes
- Keyboard navigation support
- Screen reader compatibility
- Focus management