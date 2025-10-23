"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const Avatar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-muted", className)} {...props} />
));
Avatar.displayName = "Avatar";

const AvatarImage = ({ src, alt = "", className }: { src?: string; alt?: string; className?: string }) => (
  src ? <img src={src} alt={alt} className={cn("h-full w-full rounded-full object-cover", className)} /> : null
);

const AvatarFallback = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(({ className, ...props }, ref) => (
  <span ref={ref} className={cn("text-sm font-medium", className)} {...props} />
));
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
