import React from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Icon } from '../shared/components/Icon'
import { faClose } from '@fortawesome/free-solid-svg-icons'
import { Button } from './button/Button'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
}

export const Modal: React.FC<React.PropsWithChildren<ModalProps>> = ({ isOpen, onClose, children }) => {
  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="z-modal" onClose={() => onClose()}>
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
          <Dialog.Panel className="w-full h-full fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-modal-content">
            {children}
            <Button variant="link" className="fixed top-2 right-2 text-2xl text-primary-dark" onClick={() => onClose()}>
              <Icon icon={faClose} />
            </Button>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  )
}
