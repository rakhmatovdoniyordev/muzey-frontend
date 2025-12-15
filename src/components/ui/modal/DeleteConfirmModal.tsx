import { Button, message } from "antd"
import { Modal } from "../modal/index"

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  itemName?: string
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  itemName = "eksponat",
}: DeleteConfirmationModalProps) {
  const handleConfirm = async () => {
    try {
      await onConfirm()
    } catch (error) {
      message.error("Xatolik yuz berdi!")
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4 dark:text-white">O'chirishni tasdiqlash</h2>

        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Siz haqiqatdan ham "{itemName}" eksponatni o'chirmoqchimisiz?
        </p>

        <div className="flex gap-3 justify-end">
          <Button size="large" onClick={onClose}>
            Yo'q
          </Button>
          <Button
            type="primary"
            size="large"
            danger
            onClick={() => {
              handleConfirm()
              onClose()
            }}
          >
            Ha
          </Button>
        </div>
      </div>
    </Modal>
  )
}
