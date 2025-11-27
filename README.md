# Gecko UI

A flexible, themeable React component library built with Tailwind CSS.

📚 **Documentation**: [Gecko](https://gecko.productionbug.com)

## Features

✨ **Fully Themeable** - Support for light, dark, and unlimited custom themes
🎨 **Pure CSS Theming** - No JavaScript overhead, works with SSR
🔧 **Tailwind-Powered** - Built on Tailwind CSS utilities
♿ **Accessible** - WCAG compliant components
📦 **Tree-Shakeable** - Only bundle what you use
🎯 **TypeScript** - Full type safety

## Installation

```bash
npm install @productionbug/gecko
# or
pnpm add @productionbug/gecko
# or
yarn add @productionbug/gecko
```

## Quick Start

### 1. Import Styles

Import the component styles in your app:

```tsx
import "@productionbug/gecko/styles.css";
```

> If you use `tailwindcss`, make sure to import the css inside `layer` directive to correctly override the styles:

```css title="src/global.css"
@import "tailwindcss";

@layer components {
  @import "@productionbug/gecko/styles.css";
}
```

### 2. Use Components

```tsx
import { Alert, Button, Input } from "@productionbug/gecko";

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

GeckoUI uses a powerful CSS variable-based theming system that automatically adapts all components when you change the theme class.

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
.GeckoUIButton--contained-primary {
  /* Your custom styles */
}

.GeckoUIInput__input {
  /* Style the inner input element */
}
```

## TypeScript

All components are fully typed. Import types as needed:

```tsx
import type { ButtonProps, InputProps } from "@productionbug/gecko";
```

## License

This project is licensed under the MIT License.

## Support

For issues and feature requests, please visit our [@productionbug/gecko](https://github.com/productionbug/gecko).
