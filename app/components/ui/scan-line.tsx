
'use client';

import { useEffect, useState } from 'react';

export function ScanLine({ enabled = true }: { enabled?: boolean }) {
  const [show, setShow] = useState(enabled);

  useEffect(() => {
    setShow(enabled);
  }, [enabled]);

  if (!show) return null;

  return <div className="scanline" />;
}
