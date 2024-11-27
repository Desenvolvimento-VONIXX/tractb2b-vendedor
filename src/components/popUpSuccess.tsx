import React from "react";
import { GrCheckmark } from "react-icons/gr";

interface ModalConfirmacaoProps {
  isOpen: boolean;
  onClose: () => void;
}

const PopUp: React.FC<ModalConfirmacaoProps> = ({ isOpen, onClose }) => {
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className={`flex flex-col overflow-y-auto overflow-x-hidden bg-black/50 fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-[calc(100%)] max-h-full`}
          onClick={handleOutsideClick}
        >
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <button
                onClick={onClose}
                className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              >
                X
              </button>

              <div className="p-4 text-center">
                <div
                  className={`inline-flex items-center justify-center flex-shrink-0 w-14 h-14 mx-auto mb-4 text-green-500 bg-green-100 dark:bg-green-800 dark:text-green-200 rounded-full`}
                >
                  <GrCheckmark className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-500 dark:text-gray-100">
                  Conseguimos!
                </h3>
                <h3 className="text-xl font-medium text-gray-500 dark:text-gray-200">
                  Sua senha nova já está disponivel
                </h3>
                <h3 className="mb-4 text-lg font-normal text-gray-500 dark:text-gray-300">
                  vamos lá testa-lá
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                >
                  Sim, vamos lá
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PopUp;
