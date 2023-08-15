import React from 'react'
import { type VariantProps, cva } from 'class-variance-authority'
import { cn } from '../utils/strings'

const infoVariants = cva('px-6 py-4 rounded', {
  variants: {
    color: {
      primary: 'bg-primary text-white',
    },
  },
  compoundVariants: [],
  defaultVariants: {
    color: 'primary',
  },
})

type InfoProps = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof infoVariants>

export const Info = React.forwardRef<HTMLDivElement, InfoProps>(({ color = 'primary', children }, ref) => {
  return (
    <div ref={ref} className={cn(infoVariants({ color }))}>
      {children}
    </div>
  )
})

Info.displayName = 'Info'
