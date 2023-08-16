import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { type VariantProps, cva } from 'class-variance-authority'
import React from 'react'
import { SizeProp as FASizeProp } from '@fortawesome/fontawesome-svg-core'

const spinnerVariants = cva('', {
  variants: {
    size: {
      xs: '',
      sm: '',
      md: '',
      lg: '',
      xl: '',
    },
  },
  compoundVariants: [],
  defaultVariants: {
    size: 'md',
  },
})

type SpinnerProps = React.HTMLAttributes<SVGSVGElement> & VariantProps<typeof spinnerVariants>

export const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(({ size = 'md', className }, ref) => {
  return <FontAwesomeIcon ref={ref} icon={faSpinner} pulse size={size as FASizeProp} className={className} />
})

Spinner.displayName = 'Spinner'
