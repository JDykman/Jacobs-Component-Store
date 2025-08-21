# Radio Component

A radio button component for single selection from a group of options.

## Features

- Single selection from group
- Custom styling options
- Disabled state support
- Form integration
- Accessibility features

## Usage

```jsx
import Radio from './Radio';

<Radio 
  name="gender"
  value="male"
  checked={selectedGender === 'male'}
  onChange={handleGenderChange}
  label="Male"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| name | string | - | Name attribute for grouping radio buttons |
| value | string | - | Value of this radio option |
| checked | boolean | false | Whether this radio is selected |
| onChange | function | - | Change handler function |
| label | string | '' | Label text for the radio button |
| disabled | boolean | false | Whether radio is disabled |
| id | string | '' | Unique identifier |

## Examples

### Basic Radio Group
```jsx
<div>
  <Radio name="size" value="small" label="Small" />
  <Radio name="size" value="medium" label="Medium" />
  <Radio name="size" value="large" label="Large" />
</div>
```

### Controlled Radio
```jsx
<Radio 
  name="theme"
  value="dark"
  checked={theme === 'dark'}
  onChange={setTheme}
  label="Dark Theme"
/>
```

### Disabled State
```jsx
<Radio 
  name="option"
  value="disabled"
  label="This option is disabled"
  disabled={true}
/>
```

## Radio Groups

Radio buttons with the same `name` attribute form a group where only one can be selected at a time.