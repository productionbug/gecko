# HexPacket UI

A flexible, themeable React component library built with Tailwind CSS.

📚 **Documentation**: [ui.hexpacket.com](https://ui.hexpacket.com)

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
import "@hexpacket/ui/styles.css";
```

> If you use `tailwindcss`, make sure to import the css inside `layer` directive to correctly override the styles:

```css title="src/global.css"
@import "tailwindcss";

@layer components {
  @import "@hexpacket/ui/styles.css";
}
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

      <Alert variant="success" title="Operation completed successfully!" />
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
  /* Override any other CSS variables as needed */
}
```

Import it and use it:

```tsx
import "./my-theme.css";

<div className="my-theme">
  <App />
</div>;
```

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

## TypeScript

All components are fully typed. Import types as needed:

```tsx
import type { ButtonProps, InputProps } from "@hexpacket/ui";
```

## License

This project is licensed under the MIT License.

## Support

For issues and feature requests, please visit our [@hexpacket/ui](https://github.com/hexpacket/ui).
