# Pagination Component

A pagination component for navigating through large sets of data or content.

## Features

- Page navigation controls
- Configurable page sizes
- Jump to specific page
- Responsive design
- Accessibility support

## Usage

```jsx
import Pagination from './Pagination';

<Pagination 
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={handlePageChange}
  totalItems={totalItems}
  itemsPerPage={itemsPerPage}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| currentPage | number | 1 | Current active page |
| totalPages | number | 1 | Total number of pages |
| onPageChange | function | - | Page change handler |
| totalItems | number | 0 | Total number of items |
| itemsPerPage | number | 10 | Items per page |
| showPageSize | boolean | true | Show page size selector |
| pageSizeOptions | array | [10, 20, 50, 100] | Available page sizes |

## Examples

### Basic Pagination
```jsx
<Pagination 
  currentPage={1}
  totalPages={10}
  onPageChange={setCurrentPage}
  totalItems={100}
/>
```

### With Page Size Control
```jsx
<Pagination 
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
  totalItems={totalItems}
  itemsPerPage={itemsPerPage}
  onPageSizeChange={setItemsPerPage}
/>
```

### Custom Page Size Options
```jsx
<Pagination 
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
  pageSizeOptions={[5, 15, 30, 60]}
  itemsPerPage={15}
/>
```

## Events

- `onPageChange(pageNumber)`: Called when user navigates to a different page
- `onPageSizeChange(pageSize)`: Called when user changes items per page