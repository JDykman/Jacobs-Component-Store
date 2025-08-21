# Modal Component

A modal dialog component for displaying content in an overlay above the main page.

## Features

- Overlay backdrop
- Focus management
- Keyboard navigation (Esc to close)
- Customizable size
- Header, body, and footer sections
- Animation support

## Usage

```jsx
import Modal from './Modal';

<Modal 
  isOpen={isModalOpen}
  onClose={closeModal}
  title="Confirm Action"
>
  <p>Are you sure you want to proceed?</p>
  <div className="modal-actions">
    <Button onClick={confirmAction}>Confirm</Button>
    <Button variant="secondary" onClick={closeModal}>Cancel</Button>
  </div>
</Modal>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| isOpen | boolean | false | Whether modal is visible |
| onClose | function | - | Function to close modal |
| title | string | '' | Modal title |
| size | string | 'medium' | Modal size (small, medium, large) |
| closeOnOverlayClick | boolean | true | Close on backdrop click |
| closeOnEsc | boolean | true | Close on Escape key |
| showCloseButton | boolean | true | Show close button |

## Examples

### Basic Modal
```jsx
<Modal 
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Information"
>
  <p>This is a simple modal with some content.</p>
</Modal>
```

### Large Modal
```jsx
<Modal 
  isOpen={showLargeModal}
  onClose={closeModal}
  title="Detailed Information"
  size="large"
>
  <div className="modal-content">
    <p>This modal contains detailed information...</p>
    {/* More content */}
  </div>
</Modal>
```

### Modal with Custom Actions
```jsx
<Modal 
  isOpen={showConfirmModal}
  onClose={closeModal}
  title="Delete Confirmation"
  closeOnOverlayClick={false}
>
  <p>Are you sure you want to delete this item?</p>
  <div className="modal-actions">
    <Button variant="danger" onClick={handleDelete}>Delete</Button>
    <Button variant="secondary" onClick={closeModal}>Cancel</Button>
  </div>
</Modal>
```

## Accessibility

- Focus is trapped within the modal when open
- Escape key closes the modal
- Screen reader announcements
- Proper ARIA attributes