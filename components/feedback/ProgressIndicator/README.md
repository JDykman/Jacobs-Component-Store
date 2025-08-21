# ProgressIndicator Component

A progress indicator component for showing loading states and completion progress.

## Features

- Linear and circular progress bars
- Determinate and indeterminate modes
- Customizable colors and sizes
- Label support
- Animation support

## Usage

```jsx
import ProgressIndicator from './ProgressIndicator';

<ProgressIndicator 
  value={75}
  max={100}
  variant="linear"
  label="Upload Progress"
  showPercentage={true}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | number | 0 | Current progress value |
| max | number | 100 | Maximum progress value |
| variant | string | 'linear' | Progress bar variant |
| label | string | '' | Progress label text |
| showPercentage | boolean | false | Show percentage text |
| size | string | 'medium' | Progress bar size |
| color | string | 'primary' | Progress bar color |

## Variants

- `linear`: Horizontal progress bar
- `circular`: Circular progress indicator
- `determinate`: Shows specific progress value
- `indeterminate`: Animated loading indicator

## Examples

### Linear Progress
```jsx
<ProgressIndicator 
  value={60}
  max={100}
  variant="linear"
  label="Download Progress"
  showPercentage={true}
/>
```

### Circular Progress
```jsx
<ProgressIndicator 
  value={75}
  variant="circular"
  size="large"
  color="success"
/>
```

### Indeterminate Progress
```jsx
<ProgressIndicator 
  variant="indeterminate"
  label="Processing..."
  size="small"
/>
```

### Custom Colors
```jsx
<ProgressIndicator 
  value={90}
  variant="linear"
  color="warning"
  label="Almost Complete"
/>
```

## Accessibility

- Proper ARIA attributes for screen readers
- Color contrast compliance
- Keyboard navigation support