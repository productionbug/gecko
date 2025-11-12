import "@hexpacket/ui";

declare module "@hexpacket/ui" {
  // Augment ButtonVariantMap to add custom variants
  interface ButtonVariantMap {
    ghost: unknown;
  }

  interface ButtonProps {
    color?: "red";
  }

  // Augment ButtonColorMap to add custom colors
  interface ButtonColorMap {
    red: unknown;
    blue: unknown;
  }

  // Add LoadingButtonProps if it doesn't exist in the library
  interface LoadingButtonProps {
    variant?: keyof ButtonVariantMap;
    color?: keyof ButtonColorMap;
  }
}
