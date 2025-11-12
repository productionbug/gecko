# HPui UI Library

A flexible, themeable React component library built with Tailwind CSS.

## Features

✨ **Fully Themeable** - Support for light, dark, and unlimited custom themes
🎨 **Pure CSS Theming** - No JavaScript overhead, works with SSR
🔧 **Tailwind-Powered** - Built on Tailwind CSS utilities
♿ **Accessible** - WCAG compliant components
📦 **Tree-Shakeable** - Only bundle what you use
🎯 **TypeScript** - Full type safety

## Installation

```bash
npm install @hexpacket/ui
# or
pnpm add @hexpacket/ui
# or
yarn add @hexpacket/ui
```

## Quick Start

### 1. Import Styles

Import the component styles in your app:

```tsx
// app/layout.tsx or main.tsx
import "@hexpacket/ui/dist/styles.css";
```

### 2. Use Components

```tsx
import { Alert, Button, Input } from "@hexpacket/ui";

function App() {
  return (
    <div>
      <Button variant="contained" color="primary">
        Click me
      </Button>

      <Input placeholder="Enter your name" />

      <Alert variant="success">Operation completed successfully!</Alert>
    </div>
  );
}
```

## Theming

HPui uses a powerful CSS variable-based theming system that automatically adapts all components when you change the theme class.

### Applying Themes

Simply add a theme class to your root element:

```tsx
// Light theme (default)
<div className="light">
  <App />
</div>

// Dark theme
<div className="dark">
  <App />
</div>

// Custom theme
<div className="neon">
  <App />
</div>
```

### Built-in Themes

- **Light** (default) - Clean, bright interface
- **Dark** - Easy on the eyes

### Creating Custom Themes

Create a CSS file with your theme:

```css
/* my-theme.css */
.my-theme {
  --hpui-primary-600: 255 0 128; /* Custom primary color */
  --hpui-surface-primary: 20 20 40; /* Dark background */
  --hpui-text-primary: 240 240 255; /* Light text */
  /* Override any other tokens as needed */
}
```

Import it and use it:

```tsx
import "./my-theme.css";

<div className="my-theme">
  <App />
</div>;
```

See the complete [Theming Guide](./THEMING.md) for all available color tokens and examples.

### Theme Template

Check out [CUSTOM_THEME_TEMPLATE.css](./CUSTOM_THEME_TEMPLATE.css) for:

- Complete list of all theme variables
- Ready-to-use example themes (Neon, High Contrast)
- Copy-paste template for your own theme

## Component Library

### Form Components

- **Button** - Primary, outlined, text, and icon variants
- **Input** - Text input with validation states
- **Textarea** - Multi-line text input
- **Checkbox** - Single and multi-select
- **Radio** - Radio button groups
- **Switch** - Toggle switch
- **Select** - Dropdown select with search
- **DateInput** - Date picker input
- **OTPInput** - One-time password input

### React Hook Form Components

All form components have RHF-wrapped versions:

```tsx
import { RHFCheckbox, RHFInput, RHFSelect } from "@hexpacket/ui";

<RHFInput name="email" control={control} />;
```

### Feedback Components

- **Alert** - Success, error, warning, info messages
- **Toast** - Temporary notifications
- **Spinner** - Loading indicator
- **Tooltip** - Contextual help

### Layout Components

- **Dialog** - Modal dialogs
- **Drawer** - Side panel
- **Dropdown** - Dropdown menus
- **Menu** - Navigation menus

### Data Components

- **Calendar** - Date picker calendar
- **Pagination** - Page navigation

### Content Components

- **Markdown** - Render markdown content
- **MermaidDiagram** - Render Mermaid diagrams

## Advanced Usage

### Custom Styling with BEM

All components use BEM (Block Element Modifier) naming for easy customization:

```css
/* Target specific component parts */
.HPuiButton--contained-primary {
  /* Your custom styles */
}

.HPuiInput__input {
  /* Style the inner input element */
}
```

### Semantic Color Tokens

Instead of hardcoded colors, use semantic tokens for automatic theme adaptation:

```tsx
// ❌ Don't use hardcoded colors
<div className="bg-gray-50 text-gray-900">

// ✅ Use semantic tokens
<div className="bg-surface-primary text-primary">
```

Available semantic tokens:

- **Surfaces**: `surface-primary`, `surface-secondary`, `surface-hover`
- **Text**: `text-primary`, `text-secondary`, `text-muted`
- **Borders**: `border-primary`, `border-secondary`, `border-focus`
- **Status**: `success-bg`, `error-text`, `warning-icon`, `info-border`

See [THEMING.md](./THEMING.md) for the complete reference.

### No Dark Mode Variants Needed

The theming system eliminates the need for `dark:` variants:

```tsx
// ❌ Old approach (doesn't work with custom themes)
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">

// ✅ New approach (works with all themes)
<div className="bg-surface-primary text-primary">
```

## TypeScript

All components are fully typed. Import types as needed:

```tsx
import type { ButtonProps, InputProps } from "@hexpacket/ui";
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- iOS Safari (latest)

## License

MIT

## Support

For issues and feature requests, please visit our [GitHub repository](https://github.com/hexpacket/hp-ui).
