# Navbar Component

A navigation bar component for the top of web applications with menu items and branding.

## Features

- Responsive design
- Logo/branding area
- Navigation menu items
- Mobile hamburger menu
- User account section
- Search functionality

## Usage

```jsx
import Navbar from './Navbar';

<Navbar 
  logo="MyApp"
  menuItems={[
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' }
  ]}
  userMenu={userMenuItems}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| logo | string/element | - | Logo text or element |
| menuItems | array | [] | Array of navigation items |
| userMenu | array | [] | User account menu items |
| showSearch | boolean | false | Show search input |
| onSearch | function | - | Search handler function |
| fixed | boolean | false | Fixed positioning |

## Examples

### Basic Navbar
```jsx
<Navbar 
  logo="MyApp"
  menuItems={[
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Projects', href: '/projects' },
    { label: 'Team', href: '/team' }
  ]}
/>
```

### With User Menu
```jsx
<Navbar 
  logo="MyApp"
  menuItems={menuItems}
  userMenu={[
    { label: 'Profile', href: '/profile' },
    { label: 'Settings', href: '/settings' },
    { label: 'Logout', onClick: handleLogout }
  ]}
/>
```

### With Search
```jsx
<Navbar 
  logo="MyApp"
  menuItems={menuItems}
  showSearch={true}
  onSearch={handleSearch}
  placeholder="Search..."
/>
```

### Fixed Navbar
```jsx
<Navbar 
  logo="MyApp"
  menuItems={menuItems}
  fixed={true}
/>
```

## Menu Item Structure

Each menu item should have:
- `label`: Display text for the menu item
- `href`: URL for navigation (optional if using onClick)
- `onClick`: Click handler function (optional if using href)
- `disabled`: Whether the item is disabled
- `icon`: Icon element to display

## Responsive Behavior

- Desktop: Full horizontal menu
- Mobile: Collapsible hamburger menu
- Tablet: Adaptive layout based on screen size