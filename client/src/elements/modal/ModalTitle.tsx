import { cva, VariantProps } from 'class-variance-authority'
import { cn } from '../../utils/strings'
import React from 'react'
import { Dialog } from '@headlessui/react'

const modalTitleVariants = cva('p-4 border-b', {
  variants: {
    as: {
      h1: 'text-2xl md:text-3xl font-bold',
      h2: 'text-xl md:text-2xl font-semibold',
      h3: 'text-lg md:text-xl',
    },
  },
})

type ModalTitleProps = React.HtmlHTMLAttributes<HTMLHeadingElement> & VariantProps<typeof modalTitleVariants>

export const ModalTitle = React.forwardRef<HTMLHeadingElement, ModalTitleProps>(
  ({ children, className, as, ...props }, ref) => {
    return (
      <Dialog.Title as={as ?? 'h1'} ref={ref} className={cn(modalTitleVariants({ as, className }))} {...props}>
        {children}
      </Dialog.Title>
    )
  },
)
