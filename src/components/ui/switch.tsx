"use client";

import * as React from "react";
import * as RadixSwitch from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

export type SwitchProps = React.ComponentPropsWithoutRef<
  typeof RadixSwitch.Root
>;

export const Switch = React.forwardRef<
  React.ElementRef<typeof RadixSwitch.Root>,
  SwitchProps
>(({ className, ...props }, ref) => {
  return (
    <RadixSwitch.Root
      ref={ref}
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        className
      )}
      {...props}
    >
      <RadixSwitch.Thumb
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
        )}
      />
    </RadixSwitch.Root>
  );
});

Switch.displayName = "Switch";

export default Switch;
