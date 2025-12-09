import { forwardRef, useImperativeHandle, useState } from "react";

const Modal = forwardRef(
  ({ title, message, confirmLabel, onConfirm, color }, ref) => {
    const [isOpen, setIsOpen] = useState(false);

    // Expose methods to parent
    useImperativeHandle(ref, () => ({
      showModal: () => setIsOpen(true),
      close: () => setIsOpen(false),
      open: isOpen,
    }));

    const handleConfirm = () => {
      if (onConfirm) onConfirm();
      setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 bg-opacity-50">
        <div className="bg-[#4a2204] rounded-lg shadow-lg max-w-md w-full mx-4 relative">
          {/* Close Button */}
          <button
            className="absolute top-2 right-2 text-white hover:text-gray-400 text-xl font-bold cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>

          {/* Header */}
          <div className="px-6 pt-6">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>

          {/* Body */}
          <div className="px-6 py-4">
            <p className="text-white">{message}</p>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 flex justify-end space-x-2">
            <button
              className={`px-4 py-2 rounded text-white ${color} hover:opacity-70 transition cursor-pointer`}
              onClick={handleConfirm}
            >
              {confirmLabel}
            </button>
            <button
              className="px-4 py-2 rounded bg-gray-400 hover:bg-gray-600 cursor-pointer transition"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }
);

export default Modal;
