import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { type VariantProps, cva } from 'class-variance-authority'
import React from 'react'

const spinnerVariants = cva('', {
  variants: {
    size: {
      sm: '',
      md: '',
      lg: '',
    },
  },
  compoundVariants: [],
  defaultVariants: {
    size: 'md',
  },
})

type SpinnerProps = React.HTMLAttributes<SVGSVGElement> & VariantProps<typeof spinnerVariants>

export const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(({ size = 'md' }, ref) => {
  const sizeToFaSize = (s: typeof size) => {
    switch (s) {
      case 'sm':
        return '1x'
      case 'md':
        return '2x'
      case 'lg':
        return '3x'
    }
  }

  const faSize = sizeToFaSize(size)

  return <FontAwesomeIcon ref={ref} icon={faSpinner} pulse size={faSize} />
})

Spinner.displayName = 'Spinner'
