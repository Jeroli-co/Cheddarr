import { Spinner } from './Spinner'
import { Modal } from '../../elements/modal/Modal'
import { useEffect, useState } from 'react'

export const PageLoaderModal = () => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setIsOpen(true)

    return () => {
      setIsOpen(false)
    }
  }, [])

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} variant="fullScreen">
      <div className="fixed inset-0 flex flex-col gap-3 justify-center items-center">
        <Spinner size="lg" />
      </div>
    </Modal>
  )
}
