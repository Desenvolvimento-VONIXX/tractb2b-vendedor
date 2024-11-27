import React, { useState, useEffect } from "react";

interface ModalImagemProps {
  isOpen: boolean;
  onClose: () => void;
  codProd: string;
  nomeProd: string;
}

const ModalImagem: React.FC<ModalImagemProps> = ({
  isOpen,
  onClose,
  codProd,
  nomeProd,
}) => {
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  //  const link = import.meta.env.VITE_LINK_INTERNA;
  const link = import.meta.env.VITE_LINK_EXTERNA;

  useEffect(() => {
    setLoading(true);
    setHasError(false);
  }, [codProd]);

  const handleImageError = () => {
    setHasError(true);
    setLoading(false);
  };

  const handleImageLoad = () => {
    setLoading(false);
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {isOpen && (
        <div
          className={`flex flex-col overflow-y-auto overflow-x-hidden bg-black/50 fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-[calc(100%)] max-h-full`}
          onClick={handleOutsideClick}
        >
          <div className="relative p-4 w-full max-w-2xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                ({codProd}) - {nomeProd}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            {loading && !hasError && (
              <div className="flex items-center justify-center">
                <div className="loader">Carregando...</div>
              </div>
            )}

            <div className="p-4 md:p-5 space-y-4 flex justify-center items-center">
              <img
                src={
                  hasError
                    ? "https://www.buritama.sp.leg.br/imagens/parlamentares-2013-2016/sem-foto.jpg/image"
                    : `${link}Produto@IMAGEM@CODPROD=${codProd}.dbimage`
                }
                onLoad={handleImageLoad}
                onError={handleImageError}
                className="w-[50%] h-[50vh] max-w-xl rounded-lg"
                alt="image description"
              />
            </div>

            <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalImagem;
