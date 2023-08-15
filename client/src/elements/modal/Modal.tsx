import React from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Icon } from '../../shared/components/Icon'
import { faClose } from '@fortawesome/free-solid-svg-icons'
import { Button } from '../button/Button'
import { cn } from '../../utils/strings'
import { VariantProps, cva } from 'class-variance-authority'
import { ModalTitle } from './ModalTitle'

const ModalCloseButton = ({ onClick }: { onClick: () => void }) => (
  <Button variant="link" className="fixed top-2 right-2 text-2xl" onClick={() => onClick()}>
    <Icon icon={faClose} />
  </Button>
)

const modalVariants = cva('fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-modal-content', {
  variants: {
    variant: {
      normal: 'bg-primary-dark rounded-lg shadow-lg w-full max-h-[80vh] md:w-2/3 xl:w-1/3 flex flex-col',
      fullScreen: 'w-full h-full',
    },
  },
  compoundVariants: [],
  defaultVariants: {
    variant: 'normal',
  },
})

export type ModalProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof modalVariants> & {
    isOpen: boolean
    onClose: () => void
    title?: string | React.ReactNode
    Footer?: React.ReactNode
    hasCloseFooterButton?: boolean
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void
    className?: string
  }

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    { title, variant = 'normal', isOpen, onClose, className, Footer, children, hasCloseFooterButton, onSubmit },
    ref,
  ) => {
    return (
      <Transition ref={ref} appear show={isOpen} as={React.Fragment}>
        <Dialog as="div" className="z-modal" onClose={() => onClose && onClose()}>
          {/* Overlay */}
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black-alpha-9 z-modal-overlay" />
          </Transition.Child>

          {/* Content */}
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel
              as={onSubmit ? 'form' : undefined}
              className={cn(modalVariants({ variant, className }))}
              onSubmit={onSubmit}
            >
              <ModalCloseButton onClick={() => onClose()} />

              {title && <ModalTitle as="h2">{title}</ModalTitle>}

              <div className="p-4 overflow-y-auto">{children}</div>

              {(Footer || hasCloseFooterButton) && (
                <div className="flex items-center gap-3 p-4 border-t">
                  {Footer}
                  {hasCloseFooterButton && (
                    <Button variant="outlined" onClick={() => onClose()}>
                      Cancel
                    </Button>
                  )}
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    )
  },
)

Modal.displayName = 'Modal'
