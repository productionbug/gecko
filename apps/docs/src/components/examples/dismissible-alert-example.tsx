'use client';

import { useState } from 'react';
import { Alert, Button } from '@hexpacket/ui';

export function DismissibleAlertExample() {
  const [show, setShow] = useState(true);

  if (!show) {
    return (
      <Button size="sm" onClick={() => setShow(true)}>
        Show Alert Again
      </Button>
    );
  }

  return (
    <Alert
      variant="warning"
      title="Storage almost full"
      description="You're using 95% of your storage. Upgrade your plan to avoid interruptions."
      onRemove={() => setShow(false)}
    />
  );
}
