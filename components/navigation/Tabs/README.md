# Tabs Component

A tabbed interface component for organizing content into multiple sections.

## Features

- Multiple tab panels
- Custom tab styling
- Responsive design
- Keyboard navigation
- Accessible tab structure

## Usage

```jsx
import Tabs from './Tabs';

<Tabs 
  tabs={[
    { id: 'tab1', label: 'Tab 1', content: 'Content for tab 1' },
    { id: 'tab2', label: 'Tab 2', content: 'Content for tab 2' }
  ]}
  activeTab="tab1"
  onTabChange={handleTabChange}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| tabs | array | [] | Array of tab objects |
| activeTab | string | - | ID of currently active tab |
| onTabChange | function | - | Tab change handler |
| orientation | string | 'horizontal' | Tab orientation (horizontal/vertical) |
| disabled | boolean | false | Whether tabs are disabled |

## Examples

### Basic Tabs
```jsx
<Tabs 
  tabs={[
    { id: 'overview', label: 'Overview', content: <OverviewComponent /> },
    { id: 'details', label: 'Details', content: <DetailsComponent /> },
    { id: 'settings', label: 'Settings', content: <SettingsComponent /> }
  ]}
  activeTab="overview"
  onTabChange={setActiveTab}
/>
```

### Vertical Tabs
```jsx
<Tabs 
  tabs={tabs}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  orientation="vertical"
/>
```

### Disabled Tabs
```jsx
<Tabs 
  tabs={[
    { id: 'tab1', label: 'Tab 1', content: 'Content 1' },
    { id: 'tab2', label: 'Tab 2', content: 'Content 2', disabled: true }
  ]}
  activeTab="tab1"
  onTabChange={setActiveTab}
/>
```

## Tab Object Structure

Each tab should have:
- `id`: Unique identifier for the tab
- `label`: Display text for the tab
- `content`: Content to display when tab is active
- `disabled` (optional): Whether this tab is disabled