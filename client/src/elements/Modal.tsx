import React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Icon } from '../shared/components/Icon'
import { faClose } from '@fortawesome/free-solid-svg-icons'
import { cn } from '../utils/strings'

type ModalContentProps = React.PropsWithChildren<
  DialogPrimitive.DialogContentProps & { onClose?: () => void }
>

export const ModalContent = React.forwardRef<HTMLDivElement, ModalContentProps>(
  ({ children, onClose, className, ...props }, forwardedRef) => (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0" />
      <DialogPrimitive.Content
        className={cn(
          'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 z-modal',
          className
        )}
        {...props}
        ref={forwardedRef}
      >
        {children}
        {!!onClose && (
          <DialogPrimitive.Close
            className="fixed top-2 right-3 text-2xl text-primary-dark"
            onClick={() => onClose()}
          >
            <Icon icon={faClose} />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
)

type ModalTriggerProps = React.PropsWithChildren<DialogPrimitive.DialogTriggerProps>

export const ModalTrigger = React.forwardRef<HTMLButtonElement, ModalTriggerProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <DialogPrimitive.Trigger
      ref={forwardedRef}
      className={cn('cursor-pointer', className)}
      asChild
      {...props}
    >
      {children}
    </DialogPrimitive.Trigger>
  )
)

export const Modal = DialogPrimitive.Root
export const ModalTitle = DialogPrimitive.Title
export const ModalDescription = DialogPrimitive.Description
export const ModalClose = DialogPrimitive.Close
