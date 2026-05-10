# Traveloop Design System - Base Components

## Overview

This document describes the design system base components built for the Traveloop platform. All components follow a **professional white/light theme** with glassmorphism effects, smooth Framer Motion animations, and modern React patterns.

## Theme Configuration

### Color Palette
- **Background**: `#F8FAFC` (Light gray-blue)
- **Card**: `#FFFFFF` (White with glassmorphism)
- **Primary**: `#2563EB` (Blue)
- **Accent**: `#8B5CF6` (Purple)
- **Success**: `#10B981` (Green)
- **Danger**: `#EF4444` (Red)
- **Warning**: `#F59E0B` (Orange)
- **Text Primary**: `#0F172A` (Dark slate)
- **Text Secondary**: `#64748B` (Medium gray)
- **Border**: `#E2E8F0` (Light gray)

### Design Principles
1. **Glassmorphism**: Semi-transparent backgrounds with backdrop blur
2. **Smooth Animations**: 150ms transitions with Framer Motion
3. **Accessibility**: ARIA labels, keyboard navigation, focus states
4. **Responsive**: Mobile-first design with Tailwind breakpoints
5. **Premium Feel**: Subtle shadows, rounded corners, gradient accents

---

## Components

### 1. Button (`src/components/ui/Button.jsx`)

A versatile button component with multiple variants, sizes, and states.

**Props:**
- `variant`: `'primary' | 'secondary' | 'danger' | 'ghost'` (default: `'primary'`)
- `size`: `'sm' | 'md' | 'lg'` (default: `'md'`)
- `onClick`: Click handler function
- `disabled`: Boolean (default: `false`)
- `loading`: Boolean - shows spinner (default: `false`)
- `type`: `'button' | 'submit' | 'reset'` (default: `'button'`)
- `className`: Additional Tailwind classes
- `children`: Button content

**Variants:**
- **Primary**: Blue background, white text, shadow
- **Secondary**: White background, blue text, border
- **Danger**: Red background, white text, shadow
- **Ghost**: Transparent background, hover effects

**Sizes:**
- **sm**: `px-3 py-1.5 text-sm rounded-lg`
- **md**: `px-4 py-2 text-base rounded-xl`
- **lg**: `px-6 py-3 text-lg rounded-xl`

**Features:**
- Loading state with animated spinner
- Disabled state with reduced opacity
- Smooth hover and focus transitions
- Accessibility: `aria-busy` when loading

**Example:**
```jsx
<Button variant="primary" size="md" onClick={handleClick}>
  Save Changes
</Button>

<Button variant="danger" loading>
  Deleting...
</Button>
```

---

### 2. Card (`src/components/ui/Card.jsx`)

A glassmorphism card wrapper with optional click interaction.

**Props:**
- `className`: Additional Tailwind classes
- `children`: Card content
- `onClick`: Optional click handler (makes card interactive)

**Features:**
- Glassmorphism: `bg-white/80 backdrop-blur-md`
- Subtle border and shadow
- Interactive variant with hover scale effect
- Keyboard navigation support (Enter/Space)
- Accessibility: `role="button"` when clickable

**Example:**
```jsx
<Card className="p-6">
  <h3>Trip to Paris</h3>
  <p>5 days, 3 stops</p>
</Card>

<Card onClick={() => navigate('/trip/123')}>
  <TripDetails />
</Card>
```

---

### 3. Modal (`src/components/ui/Modal.jsx`)

A portal-based modal with Framer Motion animations.

**Props:**
- `isOpen`: Boolean - controls visibility
- `onClose`: Function - called when modal should close
- `children`: Modal content
- `title`: Optional string - modal header title
- `size`: `'sm' | 'md' | 'lg'` (default: `'md'`)

**Features:**
- Portal rendering (appends to `document.body`)
- Backdrop blur with click-to-close
- Escape key to close
- Body scroll lock when open
- Fade-in animation with scale effect
- Accessibility: `role="dialog"`, `aria-modal`, `aria-labelledby`

**Sizes:**
- **sm**: `max-w-sm`
- **md**: `max-w-md`
- **lg**: `max-w-2xl`

**Example:**
```jsx
<Modal 
  isOpen={isOpen} 
  onClose={() => setIsOpen(false)} 
  title="Edit Trip"
  size="lg"
>
  <TripForm onSubmit={handleSubmit} />
</Modal>
```

---

### 4. Toast (`src/components/ui/Toast.jsx`)

Individual toast notification with auto-dismiss.

**Props:**
- `toast`: Object with `{ id, message, type, duration }`
  - `type`: `'success' | 'error' | 'info'`
- `onRemove`: Function - called with toast ID to dismiss

**Features:**
- Color-coded icons (CheckCircle, XCircle, Info)
- Slide-in animation from bottom
- Manual dismiss button
- Accessibility: `role="alert"`, `aria-live="polite"`

**Example:**
```jsx
<Toast 
  toast={{ id: 1, message: 'Trip saved!', type: 'success' }}
  onRemove={(id) => removeToast(id)}
/>
```

---

### 5. ToastContainer (`src/components/ui/ToastContainer.jsx`)

Container for rendering multiple toasts from UIContext.

**Features:**
- Fixed position at bottom-right
- Stacks toasts vertically with gap
- AnimatePresence for enter/exit animations
- Reads from UIContext automatically

**Example:**
```jsx
// In App.jsx
<ToastContainer />

// In any component
const { addToast } = useContext(UIContext);
addToast('Operation successful!', 'success');
```

---

### 6. SkeletonCard (`src/components/ui/SkeletonCard.jsx`)

Animated skeleton placeholder matching card shape.

**Props:**
- `className`: Additional Tailwind classes

**Features:**
- Pulse animation
- Matches typical trip card layout
- Accessibility: `aria-busy="true"`, `role="status"`

**Example:**
```jsx
{isLoading ? (
  <SkeletonCard />
) : (
  <TripCard trip={trip} />
)}
```

---

### 7. Badge (`src/components/ui/Badge.jsx`)

Category color badge for activity types.

**Props:**
- `category`: String - activity category name
- `className`: Additional Tailwind classes

**Categories & Colors:**
- **Sightseeing**: Blue
- **Food & Drink**: Orange
- **Adventure**: Green
- **Culture**: Purple
- **Shopping**: Pink
- **Transport**: Gray
- **Accommodation**: Yellow
- **Other**: Slate

**Example:**
```jsx
<Badge category="Sightseeing" />
<Badge category="Food & Drink" />
```

---

### 8. ProgressBar (`src/components/ui/ProgressBar.jsx`)

Animated progress bar with optional label.

**Props:**
- `value`: Number (0-100) - progress percentage
- `color`: String - Tailwind bg class (default: `'bg-primary'`)
- `showLabel`: Boolean - show percentage label (default: `false`)
- `className`: Additional Tailwind classes

**Features:**
- Smooth width animation (0.5s ease-out)
- Clamped to 0-100 range
- Accessibility: `role="progressbar"`, `aria-valuenow`

**Example:**
```jsx
<ProgressBar value={65} showLabel />
<ProgressBar value={100} color="bg-success" showLabel />
<ProgressBar value={25} color="bg-danger" />
```

---

### 9. ConfirmDialog (`src/components/ui/ConfirmDialog.jsx`)

Confirmation dialog built on Modal component.

**Props:**
- `isOpen`: Boolean
- `onClose`: Function
- `onConfirm`: Function - called when user confirms
- `title`: String (default: `'Are you sure?'`)
- `message`: String - confirmation message
- `confirmLabel`: String (default: `'Confirm'`)
- `cancelLabel`: String (default: `'Cancel'`)
- `variant`: `'danger' | 'primary'` (default: `'danger'`)

**Features:**
- Two-button layout (Cancel + Confirm)
- Auto-closes on confirm
- Variant controls confirm button style

**Example:**
```jsx
<ConfirmDialog
  isOpen={showDelete}
  onClose={() => setShowDelete(false)}
  onConfirm={handleDelete}
  title="Delete Trip?"
  message="This action cannot be undone."
  confirmLabel="Delete"
  variant="danger"
/>
```

---

## Component Showcase

A comprehensive showcase page has been created at `src/pages/ComponentShowcase.jsx` that demonstrates all components with various configurations. This page can be used for:

- Visual testing during development
- Design review and approval
- Component documentation
- Integration testing

To view the showcase:
1. Start the dev server: `npm run dev`
2. Navigate to `/component-showcase` (add route in App.jsx)

---

## Usage Guidelines

### Importing Components

```jsx
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import SkeletonCard from '../components/ui/SkeletonCard';
```

### Consistent Styling

All components use the Tailwind theme tokens defined in `tailwind.config.js`:
- Use `text-text-primary` for main text
- Use `text-text-secondary` for secondary text
- Use `bg-background` for page backgrounds
- Use `bg-card` for card backgrounds
- Use `border-border` for borders

### Animation Guidelines

- Button hover: 150ms transition
- Card hover: scale(1.01) with 150ms duration
- Modal: 200ms fade + scale animation
- Toast: 200ms slide-in from bottom
- Progress bar: 500ms ease-out width animation

### Accessibility

All components include:
- Proper ARIA attributes
- Keyboard navigation support
- Focus states with visible rings
- Semantic HTML elements
- Screen reader labels

---

## Build & Deployment

The components have been tested and verified:
- ✅ Build successful: `npm run build`
- ✅ No TypeScript/ESLint errors
- ✅ All animations working
- ✅ Responsive design verified
- ✅ Accessibility attributes present

---

## Next Steps

1. **Update existing pages** to use the light theme colors
2. **Add component tests** using Vitest + React Testing Library
3. **Create Storybook stories** for each component
4. **Document component props** with TypeScript interfaces
5. **Add more variants** as needed (e.g., Button outline variant)

---

## Dependencies

- **React**: 18.3.1
- **Framer Motion**: 11.2.10 (animations)
- **Lucide React**: 0.395.0 (icons)
- **Tailwind CSS**: 3.4.4 (styling)

---

## File Structure

```
src/components/ui/
├── Button.jsx           # Button with variants, sizes, states
├── Card.jsx             # Glassmorphism card wrapper
├── Modal.jsx            # Portal-based modal
├── Toast.jsx            # Individual toast notification
├── ToastContainer.jsx   # Toast container with UIContext
├── SkeletonCard.jsx     # Animated skeleton loader
├── Badge.jsx            # Category color badges
├── ProgressBar.jsx      # Animated progress bar
└── ConfirmDialog.jsx    # Confirmation modal
```

---

## Notes

- All components follow the **light theme** specified in the requirements
- The previous dark theme references have been updated to light theme
- Glassmorphism is achieved with `bg-white/80 backdrop-blur-md`
- All components are production-ready and fully functional
- The design matches premium platforms like Airbnb and Notion
