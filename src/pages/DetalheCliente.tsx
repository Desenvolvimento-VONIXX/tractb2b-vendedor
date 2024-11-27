import {
  GrAchievement,
  GrCart,
  GrAlarm,
  GrHomeRounded,
  GrContactInfo,
  GrFingerPrint,
  GrMailOption,
  GrPhone,
  GrAddCircle,
  GrSearch,
  GrMore,
} from "react-icons/gr";
import { FaDollarSign } from "react-icons/fa6";
import DefaultLayout from "../layout/defaultLayout";
import Logo from "../assets/logo";
import axiosInstance from "../helper/axiosInstance";
import { useEffect, useState } from "react";
import Actions from "../components/actions";
import { useLocation, useNavigate } from "react-router-dom";

interface ClientInfo {
  RAZAOSOCIAL: string;
  ENDERECO: string;
  EMAIL: string;
  TELEFONE: string;
}

interface ComprasInfo {
  Ticket: number | null;
  "Total de pedidos": number;
  "Dias sem compras": number | null;
  "Total em compras": number | null;
}

interface Pedido {
  "Nro. único": number;
  "Dt. Neg.": string;
  "Vlr. nota": string;
  "Tipo de negociação": string;
  STATUS: string;
}

function DetalheCliente() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cnpj } = location.state;
  const [info, setInfo] = useState<ClientInfo | null>(null);
  const [comprasInfo, setComprasInfo] = useState<ComprasInfo | null>(null);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  const navigateTabela = async () => {
    try {
      const authResponse = await axiosInstance.post(
        "/auth/send-data",
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!authResponse.data) {
        throw new Error("Sistema encontra-se fora do ar temporariamente.");
      }

      const { cookie } = authResponse.data;

      const productResponse = await axiosInstance.get(
        `/prodsClient/get/${cookie}/${cnpj}`
      );
      navigate("/Tabela", {
        state: { productData: productResponse.data, cnpj: cnpj },
      });
    } catch (error) {}
  };

  async function getInfo() {
    try {
      const response = await axiosInstance.get(`prodsClient/getInfo/${cnpj}`);
      setInfo(response.data.result[0]); // Atualiza o estado com os dados do JSON
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  }

  async function getInfoCompras() {
    try {
      const response = await axiosInstance.get(
        `prodsClient/getInfoCompras/${cnpj}`
      );
      setComprasInfo(response.data.result[0]);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  }

  async function getPedidos() {
    try {
      const response = await axiosInstance.get(
        `prodsClient/getPedidos/${cnpj}`
      );
      setPedidos(response.data.result);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  }

  useEffect(() => {
    getInfo();
    getInfoCompras();
    getPedidos();
  }, []);

  function formatCnpjCpf(value: string): string {
    // Remove tudo que não for número
    value = value.replace(/\D/g, "");

    if (value.length <= 11) {
      // Máscara de CPF: ###.###.###-##
      return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    } else {
      // Máscara de CNPJ: ##.###.###/####-##
      return value.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        "$1.$2.$3/$4-$5"
      );
    }
  }
  const formattedCnpjCpf = formatCnpjCpf(cnpj);
  return (
    <DefaultLayout>
      <section className="bg-gray-100 dark:bg-gray-900 h-full">
        <div className="mx-auto px-4 lg:px-12">
          <div className="flex flex-col items-center">
            <Logo className="w-full h-36 fill-black dark:fill-white" />
            <h1 className="mb-4 text-2xl font-bold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-4xl dark:text-white">
              Sejá Bem-Vindo a Areá de Cliente
            </h1>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 flex flex-col items-center justify-center bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <GrAchievement className="w-10 h-10 text-green-500 dark:text-green-400 mb-2" />
                <h5 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  {comprasInfo?.["Total em compras"] ?? "0.0"}
                </h5>
                <p className="font-normal text-gray-500 dark:text-gray-400">
                  Total de vendas
                </p>
              </div>
              <div className="p-6 flex flex-col items-center justify-center bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <GrCart className="w-10 h-10 text-blue-500 dark:text-blue-400 mb-2" />
                <h5 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  {comprasInfo?.["Total de pedidos"] ?? "0"} Pedido(s)
                </h5>
                <p className="font-normal text-gray-500 dark:text-gray-400">
                  Total de vendas realizadas
                </p>
              </div>
              <div className="p-6 flex flex-col items-center justify-center bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <GrAlarm className="w-10 h-10 text-red-500 dark:text-red-400 mb-2" />
                <h5 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  {comprasInfo?.["Dias sem compras"] ?? "0"} dia(s)
                </h5>
                <p className="font-normal text-gray-500 dark:text-gray-400">
                  Dias sem comprar
                </p>
              </div>
              <div className="p-6 flex flex-col items-center justify-center bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <FaDollarSign className="w-10 h-10 text-yellow-500 dark:text-yellow-400 mb-2" />
                <h5 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  {comprasInfo?.Ticket ?? "0.0"}
                </h5>
                <p className="font-normal text-gray-500 dark:text-gray-400">
                  Ticket médio
                </p>
              </div>
            </div>
            <div className="w-full p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
                  Informações
                </h5>
              </div>
              <div className="flow-root max-h-64 overflow-y-auto webkit-scrollbar">
                <ul
                  role="list"
                  className="divide-y divide-gray-200 dark:divide-gray-700 overflow-hidden"
                >
                  <li className="py-3 sm:py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <GrContactInfo className="w-5 h-5 text-black dark:text-white" />
                      </div>
                      <p className="text-base text-gray-800 truncate dark:text-gray-400 ms-4">
                        Razão social:
                      </p>
                      <p className="text-base font-medium text-gray-900 truncate dark:text-white ms-1">
                        {info?.RAZAOSOCIAL || "N/A"}
                      </p>
                    </div>
                  </li>
                  <li className="py-3 sm:py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <GrHomeRounded className="w-5 h-5 text-black dark:text-white" />
                      </div>
                      <p className="text-base text-gray-800 truncate dark:text-gray-400 ms-4">
                        Endereço:
                      </p>
                      <p className="text-base font-medium text-gray-900 truncate dark:text-white ms-1">
                        {info?.ENDERECO || "N/A"}
                      </p>
                    </div>
                  </li>
                  <li className="py-3 sm:py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <GrMailOption className="w-5 h-5 text-black dark:text-white" />
                      </div>
                      <p className="text-base text-gray-800 truncate dark:text-gray-400 ms-4">
                        Email:
                      </p>
                      <p className="text-base font-medium text-gray-900 truncate dark:text-white ms-1">
                        {info?.EMAIL || "N/A"}
                      </p>
                    </div>
                  </li>
                  <li className="py-3 sm:py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <GrFingerPrint className="w-5 h-5 text-black dark:text-white" />
                      </div>
                      <p className="text-base text-gray-800 truncate dark:text-gray-400 ms-4">
                        CNPJ / CPF:
                      </p>
                      <p className="text-base font-medium text-gray-900 truncate dark:text-white ms-1">
                        {formattedCnpjCpf}
                      </p>
                    </div>
                  </li>
                  <li className="py-3 sm:py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <FaDollarSign className="w-5 h-5 text-black dark:text-white" />
                      </div>
                      <p className="text-base text-gray-800 truncate dark:text-gray-400 ms-4">
                        Limite de crédito:
                      </p>
                      <p className="text-base font-medium text-gray-900 truncate dark:text-white ms-1">
                        R$ 0,00
                      </p>
                    </div>
                  </li>
                  <li className="pt-3 pb-0 sm:pt-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <GrPhone className="w-5 h-5 text-black dark:text-white" />
                      </div>
                      <p className="text-base text-gray-800 truncate dark:text-gray-400 ms-4">
                        Celular:
                      </p>
                      <p className="text-base font-medium text-gray-900 truncate dark:text-white ms-1">
                        {info?.TELEFONE || "N/A"}
                      </p>
                    </div>
                    <div className="ms-8 mt-2 flex items-center">
                      <div className="flex-shrink-0">
                        <GrAddCircle className="w-4 h-4 text-gray-800 dark:text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-800 truncate dark:text-gray-400 ms-2">
                        {info?.TELEFONE || "N/A"}
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-100 dark:bg-gray-900 pb-32 lg:pb-12">
        <div className="mx-auto px-4 lg:px-12">
          <h1 className="mb-4 text-base font-bold leading-none tracking-tight text-gray-900 md:text-base lg:text-lg dark:text-white">
            Últimos pedidos
          </h1>
          <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
              <div className="w-full md:w-1/2">
                <div className="flex items-center">
                  <label htmlFor="simple-search" className="sr-only">
                    Busque por um produto...
                  </label>
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <GrSearch className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="simple-search"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Busque por um produto..."
                    />
                  </div>
                </div>
              </div>
              <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={navigateTabela}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Novo Orçamento
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-100">
                  <tr>
                    <th scope="col" className="px-4 py-3">
                      Nro.Único
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Dt.Neg.
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Vlr.Nota
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Tipo de negociação
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.length > 0 ? (
                    pedidos.map((pedido, index) => (
                      <tr key={index} className="border-b dark:border-gray-700">
                        <th
                          scope="row"
                          className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {pedido["Nro. único"]}
                        </th>
                        <td className="px-4 py-3">{pedido["Dt. Neg."]}</td>
                        <td className="px-4 py-3">{pedido["Vlr. nota"]}</td>
                        <td className="px-4 py-3">
                          {pedido["Tipo de negociação"].trim()}
                        </td>
                        <td className="px-4 py-3">
                          <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                            {pedido.STATUS}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Actions.Button icon={GrMore}>
                            <Actions.Options
                              text="Download XML"
                              onClick={() => console.log("clickou")}
                            />
                            <Actions.Options
                              text="Imprimir Boleto"
                              onClick={() => console.log("clickou")}
                            />
                            <Actions.Options
                              text="Download da nota"
                              onClick={() => console.log("clickou")}
                            />
                          </Actions.Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-3 text-center text-gray-500"
                      >
                        Nenhum pedido encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}

export default DetalheCliente;
