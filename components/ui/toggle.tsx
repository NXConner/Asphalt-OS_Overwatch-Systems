"use client";

import * as React from "react";
import * as TogglePr from "@radix-ui/react-toggle";
import { cn } from "@/lib/utils";

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePr.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePr.Root>
>(({ className, ...props }, ref) => (
  <TogglePr.Root ref={ref} className={cn("inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm", className)} {...props} />
));
Toggle.displayName = TogglePr.Root.displayName;

export { Toggle };
