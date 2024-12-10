import React, { useEffect, useState } from "react";
import axiosInstance from "../helper/axiosInstance";
import { IoMdArrowDropdown } from "react-icons/io";
import QuantityInput from "./Quantidade";
import PageComDesdobramentos from "./tableFormDiversos";

interface ModalConfirmacaoProps {
  parceiroSelecionado: number | null;
  tipoPessoaSelecionado: string | null;
  itens: any[];
  isOpen: boolean;
  onClose: () => void;
  setNunota: (nunota: number) => void;
  modalSucess: (modalSucess: boolean) => void;
  setQuantities: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
  setItens: React.Dispatch<React.SetStateAction<any[]>>;
  incrementQuantity: (codprod: string) => void;
  decrementQuantity: (codprod: string) => void;
  updateQuantity: (codprod: string, newQuantity: number) => void;
  totalPedido: number;
  setTotalPedido: React.Dispatch<React.SetStateAction<number>>;

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
  tipoPessoaSelecionado,
  itens,
  isOpen,
  onClose,
  setNunota,
  modalSucess,
  setQuantities,
  setItens,
  incrementQuantity,
  decrementQuantity,
  updateQuantity,
  totalPedido,
  setTotalPedido
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
  const [descTipVenda, setDescTipVenda] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [nomeCliente, setNomeCliente] = useState<string | null>(null);
  const [diversosData, setDiversosData] = useState<any[]>([]);
  const [abaDiversos, setAbaDiversos] = useState(false);
  const [quantidadePorProduto, setQuantidadePorProduto] = useState<number | null>(null);
  const [descontos, setDescontos] = useState<{ [codprod: string]: number }>({});
  const [descontosPercentual, setDescontosPercentual] = useState<{ [codprod: string]: number }>({});

  const handleNomeClienteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNomeCliente(event.target.value);
  };

  const removeDiverso = (index: number) => {
    setDiversosData((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDescontoChange = (codprod: string, value: number | "") => {
    if (value === "") {
      setDescontos((prev) => {
        const { [codprod]: _, ...rest } = prev;
        return rest;
      });
    } else {
      setDescontos((prev) => ({ ...prev, [codprod]: value }));
      setDescontosPercentual((prev) => {
        const { [codprod]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleDescontoChangePercentual = (codprod: string, value: number | "") => {
    if (value === "") {
      setDescontosPercentual((prev) => {
        const { [codprod]: _, ...rest } = prev;
        return rest;
      });
    } else {
      setDescontosPercentual((prev) => ({ ...prev, [codprod]: value }));
      setDescontos((prev) => {
        const { [codprod]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const calcularTotalComDesconto = (item: any) => {
    const desconto = descontos[item.codprod] || 0;
    const descontoPercentual = descontosPercentual[item.codprod] || 0;
    const valorUnitario = item.valorUnitario || 0;
    const quantidade = item.quantidade || 0;

    let valorTotal = valorUnitario * quantidade;

    if (desconto > 0) {
      valorTotal -= desconto;
      valorTotal = Math.round(valorTotal * 100) / 100; 
    }

    if (descontoPercentual > 0) {
      valorTotal -= valorTotal * (descontoPercentual / 100);

      valorTotal = Math.round(valorTotal * 100) / 100; 
    }

    return valorTotal;
  };

  useEffect(() => {
    const totalComDescontos = itens.reduce((total, item) => {
      const totalItemComDesconto = calcularTotalComDesconto(item);
      return total + totalItemComDesconto;
    }, 0);

    setTotalPedido(Math.round(totalComDescontos * 100) / 100);
  }, [itens, descontos, descontosPercentual, setTotalPedido]);


  const codVend = Number(sessionStorage.getItem("codVend"));
  const codemp = Number(sessionStorage.getItem("codEmp"));


  const handleToggle = () => {
    setPedidoDeCupom(!pedidoDeCupom);
    setcodTipVendaSelecionado(null);
    setErrorMessage("");
    setSearchTipoVenda("");

    if (!pedidoDeCupom) {
      setSearchTipoVenda("");
      setDescTipVenda("");
      setFilteredTipVenda(tipoNegociacao);

    }
  };



  async function sendOrder() {
    setLoading(true);
    try {
      if (!pedidoDeCupom && codtipVendaSelecionado === null) {
        setErrorMessage("Tipo de Negociação não pode ser nulo quando não for um pedido de cupom.");
        return;
      }

      if (itens.length === 0) {
        setErrorMessage("Por favor, adicione itens ao pedido!");
        return;
      }

      if (pedidoDeCupom && (nomeCliente === "" || nomeCliente == null)) {
        setErrorMessage("Para pedidos de cupom é necessário informar o nome do cliente!");
        return;
      }

      if (pedidoDeCupom && (nomeCliente && nomeCliente.toLowerCase().trim() === "consumidor final")) {
        setErrorMessage(`O nome '${nomeCliente}' não é valido!`);
        return;
      }

      if (pedidoDeCupom && tipoPessoaSelecionado?.trim() == "Júridica") {
        setErrorMessage("Para pedido de cupom, é necessário que o parceiro seja do tipo pessoa física.");
        return;
      }

      if (!pedidoDeCupom && parceiroSelecionado === 2715) {
        setErrorMessage(`Para o parceiro selecionado apenas pedidos de cupom são permitidos.`);
        return;
      }

      let formattedFinanceiro: any[] = [];

      if (descTipVenda && descTipVenda.toUpperCase().includes("DIVERSOS")) {
        formattedFinanceiro = diversosData.map((diversos) => {
          const { codTipoTituloSelecionado, valorDesdobramento, dataVencimento } = diversos;

          const vlrDesdob = parseFloat(valorDesdobramento.toString().replace(",", "."));

          return {
            coditit: codTipoTituloSelecionado,
            dtvenc: dataVencimento,
            vlr: !isNaN(vlrDesdob) ? vlrDesdob : 0
          };
        });
      } else {
        formattedFinanceiro = [];
      }

      if (formattedFinanceiro.length === 0 && descTipVenda && descTipVenda.toUpperCase().includes("DIVERSOS")) {
        setErrorMessage("Para o tipo de negociação DIVERSOS é necessário preencher os campos da aba Financeiro.");
        return;
      }


       const itensFormatted = itens.map((item) => {
        const desconto = descontos[item.codprod] || 0;
        const descontoPerc = descontosPercentual[item.codprod] || 0;

        return {
          codprod: item.codprod,
          qtd: item.quantidade,
          vlrunit: item.valorUnitario || 0,
          vlrdesc: desconto,
          percDesc: descontoPerc
        };
      });

      const orderData = [{
        enviado: 0,
        codparc: parceiroSelecionado,
        codvend: codVend,
        cupomVal: pedidoDeCupom,
        tipNeg: codtipVendaSelecionado,
        nomeUsu: nomeCliente || "",
        itensRetail: itensFormatted,
        titRetail: formattedFinanceiro,
      }];

      const orderResponse = await axiosInstance.post(
        "/api/ordersRetail/newOrder",
        orderData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (orderResponse.status === 200) {
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
        setNomeCliente("");
        onClose();
        setDiversosData([]);
        setFilteredTipVenda(tipoNegociacao);
        setDescontos({});
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
        `/api/ClientsRetail/BuscaTipoNeg/${codemp}`
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

  useEffect(() => {
    if (searchTipVenda == "") {
      setcodTipVendaSelecionado(null)
      setAbaDiversos(false);
      setFilteredTipVenda(tipoNegociacao);

    }
  }, [searchTipVenda])


  const handleParceiroSelect = (descTipVenda: string, codTipoVenda: number) => {
    setSearchTipoVenda(descTipVenda.trim());
    setDescTipVenda(descTipVenda.trim());
    setcodTipVendaSelecionado(codTipoVenda);
    setShowList(false);
    setErrorMessage(null);
    if (descTipVenda && descTipVenda.toUpperCase().includes("DIVERSOS")) {
      setAbaDiversos(true)
    }
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
        setShowList(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const uniqueFilteredTipVenda = Array.from(
    new Map(filteredTipVenda.map((item) => [item.codtipvenda, item])).values()
  );


  useEffect(() => {
    if (!pedidoDeCupom) {
      setSearchTipoVenda("");
      setcodTipVendaSelecionado(null);
    }
  }, [pedidoDeCupom]);



  useEffect(() => {
    if (!itens.length) return;

    const totalPorProduto = itens.reduce((acc: Record<number, number>, item) => {
      if (!item.codprod || item.quantidade == null) return acc;
      acc[item.codprod] = (acc[item.codprod] || 0) + item.quantidade;
      return acc;
    }, {});

    const totalProdutosUnicos = Object.keys(totalPorProduto).length;

    setQuantidadePorProduto(totalProdutosUnicos);

  }, [itens]);






  return (
    <>
      {isOpen && (
        <div
          className={`flex flex-col overflow-y-auto overflow-x-hidden bg-black/50 fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-[calc(100%)] max-h-full`}
          onClick={handleOutsideClick}
        >
          <div className="relative p-4 w-full min-w-[75%] max-w-xl max-h-full">
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
                        <th className="px-6 py-3">Desconto (R$)</th>
                        <th className="px-6 py-3">Desconto (%)</th>
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
                              updateQuantity={updateQuantity}
                            />
                          </td>
                          <td className="px-6 py-4 text-center">
                            <input
                              type="number"
                              value={descontos[item.codprod] !== undefined ? descontos[item.codprod] : "0"}
                              onChange={(e) => {
                                const valorDesconto = Number(e.target.value);
                                const valorMaximo = item.valorUnitario * item.quantidade;

                                if (valorDesconto <= valorMaximo) {
                                  handleDescontoChange(item.codprod, valorDesconto);
                                  handleDescontoChangePercentual(item.codprod, "");
                                } else {
                                  handleDescontoChange(item.codprod, valorMaximo);
                                  handleDescontoChangePercentual(item.codprod, "");
                                }
                              }}
                              onFocus={(e) => {
                                if (e.target.value === "0") {
                                  e.target.value = "";
                                }
                              }}
                              onBlur={(e) => {
                                if (e.target.value === "") {
                                  e.target.value = "0";
                                }
                              }}
                              className="custom-number-input bg-gray-50 min-w-12 border-2 rounded-[10px] border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              min={0}
                              max={item.valorUnitario * item.quantidade}
                            />
                          </td>

                          <td className="px-6 py-4 text-center">
                            <input
                              type="number"
                              value={descontosPercentual[item.codprod] !== undefined ? descontosPercentual[item.codprod] : "0"}
                              onChange={(e) => {
                                const percentualDesconto = Number(e.target.value);

                                if (percentualDesconto <= 100) {
                                  handleDescontoChangePercentual(item.codprod, percentualDesconto);
                                  handleDescontoChange(item.codprod, "");
                                } else {
                                  handleDescontoChangePercentual(item.codprod, 100);
                                  handleDescontoChange(item.codprod, "");
                                }
                              }}
                              onFocus={(e) => {
                                if (e.target.value === "0") {
                                  e.target.value = "";
                                }
                              }}
                              onBlur={(e) => {
                                if (e.target.value === "") {
                                  e.target.value = "0";
                                }
                              }}
                              className="custom-number-input bg-gray-50 min-w-12 border-2 rounded-[10px] border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              min={0}
                              max={100}
                            />
                          </td>




                          <td className="px-6 py-4 text-center dark:text-gray-300">
                            R${" "}
                            {calcularTotalComDesconto(item).toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>

                </div>
                <div className="flex justify-between">
                  <p className="justify-between text-right dark:text-gray-300 font-bold"> Total de Produtos:
                    {" "}
                    {quantidadePorProduto}
                  </p>
                  <p className="mt-1 justify-between text-right dark:text-gray-300 font-bold"> Valor Total:
                    R${" "}
                    {totalPedido.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>

              </div>

              <div className="relative p-4 pt-1 w-full max-h-full rounded-lg flex flex-col items-start space-y-4">
                {/* Pedido de cupom */}
                <div className="flex items-center">
                  <span className="font-bold text-xl dark:text-white mr-5">CUPOM?</span>
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

                {pedidoDeCupom && (
                  <div className="relative w-full">
                    <p className="font-semibold dark:text-white mb-1 ">Nome do Cliente:</p>

                    <div className="relative w-full">
                      <input
                        type="text"
                        id="simple-search"
                        value={nomeCliente || ''}
                        onChange={handleNomeClienteChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-[5px] focus:ring-primary-500 focus:border-primary-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Digite o nome do Cliente"
                      />
                    </div>
                  </div>
                )}

                {/* Selecionar Tipo de Negociação */}
                {!pedidoDeCupom && (
                  <>
                    <div className="w-full ">
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
                            value={searchTipVenda.toUpperCase()}
                            onChange={handleInputChange}
                            onFocus={() => setShowList(true)}
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
                    {abaDiversos && (
                      <div className="w-full" id="fin-diversos">
                        <div className="flex justify-between mb-2">
                          <h1 className="font-semibold dark:text-white mb-1 text-lg"> Financeiro</h1>

                        </div>
                        <div className="p-4 mb-4 text-sm rounded-lg dark:bg-gray-800 " role="alert">
                          <PageComDesdobramentos
                            setDiversos={setDiversosData}
                            totalPedido={totalPedido}
                            diversosResult={diversosData}
                            removeDiverso={removeDiverso}
                          />


                        </div>
                      </div>
                    )}
                  </>

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
