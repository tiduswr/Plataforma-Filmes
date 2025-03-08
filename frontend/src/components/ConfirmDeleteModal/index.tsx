import React from "react";
import { ConfirmDeleteModalProps } from "./type";

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800/75 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Confirmar Exclusão</h2>
        <p>{message}</p>
        <div className="mt-4 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded cursor-pointer"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
