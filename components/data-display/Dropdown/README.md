# Dropdown Component

A customizable dropdown/select component for displaying and selecting from a list of options.

## Features

- Single and multiple selection modes
- Searchable options
- Custom option rendering
- Keyboard navigation
- Placeholder text
- Disabled state

## Usage

```jsx
import Dropdown from './Dropdown';

<Dropdown 
  options={[
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' }
  ]}
  value={selectedValue}
  onChange={handleChange}
  placeholder="Select an option"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| options | array | [] | Array of option objects |
| value | any | null | Currently selected value(s) |
| onChange | function | - | Change handler function |
| placeholder | string | 'Select...' | Placeholder text |
| disabled | boolean | false | Whether dropdown is disabled |
| multiple | boolean | false | Allow multiple selections |
| searchable | boolean | false | Enable search functionality |

## Examples

### Basic Dropdown
```jsx
<Dropdown 
  options={[
    { value: 'red', label: 'Red' },
    { value: 'green', label: 'Green' },
    { value: 'blue', label: 'Blue' }
  ]}
  placeholder="Choose a color"
/>
```

### Multiple Selection
```jsx
<Dropdown 
  options={options}
  multiple={true}
  value={selectedValues}
  onChange={setSelectedValues}
  placeholder="Select multiple items"
/>
```

### Searchable Dropdown
```jsx
<Dropdown 
  options={options}
  searchable={true}
  placeholder="Search and select..."
/>
```

## Option Format

Each option should have:
- `value`: The actual value of the option
- `label`: The display text for the option
- `disabled` (optional): Whether this option is disabled