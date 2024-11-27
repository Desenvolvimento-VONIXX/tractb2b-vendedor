import { useEffect } from "react";
import { FaRegCheckCircle } from "react-icons/fa";

interface ModalFeedbackProps {
  isOpen: boolean;
  onClose: () => void;
  nunota: number;
}

const ModalFeedback: React.FC<ModalFeedbackProps> = ({
  isOpen,
  onClose,
  nunota,
}) => {
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [isOpen, onClose]);
  

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={handleOutsideClick}
        >
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center max-w-sm">
            <div className="flex items-center justify-center text-green-600 mb-4">

              <FaRegCheckCircle className="w-12 h-12" />

            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Sucesso!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Seu pedido de número{" "}
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {nunota}
              </span>{" "}
              foi realizado com sucesso.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalFeedback;
