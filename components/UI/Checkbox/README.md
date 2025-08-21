# Checkbox Component

A customizable checkbox component with support for various states and styling options.

## Features

- Checked/unchecked states
- Indeterminate state support
- Disabled state
- Custom styling
- Label support
- Form integration

## Usage

```jsx
import Checkbox from './Checkbox';

<Checkbox 
  checked={isChecked}
  onChange={handleChange}
  label="Accept terms and conditions"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| checked | boolean | false | Whether checkbox is checked |
| onChange | function | - | Change handler function |
| label | string | '' | Label text for the checkbox |
| disabled | boolean | false | Whether checkbox is disabled |
| indeterminate | boolean | false | Whether to show indeterminate state |
| name | string | '' | Name attribute for form submission |
| id | string | '' | Unique identifier |

## Examples

### Basic Checkbox
```jsx
<Checkbox label="Remember me" />
```

### Controlled Checkbox
```jsx
<Checkbox 
  checked={isChecked}
  onChange={setIsChecked}
  label="Subscribe to newsletter"
/>
```

### Disabled State
```jsx
<Checkbox 
  label="This option is disabled"
  disabled={true}
/>
```

### Indeterminate State
```jsx
<Checkbox 
  label="Select all items"
  indeterminate={true}
/>
```