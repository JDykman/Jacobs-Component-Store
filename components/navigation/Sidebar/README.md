# Sidebar Component

A sidebar navigation component for organizing application navigation and content.

## Features

- Collapsible sidebar
- Navigation menu items
- Nested menu support
- Customizable width
- Responsive design
- Icon support

## Usage

```jsx
import Sidebar from './Sidebar';

<Sidebar 
  isOpen={isSidebarOpen}
  onToggle={toggleSidebar}
  menuItems={[
    { label: 'Dashboard', icon: 'dashboard', href: '/dashboard' },
    { label: 'Users', icon: 'users', href: '/users' },
    { label: 'Settings', icon: 'settings', href: '/settings' }
  ]}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| isOpen | boolean | true | Whether sidebar is expanded |
| onToggle | function | - | Toggle sidebar function |
| menuItems | array | [] | Array of navigation items |
| width | number | 250 | Sidebar width in pixels |
| collapsedWidth | number | 64 | Width when collapsed |
| showToggle | boolean | true | Show toggle button |

## Examples

### Basic Sidebar
```jsx
<Sidebar 
  menuItems={[
    { label: 'Home', icon: 'home', href: '/' },
    { label: 'About', icon: 'info', href: '/about' },
    { label: 'Contact', icon: 'mail', href: '/contact' }
  ]}
/>
```

### Collapsible Sidebar
```jsx
<Sidebar 
  isOpen={isOpen}
  onToggle={() => setIsOpen(!isOpen)}
  menuItems={menuItems}
  showToggle={true}
/>
```

### Nested Menu Items
```jsx
<Sidebar 
  menuItems={[
    { label: 'Dashboard', icon: 'dashboard', href: '/dashboard' },
    { 
      label: 'Management', 
      icon: 'settings',
      children: [
        { label: 'Users', href: '/users' },
        { label: 'Roles', href: '/roles' },
        { label: 'Permissions', href: '/permissions' }
      ]
    }
  ]}
/>
```

### Custom Widths
```jsx
<Sidebar 
  menuItems={menuItems}
  width={300}
  collapsedWidth={80}
/>
```

## Menu Item Structure

Each menu item should have:
- `label`: Display text for the menu item
- `icon`: Icon name or element
- `href`: URL for navigation
- `children`: Array of sub-menu items (optional)
- `disabled`: Whether the item is disabled
- `badge`: Badge content to display

## Responsive Behavior

- Desktop: Full sidebar with toggle option
- Mobile: Overlay sidebar that slides in
- Tablet: Adaptive behavior based on screen size