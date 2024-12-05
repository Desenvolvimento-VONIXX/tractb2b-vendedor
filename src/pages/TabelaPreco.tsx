import { useEffect, useState, useMemo } from "react";
import Logo from "../assets/logo";
import ModalConfirmacao from "../components/modalConfirmacao";
import ModalFeedback from "../components/modalFeedBack";
import DefaultLayout from "../layout/defaultLayout";
import axiosInstance from "../helper/axiosInstance";
import ModalImagem from "../components/modaImagem";
import { MdZoomIn } from "react-icons/md";
import Spinner from "../components/spinner";
import { FaUserLarge } from "react-icons/fa6";
import QuantityInput from "../components/Quantidade";
import ModalPedidosPendentes from "../components/modalPedidosPendentes";
import ModalCadastraParceiro from "../components/modalCadastraParceiro";

// Definindo a interface para os produtos
interface Product {
  "Cód. produto": string;
  "Vlr. unitário": number;
  "Marca": string;
  "Estoque": number;
  "Produto": string;
}

interface Cliente {
  "Cód. parceiro": number;
  "Razão social": string;
  "Cpf/Cnpj": string;
  "Tip. pessoa": string;
}

interface Parceiro {
  codParc: number;
  nome: string;
  cpfcnpj: string;
  tipoPessoa: string;
}

function TabelaPreco() {
  const [modalImagemStatus, setModalImagemStatus] = useState(false);
  const [modalProduct, setModalProduct] = useState({ CODPROD: "", DESCR: "" });
  const [modalConfirmacaoStatus, setModalConfirmacaoStatus] = useState(false);
  const [nunota, setNunota] = useState(0);
  const [searchTermProduto, setSearchTermProduto] = useState("");
  const [itens, setItens] = useState<any[]>([]);
  const [searchParceiro, setSearchParceiro] = useState("");
  const [filteredParceiros, setFilteredParceiros] = useState<Parceiro[]>([]);
  const [parceiros, setParceiros] = useState<Parceiro[]>([]);
  const [parceiroSelecionado, setParceiroSelecionado] = useState<number | null>(null);
  const [showList, setShowList] = useState(false);
  const [cpfCnpjSelecionado, setCpfCnpjSelecionado] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [totalPedido, setTotalPedido] = useState(0);
  const [modalFeedbackStatus, setModalFeedbackStatus] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [isLoadingParc, setIsLoadingParc] = useState(false);
  const [errorParc, setErrorParc] = useState("");
  const [tipoPessoaSelecionado, setTipPessoaSelecionado] = useState<string | null>(null);
  const [modalPedidosPendentes, setModalPedidosPendentes] = useState(false);
  const [modalCadastraParceiro, setModalCadastraParceiro] = useState(false);

  const codEmp = sessionStorage.getItem("codEmp");

  const calculateTotalValue = (codprod: string) => {
    const quantity = quantities[codprod] || 0;
    const product = products.find((p) => p["Cód. produto"] === codprod);

    return product ? quantity * product["Vlr. unitário"] : 0;
  };

  const calculateTotalPedido = () => {
    const selectedItems = products
      .filter((produto) => (quantities[produto["Cód. produto"]] || 0) > 0)
      .map((produto) => ({
        codprod: produto["Cód. produto"],
        nomeProduto: produto["Produto"],
        quantidade: quantities[produto["Cód. produto"]],
        valorUnitario: produto["Vlr. unitário"],
        valorTotal: calculateTotalValue(produto["Cód. produto"]),
      }));

    setItens(selectedItems);
    const total = selectedItems.reduce((acc, item) => acc + item.valorTotal, 0);
    setTotalPedido(total);
  };

  useEffect(() => {
    calculateTotalPedido();
  }, [quantities, products]);


  const incrementQuantity = (codprod: string) => {
    setQuantities((prev) => ({
      ...prev,
      [codprod]: (prev[codprod] || 0) + 1,
    }));
  };

  const decrementQuantity = (codprod: string) => {
    setQuantities((prev) => ({
      ...prev,
      [codprod]: Math.max((prev[codprod] || 0) - 1, 0),
    }));
  };

  const updateQuantity = (codprod: string, newQuantity: number) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [codprod]: newQuantity,
    }));
  };

  const resetQuantities = () => {
    setQuantities({});
  };

  const handleVerPedido = () => {
    setModalConfirmacaoStatus(true);
  };

  const handlePedidosPendentes = () => {
    setModalPedidosPendentes(true);
  };

  // const handleCadastrarParceiro = () => {
  //   setModalCadastraParceiro(true);
  // };

  async function fetchProducts() {
    setErrorMessage(null);
    setSpinner(true);

    try {
      const response = await axiosInstance.get(
        `/prodsClient/genTabVarejo/${cpfCnpjSelecionado}/${codEmp}`
      );
      setSpinner(false);
      const productData = response.data.result;
      setProducts(productData);
    } catch (error: any) {
      console.error("Error fetching product data:", error);
      if (error.response && error.response.data.Error) {
        setSpinner(false);
        setErrorMessage(error.response.data.Error);
        setQuantities({});

      } else {
        setSpinner(false);
        setErrorMessage("Erro ao buscar os dados do produto.");
        setQuantities({});

      }
    } finally {
      setSpinner(false);

    }
  }


  const getParceiros = async () => {
    setIsLoadingParc(true);
    setErrorParc("");
    try {
      const result = await axiosInstance.get<{ Clientes: Cliente[] }>(
        "/api/ClientsRetail/BuscaClientesVarejo"
      );

      const clientes = result?.data?.Clientes || [];
      const parceirosFormatados = clientes.map((cliente) => ({
        codParc: cliente["Cód. parceiro"],
        nome: cliente["Razão social"],
        cpfcnpj: cliente["Cpf/Cnpj"],
        tipoPessoa: cliente["Tip. pessoa"],
      }));

      const parceiro2715 = parceirosFormatados.filter((cliente) => cliente.codParc === 2715);
      const outrosParceiros = parceirosFormatados.filter((cliente) => cliente.codParc !== 2715);

      outrosParceiros.sort((a, b) => a.nome.localeCompare(b.nome));

      const parceirosOrdenados = [...parceiro2715, ...outrosParceiros];

      setParceiros(parceirosOrdenados);
      setFilteredParceiros(parceirosOrdenados);
    } catch (error) {
      console.error("Erro ao buscar parceiros:", error);
      setErrorParc("Erro ao carregar parceiros. Tente novamente.");
    } finally {
      setIsLoadingParc(false);
    }
  };




  useEffect(() => {
    getParceiros();
  }, []);

  useEffect(() => {
    if (parceiroSelecionado === 2715) {
      setCpfCnpjSelecionado("0");
    }

  }, [parceiroSelecionado])

  useEffect(() => {
    if (cpfCnpjSelecionado) {
      fetchProducts();
    }
  }, [cpfCnpjSelecionado]);

  useEffect(() => {
    if (searchParceiro.trim() === "") {
      setCpfCnpjSelecionado(null);
      setProducts([]);
    }
  }, [searchParceiro]);



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchParceiro(value);
    setShowList(true);

    const filtered = parceiros.filter((parceiro) => {
      const nome = parceiro.nome?.toLowerCase() || '';
      const id = parceiro.codParc?.toString() || '';
      const searchValue = value.toLowerCase();

      return nome.includes(searchValue) || id.includes(searchValue);
    });

    filtered.sort((a, b) => {
      const nomeA = a.nome?.toLowerCase() || '';
      const nomeB = b.nome?.toLowerCase() || '';
      const searchValue = value.toLowerCase();

      const positionA = nomeA.indexOf(searchValue);
      const positionB = nomeB.indexOf(searchValue);

      return positionA - positionB;
    });

    setFilteredParceiros(filtered);

    if (value.trim() === "") {
      setCpfCnpjSelecionado(null);
    }
  };


  const handleParceiroSelect = (parceiroNome: string, parceiroCodParc: number, parceiroCpfCnpj: string, parceitoTipoPessoa: string) => {
    setSearchParceiro(parceiroNome.trim());
    setParceiroSelecionado(parceiroCodParc);
    setCpfCnpjSelecionado(parceiroCpfCnpj);
    setTipPessoaSelecionado(parceitoTipoPessoa)
    setErrorMessage(null);
    setShowList(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const input = document.getElementById('simple-search');
      const list = document.querySelector('ul');
      if (input && !input.contains(event.target as Node) && list && !list.contains(event.target as Node)) {
        setShowList(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openImageModal = (produto: any) => {
    setModalProduct({ CODPROD: produto["Cód. produto"], DESCR: produto["Produto"] });
    setModalImagemStatus(true);
  };

  const filteredProducts = useMemo(() => {
    if (searchTermProduto.trim()) {
      return products.filter((produto) =>
        produto["Produto"].toLowerCase().includes(searchTermProduto.toLowerCase())
      );
    }
    return products;
  }, [searchTermProduto, products]);

  const handleSearchProduct = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTermProduto(e.target.value);
  };

  const handleNunotaUpdate = (novaNunota: number) => {
    setNunota(novaNunota);
  }

  const handleModalSucess = (showModalSuccess: boolean) => {
    setModalFeedbackStatus(showModalSuccess);
  }



  return (
    <DefaultLayout>
      <section className="bg-gray-100 dark:bg-gray-900 min-h-screen pb-28">
        <div className="mx-auto px-4 lg:px-12">
          <Logo className="w-full h-36 fill-black dark:fill-white" />

          <div className="w-full mb-5">
            <div className="flex items-center">
              <label htmlFor="simple-search" className="sr-only">
                Selecionar Parceiro
              </label>
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaUserLarge className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>
                <input
                  type="text"
                  id="simple-search"
                  value={searchParceiro.toUpperCase()}
                  onChange={handleInputChange}
                  onFocus={() => setShowList(true)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-[5px] focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Selecionar Parceiro"
                />
              </div>

              {/* <div className="flex justify-end ml-5">
                <button
                  type="button"
                  onClick={handleCadastrarParceiro}
                  className="flex items-center justify-center py-3 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 h-11"
                >
                  Cadastrar Parceiro
                </button>
              </div> */}
            </div>

            {showList && (
              <ul className="bg-white border border-gray-300 mt-2 rounded-lg overflow-y-auto dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 max-h-[30vh]">
                {isLoadingParc ? (
                  <li className="p-2 text-gray-500 dark:text-gray-300">Carregando...</li>
                ) : errorParc ? (
                  <li className="p-2 text-red-500 dark:text-red-300">{errorParc}</li>
                ) : filteredParceiros.length > 0 ? (
                  filteredParceiros.map((parceiro) => (
                    <li
                      key={parceiro.codParc}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer uppercase"
                      onClick={() => handleParceiroSelect(parceiro.nome, parceiro.codParc, parceiro.cpfcnpj, parceiro.tipoPessoa)}
                    >
                      {parceiro.codParc} - {parceiro.nome}
                    </li>
                  ))
                ) : (
                  <li className="p-2 text-gray-500 dark:text-gray-300">Nenhum parceiro encontrado.</li>
                )}
              </ul>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-center space-y-3 md:space-y-0 md:space-x-4 p-4">
              <div className="w-full flex justify-between">
                <div className="w-full flex justify-between">
                  <div className="flex items-center w-full">
                    <label htmlFor="simple-search" className="sr-only">
                      Busque por um produto...
                    </label>
                    <div className="relative w-full">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 text-gray-500 dark:text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        id="simple-search"
                        value={searchTermProduto}
                        onChange={handleSearchProduct}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Busque por um produto..."
                        disabled={!cpfCnpjSelecionado}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end ml-5">
                    <button
                      type="button"
                      onClick={handlePedidosPendentes}
                      className="flex items-center justify-center py-3 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 h-11"
                    >
                      Ver Pedidos Pendentes
                    </button>
                  </div>

                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-600 dark:text-gray-200">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-4 py-3">Imagem</th>
                    <th scope="col" className="px-4 py-3">Cod.</th>
                    <th scope="col" className="px-4 py-3">Nome</th>
                    <th scope="col" className="px-4 py-3">Marca</th>
                    <th scope="col" className="px-4 py-3">Quantidade desejada</th>
                    <th scope="col" className="px-4 py-3">Valor unitário</th>
                    <th scope="col" className="px-4 py-3">Estoque</th>
                    <th scope="col" className="px-4 py-3">Valor total</th>
                  </tr>
                </thead>
                <tbody>
                  {spinner ? (
                    <tr>
                      <td colSpan={8} className="text-center p-4">
                        <Spinner />
                      </td>
                    </tr>
                  ) : errorMessage ? (
                    <tr>
                      <td colSpan={8} className="text-red-400 text-center p-4">
                        <p>{errorMessage}</p>
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((produto) => (
                      <tr className="border-b dark:border-gray-700" key={produto["Cód. produto"]}>
                        <th
                          scope="row"
                          className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white cursor-pointer text-center"
                          onClick={() => openImageModal(produto)}
                        >
                          <MdZoomIn className="ml-2 text-3xl" />
                        </th>
                        <td className="px-4 py-3">{produto["Cód. produto"]}</td>
                        <td className="px-4 py-3">{produto["Produto"]}</td>
                        <td className="px-4 py-3">{produto["Marca"]}</td>

                        <td className="px-4 py-3">
                          <QuantityInput
                            codprod={produto["Cód. produto"]}
                            quantity={quantities[produto["Cód. produto"]] || 0}
                            updateQuantity={updateQuantity}
                            incrementQuantity={incrementQuantity}
                            decrementQuantity={decrementQuantity}
                          />
                        </td>
                        <td className="px-4 py-3">
                          R${" "}
                          {produto["Vlr. unitário"].toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-4 py-3">{produto["Estoque"]}</td>
                        <td className="px-4 py-3">
                          R${" "}
                          {calculateTotalValue(produto["Cód. produto"]).toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {totalPedido > 0 && (
        <div
          id="bottom-banner"
          tabIndex={-1}
          className={`fixed bottom-0 start-0 z-50 mx-auto px-14 flex justify-between gap-12 w-full p-6 border-t border-gray-300 shadow-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600`}
        >
          <div className="flex flex-col items-start">
            <p className="flex items-center text-lg font-normal text-gray-700 dark:text-gray-100">
              <strong>Total do pedido:</strong>
              <span className="ml-2">
                R${" "}
                {totalPedido.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </p>
          </div>
          <div className="flex flex-row">
            <button
              type="button"
              onClick={handleVerPedido}
              className="flex items-center justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-6 py-2 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 h-10"
            >
              Ver Pedido
            </button>

            <button
              type="button"
              onClick={resetQuantities}
              className="flex items-center justify-center py-2 px-6 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700  h-10"
            >
              Limpar
            </button>
          </div>

        </div>
      )}

      <ModalConfirmacao
        parceiroSelecionado={parceiroSelecionado}
        tipoPessoaSelecionado={tipoPessoaSelecionado}
        itens={itens}
        isOpen={modalConfirmacaoStatus}
        onClose={() => setModalConfirmacaoStatus(false)}
        setNunota={handleNunotaUpdate}
        modalSucess={handleModalSucess}
        setQuantities={setQuantities}
        setItens={setItens}
        incrementQuantity={incrementQuantity}
        decrementQuantity={decrementQuantity}
        updateQuantity={updateQuantity}
        totalPedido={totalPedido}
        setTotalPedido={setTotalPedido}

      />

      <ModalPedidosPendentes
        openPedidosRealizados={modalPedidosPendentes}
        onCloseModalPedidos={() => setModalPedidosPendentes(false)} />

      <ModalCadastraParceiro
        openCadastraParceiro={modalCadastraParceiro}
        onCloseModalCadastraParceiro={() => setModalCadastraParceiro(false)} />

      <ModalFeedback
        isOpen={modalFeedbackStatus}
        onClose={() => setModalFeedbackStatus(false)}
        nunota={nunota}

      />

      <ModalImagem
        isOpen={modalImagemStatus}
        onClose={() => setModalImagemStatus(false)}
        codProd={modalProduct.CODPROD}
        nomeProd={modalProduct.DESCR}
      />

    </DefaultLayout>

  );
}

export default TabelaPreco;
