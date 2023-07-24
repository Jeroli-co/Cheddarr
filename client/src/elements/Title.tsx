import * as React from "react";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "../utils/strings";

const titleVariants = cva("", {
  variants: {
    as: {
      h1: "text-2xl md:text-3xl font-bold mb-14",
      h2: "text-xl md:text-2xl",
    },
    variant: {
      center: "text-center",
    },
  },
});

type TitleProps = React.HtmlHTMLAttributes<HTMLHeadingElement> &
  VariantProps<typeof titleVariants>;

export const Title = React.forwardRef<HTMLHeadingElement, TitleProps>(
  ({ children, className, as, variant, ...props }, ref) => {
    const Component = as;
    return (
      <Component
        ref={ref}
        className={cn(titleVariants({ as, variant, className }))}
        {...props}
      >
        {children}
      </Component>
    );
  },
);
