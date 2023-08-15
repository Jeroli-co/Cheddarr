import * as React from 'react'
import { cva, VariantProps } from 'class-variance-authority'
import { cn } from '../utils/strings'

const titleVariants = cva('', {
  variants: {
    as: {
      h1: 'text-2xl md:text-3xl font-bold mb-8',
      h2: 'text-xl md:text-2xl font-semibold mb-6',
      h3: 'text-lg md:text-xl mb-4',
    },
    variant: {
      center: 'text-center',
    },
  },
})

type TitleProps = React.HtmlHTMLAttributes<HTMLHeadingElement> & VariantProps<typeof titleVariants>

export const Title = React.forwardRef<HTMLHeadingElement, TitleProps>(
  ({ children, className, as, variant, ...props }, ref) => {
    const Comp = as ?? 'h1'
    return (
      <Comp ref={ref} className={cn(titleVariants({ as, variant, className }))} {...props}>
        {children}
      </Comp>
    )
  },
)
