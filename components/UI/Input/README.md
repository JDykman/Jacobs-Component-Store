# Input Component

A versatile input component for text, email, password, and other input types.

## Features

- Multiple input types support
- Validation states
- Placeholder text
- Disabled state
- Error handling

## Usage

```jsx
import Input from './Input';

<Input 
  type="text"
  placeholder="Enter your name"
  value={value}
  onChange={handleChange}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| type | string | 'text' | Input type (text, email, password, etc.) |
| placeholder | string | '' | Placeholder text |
| value | string | '' | Current input value |
| onChange | function | - | Change handler function |
| disabled | boolean | false | Whether input is disabled |
| error | boolean | false | Whether to show error state |

## Examples

### Basic Input
```jsx
<Input placeholder="Enter text here" />
```

### Password Input
```jsx
<Input type="password" placeholder="Enter password" />
```

### Error State
```jsx
<Input 
  placeholder="Enter email" 
  error={true}
  value="invalid-email"
/>
```