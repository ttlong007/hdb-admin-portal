import React from 'react'
import { Modal, Button, Text } from 'rizzui'
import { PiTrashSimple } from 'react-icons/pi'
import { User } from '../types'

interface DeleteUserModalProps {
  isOpen: boolean
  user: User | null
  onClose: () => void
  onConfirm: () => void
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  isOpen,
  user,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-red-100">
            <PiTrashSimple className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Xác nhận xóa người dùng
            </h3>
            <Text className="text-gray-600">
              Bạn có chắc chắn muốn xóa người dùng{' '}
              <span className="font-semibold">{user?.full_name}</span>?
              <br />
              Hành động này không thể hoàn tác.
            </Text>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={onConfirm} className="bg-red-600 hover:bg-red-700">
            Xóa
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default DeleteUserModal
