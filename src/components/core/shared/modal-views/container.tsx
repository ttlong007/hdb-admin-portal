import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Modal } from '@core/modal-views/modal'
import { useModal } from './use-modal'

export default function GlobalModal() {
  const { isOpen, view, closeModal, customSize, size } = useModal()
  const location = useLocation()

  useEffect(() => {
    closeModal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      customSize={customSize}
      size={size}
      overlayClassName="dark:bg-opacity-40 dark:backdrop-blur-lg"
      containerClassName="dark:bg-gray-100"
      className="z-[9999] [&_.pointer-events-none]:overflow-visible"
    >
      {view}
    </Modal>
  )
}
