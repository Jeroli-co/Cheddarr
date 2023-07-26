import * as React from "react";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "../utils/strings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

const inputVariants = cva(
  "w-full p-3 border border-primary rounded bg-primary-dark opacity-70 focus:opacity-100 outline-none",
);

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> &
  VariantProps<typeof inputVariants> & {
    label?: string;
    type?: "text" | "password" | "email" | "number" | "search";
    icon?: IconProp;
    error?: string;
  };

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, disabled, label, icon, error, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && <label>{label}</label>}

        <div className={cn(icon && "relative")}>
          {icon && (
            <FontAwesomeIcon
              icon={icon}
              className="absolute top-1/2 transform -translate-y-1/2 left-3"
            />
          )}
          <input
            ref={ref}
            className={cn(
              inputVariants({ className }),
              disabled && "opacity-50 pointer-events-none",
              icon && "pl-10",
            )}
            {...props}
          />
        </div>

        {error && <div className="text-sm text-danger-light">{error}</div>}
      </div>
    );
  },
);
