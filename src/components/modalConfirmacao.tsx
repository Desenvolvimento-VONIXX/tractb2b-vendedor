import React, { useEffect, useState } from "react";
import axiosInstance from "../helper/axiosInstance";
import { IoMdArrowDropdown } from "react-icons/io";
import QuantityInput from "./Quantidade";

interface ModalConfirmacaoProps {
  parceiroSelecionado: number | null;
  itens: any[]; // lista de itens a ser confirmada
  isOpen: boolean;
  onClose: () => void;
  setNunota: (nunota: number) => void;
  modalSucess: (modalSucess: boolean) => void;
  setQuantities: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
  setItens: React.Dispatch<React.SetStateAction<any[]>>;
  incrementQuantity: (codprod: string) => void;
  decrementQuantity: (codprod: string) => void;
  // onConfirm: () => Promise<void>; // Função para enviar o pedido
}

interface TipoNegociacao {
  "Descrição": string;
  "Cód. da negociação": number;
}

interface TipoNeg {
  desc: string;
  codtipvenda: number;
}

const ModalConfirmacao: React.FC<ModalConfirmacaoProps> = ({
  parceiroSelecionado,
  itens,
  isOpen,
  onClose,
  setNunota,
  modalSucess,
  setQuantities,
  setItens,
  incrementQuantity,
  decrementQuantity,
  // onConfirm,
}) => {

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const [pedidoDeCupom, setPedidoDeCupom] = useState<boolean>(false);
  const [searchTipVenda, setSearchTipoVenda] = useState("");
  const [filteredTipVenda, setFilteredTipVenda] = useState<TipoNeg[]>([]);
  const [tipoNegociacao, setTipoNegociacao] = useState<TipoNeg[]>([]);
  const [showList, setShowList] = useState(false);
  const [codtipVendaSelecionado, setcodTipVendaSelecionado] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


  const codVend = Number(sessionStorage.getItem("codVend"));

  const handleToggle = () => {
    setPedidoDeCupom(!pedidoDeCupom);
    setcodTipVendaSelecionado(null);
    setSearchTipoVenda("");
    setErrorMessage(null);
  };


  async function sendOrder() {
    setLoading(true); // Inicia o carregamento
    try {
      if (!pedidoDeCupom && codtipVendaSelecionado === null) {
        setErrorMessage("Tipo de Negociação não pode ser nulo quando não for um pedido de cupom.");
        return;
      }

      const itensFormatted = itens.map(item => ({
        codprod: item.codprod,
        qtd: item.quantidade,
        vlrunit: item.valorUnitario || 0,
      }));

      const orderData = [{
        enviado: 0,
        codparc: parceiroSelecionado,
        codvend: codVend,
        cupomVal: pedidoDeCupom,
        tipNeg: codtipVendaSelecionado,
        itensRetail: itensFormatted,
      }];

      const orderResponse = await axiosInstance.post(
        "/api/ordersRetail/newOrder",
        orderData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (orderResponse.status === 200) {
        // console.log("Pedido enviado com sucesso!", orderResponse.data);
        const responseData = orderResponse.data;
        const nunotaValues = responseData.map(
          (item: { nunota: number }) => item.nunota
        );
        setErrorMessage("");
        setNunota(nunotaValues);
        setQuantities({});
        setItens([]);
        modalSucess(true);
        setcodTipVendaSelecionado(null);
        setSearchTipoVenda("");
        setPedidoDeCupom(false);
        onClose();
      } else {
        setErrorMessage(orderResponse?.data?.message || 'Erro desconhecido.');
      }
    } catch (error: any) {
      console.error("Erro ao enviar pedido:", error);

      const errorMsg = error?.response?.data?.message || error?.message || 'Ocorreu um erro ao enviar o pedido. Tente novamente mais tarde.';
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false); 
    }
  }


  const handleSubmit = async () => {
    await sendOrder();
  };

  const getTipoVenda = async () => {
    try {
      const result = await axiosInstance.get<{ Result: TipoNegociacao[] }>(
        "/api/ClientsRetail/BuscaTipoNeg/9",
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const tipNeg = result?.data?.Result || [];

      // Elimina duplicados com base no codtipvenda
      const uniqueTipNeg = Array.from(
        new Map(
          tipNeg.map((tipNeg) => [tipNeg["Cód. da negociação"], tipNeg])
        ).values()
      );

      const tipNegFormatados = uniqueTipNeg.map((tipNeg) => ({
        desc: tipNeg["Descrição"].trim(),
        codtipvenda: tipNeg["Cód. da negociação"],
      }));

      setTipoNegociacao(tipNegFormatados);
      setFilteredTipVenda(tipNegFormatados);
    } catch (error) {
      console.error("Erro ao buscar tipo de negociação:", error);
    }
  };

  useEffect(() => {
    getTipoVenda();
  }, []);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTipoVenda(value);
    setShowList(true);

    const filtered = tipoNegociacao.filter((tipNeg) => {
      const descricao = tipNeg.desc.toLowerCase();
      const codTipVenda = tipNeg.codtipvenda.toString();
      const searchValue = value.toLowerCase();

      return descricao.includes(searchValue) || codTipVenda.includes(searchValue);
    });

    setFilteredTipVenda(filtered);
  };

  const handleParceiroSelect = (descTipVenda: string, codTipoVenda: number) => {
    setSearchTipoVenda(descTipVenda.trim());
    setcodTipVendaSelecionado(codTipoVenda);
    setShowList(false);
    setErrorMessage(null);

  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const input = document.getElementById('simple-search');
      const list = document.querySelector('ul');

      if (
        input &&
        !input.contains(event.target as Node) &&
        list &&
        !list.contains(event.target as Node)
      ) {
        setShowList(false); // Esconde a lista
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const uniqueFilteredTipVenda = Array.from(
    new Map(filteredTipVenda.map((item) => [item.codtipvenda, item])).values()
  );


  return (
    <>
      {isOpen && (
        <div
          className={`flex flex-col overflow-y-auto overflow-x-hidden bg-black/50 fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-[calc(100%)] max-h-full`}
          onClick={handleOutsideClick}
        >
          <div className="relative p-4 w-full max-w-3xl max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Confirme os itens do pedido
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:bg-gray-200 rounded-lg text-sm w-8 h-8 dark:hover:bg-gray-600"
                >
                  X
                </button>
              </div>



              <div className="p-4 space-y-4">
                {errorMessage && (
                  <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                    <p>{errorMessage}</p>
                  </div>
                )}

                <div className="overflow-x-auto max-h-[40vh]">
                  <table className="w-full text-sm text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 dark:text-gray-200 uppercase bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3">Produto</th>
                        <th className="px-6 py-3">Quantidade Und.</th>
                        <th className="px-6 py-3">Valor Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itens.map((item, index) => (
                        <tr
                          key={index}
                          className="bg-white border-b dark:bg-gray-700"
                        >
                          <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {item.nomeProduto
                            }
                          </td>
                          <td className="px-4 py-3 justify-center flex">
                            <QuantityInput
                              codprod={item.codprod}
                              quantity={item.quantidade || 0}
                              incrementQuantity={incrementQuantity}
                              decrementQuantity={decrementQuantity}
                            />
                          </td>
                          {/* <td className="px-6 py-4 text-center dark:text-gray-300">{item.quantidade}</td> */}
                          <td className="px-6 py-4 text-center dark:text-gray-300">
                            R${" "}
                            {(item.valorTotal).toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
              <div className="relative p-4 w-full max-w-3xl max-h-full rounded-lg flex flex-col items-start space-y-4">
                {/* Pedido de cupom */}
                <div className="flex items-center">
                  <span className="font-semibold dark:text-white mr-5">Pedido de cupom?</span>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pedidoDeCupom}
                      onChange={handleToggle}
                      className="hidden"
                    />
                    <span className="relative">
                      <span
                        className={`block w-14 h-7 bg-gray-300 rounded-full ${pedidoDeCupom ? 'bg-green-500' : ''
                          } transition-colors duration-300`}
                      ></span>
                      <span
                        className={`absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${pedidoDeCupom ? 'transform translate-x-6' : ''
                          }`}
                      ></span>
                    </span>
                  </label>
                </div>


                {/* Selecionar Tipo de Negociação */}
                {!pedidoDeCupom && (

                  <div className="w-full">
                    <p className="font-semibold dark:text-white mb-1 ">Tipo de Negociação:</p>

                    <div className="flex items-center">
                      <label htmlFor="simple-search" className="sr-only">
                        Selecionar Tipo de Negociação
                      </label>

                      <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <IoMdArrowDropdown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="simple-search"
                          value={searchTipVenda.toUpperCase()} // Exibe o texto digitado ou selecionado
                          onChange={handleInputChange}
                          onFocus={() => setShowList(true)} // Exibe a lista ao focar
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-[5px] focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Selecionar Tipo de Negociação"
                        />
                      </div>
                    </div>

                    {showList && (
                      <ul className="bg-white border dark:text-gray-300 text-sm border-gray-300 mt-2 rounded-lg overflow-y-auto dark:bg-gray-700 dark:border-gray-600 max-h-[30vh]">
                        {uniqueFilteredTipVenda.length > 0 ? (
                          uniqueFilteredTipVenda.map((tipNeg) => (
                            <li
                              key={tipNeg.codtipvenda}
                              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer uppercase"
                              onClick={() => handleParceiroSelect(tipNeg.desc, tipNeg.codtipvenda)}
                            >
                              {tipNeg.desc}
                            </li>
                          ))
                        ) : (
                          <li className="p-2 text-gray-500 dark:text-gray-400">
                            Nenhum Tipo de Negociação encontrado.
                          </li>
                        )}

                      </ul>
                    )}
                  </div>
                )}

              </div>


              <div className="flex items-center p-4 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={handleSubmit}
                  disabled={loading} // Desabilita o botão quando está carregando

                  className="text-white bg-blue-700 hover:bg-blue-800 px-5 py-2.5 rounded-lg"
                >
                  Enviar Pedido
                </button>
                <button
                  onClick={onClose}
                  className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  Voltar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalConfirmacao;
