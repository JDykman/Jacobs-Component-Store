# Button Component

A versatile button component with multiple variants and states for user interactions.

## Features

- Multiple button variants (primary, secondary, outline, ghost)
- Different sizes (small, medium, large)
- Loading state support
- Icon support
- Disabled state
- Accessibility features

## Usage

```jsx
import Button from './Button';

<Button 
  variant="primary"
  size="medium"
  onClick={handleClick}
  disabled={isLoading}
>
  Click me
</Button>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | string | 'primary' | Button style variant |
| size | string | 'medium' | Button size |
| onClick | function | - | Click handler function |
| disabled | boolean | false | Whether button is disabled |
| loading | boolean | false | Show loading spinner |
| icon | element | - | Icon element to display |
| type | string | 'button' | Button type (button, submit, reset) |

## Variants

- `primary`: Main action button with solid background
- `secondary`: Secondary action button
- `outline`: Button with outline border
- `ghost`: Minimal button with no background
- `danger`: Destructive action button

## Sizes

- `small`: Compact button for tight spaces
- `medium`: Standard button size
- `large`: Prominent button for important actions

## Examples

### Basic Button
```jsx
<Button onClick={handleSave}>
  Save Changes
</Button>
```

### Primary Button
```jsx
<Button variant="primary" size="large" onClick={handleSubmit}>
  Submit Form
</Button>
```

### Loading State
```jsx
<Button 
  variant="primary" 
  loading={isSubmitting}
  disabled={isSubmitting}
>
  {isSubmitting ? 'Saving...' : 'Save'}
</Button>
```

### Icon Button
```jsx
<Button variant="outline" icon={<PlusIcon />}>
  Add Item
</Button>
```

### Danger Button
```jsx
<Button variant="danger" onClick={handleDelete}>
  Delete Item
</Button>
```