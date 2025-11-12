import mermaid from "mermaid";
import { type FC, useEffect } from "react";
import { Toaster } from "sonner";

import { DialogContainer } from "../Dialog/DialogContainer";
import { DrawerContainer } from "../Drawer/DrawerContainer";
import type { HexpacketUIContainerProps } from "./HexpacketUIContainer.types";

/**
 * HexpacketUIContainer is a container component that wraps the Toast, ConfirmDialog, and other components that need to mount at the top level of the application.
 *
 * Please refer to [MermaidOptions](https://mermaid.js.org/config/schema-docs/config.html#mermaid-config-schema) to see the available options for the `mermaidOptions` prop.
 * @example
 *
 * ```js
 * import { HexpacketUIContainer } from '@hexpacket/ui';
 *
 * renderApp(
 *  <>
 *   <App />
 *   <HexpacketUIContainer
 *      toastOptions={{
 *        position: 'bottom-right',
 *        ... other options
 *      }},
 *      mermaidConfig={{
 *        startOnLoad: true,
 *      }}
 *   />
 *  </>
 * )
 * ```
 * */
const HexpacketUIContainer: FC<HexpacketUIContainerProps> = ({
  toastOptions = {},
  mermaidConfig = {}
}) => {
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      suppressErrorRendering: true,
      ...mermaidConfig
    });
  }, [mermaidConfig]);

  const { style, ...restToastOptions } = toastOptions;

  return (
    <>
      <Toaster
        position="bottom-right"
        style={
          {
            "--normal-bg": "rgb(var(--hpui-surface-primary))",
            "--normal-text": "rgb(var(--hpui-text-primary))",
            "--normal-border": "rgb(var(--hpui-border-primary))",
            ...style
          } as React.CSSProperties
        }
        {...restToastOptions}
      />
      <DrawerContainer />
      <DialogContainer />
    </>
  );
};

export default HexpacketUIContainer;
