
import React, { useEffect, useState } from "react";
import axiosInstance from "../helper/axiosInstance";
import "react-datepicker/dist/react-datepicker.css";
import { IoMdArrowDropdown } from "react-icons/io";

interface TipoTitulo {
    "Descrição": string;
    "Cód. do titulo": number;
}

interface TipoTit {
    desc: string;
    codtiptitulo: number;
}

interface NewData {
    codTipoTituloSelecionado: number;
    descTipTitulo: string | null;
    valorDesdobramento: number;
    dataVencimento: string;
}


interface PageComDesdobramentosProps {
    setDiversos: React.Dispatch<React.SetStateAction<any[]>>;
    totalPedido: number;
    diversosResult: any[];
    removeDiverso: (index: number) => void;

}

const PageComDesdobramentos: React.FC<PageComDesdobramentosProps> = ({
    setDiversos,
    totalPedido,
    diversosResult,

}) => {

    const [codTipoTituloSelecionado, setCodTipoTituloSelecionado] = useState<number | null>(null);
    const [valorDesdobramento, setValorDesdobramento] = useState("");
    const [dataVencimento, setDataVencimento] = useState("");
    const [showList, setShowList] = useState(false);
    const [searchTipTitulo, setSearchTipoTitulo] = useState("");
    const [filteredTipTitulo, setFilteredTipTitulo] = useState<TipoTit[]>([]);
    const [tipoTitulo, setTipoTitulo] = useState<TipoTit[]>([]);
    const [descTipTitulo, setDescTipTitulo] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [desdobAdicionados, setDesdobAdicionados] = useState<Array<any>>([]);
    const [totalDesdobramentos, setTotalDesdobramentos] = useState<number>(0);


    const handleAddClick = () => {
        const vlrDesdob = parseFloat(valorDesdobramento.replace(",", "."));

        if (vlrDesdob > totalPedido) {
            setErrorMessage("Total do desdobramento ultrapassou o total do pedido.");
            return;
        }

        if (isNaN(vlrDesdob) || vlrDesdob <= 0) {
            setErrorMessage("Por favor, insira um valor válido para o desdobramento.");
            return;
        }

        if (!codTipoTituloSelecionado || !vlrDesdob || !dataVencimento) {
            setErrorMessage("Todos os campos são obrigatórios.");
            return;
        }


        const hoje = new Date();
        const dataVencimentoConvertida = new Date(dataVencimento);

        console.log("teste");

        if (dataVencimentoConvertida < hoje) {
            setErrorMessage("A data de vencimento não pode ser anterior à data atual.");
            return;
        }

        const newData = {
            codTipoTituloSelecionado,
            descTipTitulo,
            valorDesdobramento: vlrDesdob,
            dataVencimento: new Date(dataVencimento).toLocaleDateString("pt-BR"),
        };

        const newDesdobAdicionados = [...desdobAdicionados, newData];

        const total = newDesdobAdicionados.reduce((acc, item) => acc + item.valorDesdobramento, 0);

        if (total > totalPedido) {
            setErrorMessage("Total dos desdobramentos ultrapassou o total do pedido.");
            return;
        }

        setDiversos((prevData: NewData[]) => [...prevData, newData]);

        setTotalDesdobramentos(total);
        setDesdobAdicionados(newDesdobAdicionados);

        setErrorMessage(null);
        setCodTipoTituloSelecionado(null);
        setDescTipTitulo("");
        setValorDesdobramento("");
        setSearchTipoTitulo("");
        setDataVencimento("");
        setDescTipTitulo("");
    };


    useEffect(() => {
        const total = desdobAdicionados.reduce((acc, item) => acc + item.valorDesdobramento, 0);
        setTotalDesdobramentos(total);
    }, [desdobAdicionados]);


    const getTipoTitulo = async () => {
        const codemp = Number(sessionStorage.getItem("codEmp"));
        try {
            const result = await axiosInstance.get<{ Result: TipoTitulo[] }>(
                `/api/ClientsRetail/BuscaTitulos/${codemp}`
            );

            const tipTitulo = result?.data?.Result || [];
            const uniqueTipTit = Array.from(
                new Map(
                    tipTitulo.map((tipTitulo) => [tipTitulo["Cód. do titulo"], tipTitulo])
                ).values()
            );

            const tipTitFormatados = uniqueTipTit.map((tipTitulo) => ({
                desc: tipTitulo["Descrição"].trim(),
                codtiptitulo: tipTitulo["Cód. do titulo"],
            }));

            setTipoTitulo(tipTitFormatados);
            setFilteredTipTitulo(tipTitFormatados);
        } catch (error) {
            console.error("Erro ao buscar tipo de negociação:", error);
        }
    };

    useEffect(() => {
        getTipoTitulo();
    }, []);



    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTipoTitulo(value);
        setShowList(true);

        const filtered = tipoTitulo.filter((tipTitulo) => {
            const descricao = tipTitulo.desc.toLowerCase();
            const codTipTitulo = tipTitulo.codtiptitulo.toString();
            const searchValue = value.toLowerCase();

            return descricao.includes(searchValue) || codTipTitulo.includes(searchValue);
        });

        setFilteredTipTitulo(filtered);
    };

    useEffect(() => {
        setDiversos([]);
        setDesdobAdicionados([]);
        setTotalDesdobramentos(0);
    }, [totalPedido]);


    useEffect(() => {
        if (searchTipTitulo === "") {
            setCodTipoTituloSelecionado(null);
        }
    }, [searchTipTitulo]);

    const handleTipTituloSelect = (descTipTitulo: string, codTipTitulo: number) => {
        setSearchTipoTitulo(descTipTitulo.trim());
        setDescTipTitulo(descTipTitulo.trim());
        setCodTipoTituloSelecionado(codTipTitulo);
        setShowList(false);
        setErrorMessage(null);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const input = document.getElementById("simple-search");
            const list = document.querySelector("ul");

            if (
                input &&
                !input.contains(event.target as Node) &&
                list &&
                !list.contains(event.target as Node)
            ) {
                setShowList(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const uniqueFilteredTipTitulo = Array.from(
        new Map(filteredTipTitulo.map((item) => [item.codtiptitulo, item])).values()
    );


    const removeDiverso = (index: number) => {
        setDiversos((prev) => {
            const updated = prev.filter((_, i) => i !== index);

            setDesdobAdicionados(updated);

            const newTotal = updated.reduce((acc, item) => acc + item.valorDesdobramento, 0);
            setTotalDesdobramentos(newTotal);

            console.log("Desdobramentos atualizados:", updated);
            console.log("Novo total de desdobramentos:", newTotal);

            return updated;
        });

        setErrorMessage(null);
    };


    useEffect(() => {
        console.log(totalDesdobramentos)
    }, [totalDesdobramentos])


    useEffect(() => {
        const valorFaltante = totalPedido - totalDesdobramentos;

        if (valorFaltante > 0) {
            setValorDesdobramento(valorFaltante.toFixed(2).replace(".", ","));
        } else {
            setValorDesdobramento("");
        }
    }, [totalDesdobramentos, totalPedido]);




    return (
        <>
            {errorMessage && (
                <div className="w-full flex justify-center p-2 mb-1 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                    <p>{errorMessage}</p>
                </div>
            )}

            <div className="w-full flex flex-col md:flex-row justify-center items-start gap-6">
                {/* Coluna Esquerda */}
                <div className="flex-1 max-w-full md:max-w-[50%]">
                    <div className="space-y-4">
                        <div>
                            <p className="font-semibold dark:text-white mb-2">Tipo de Título</p>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <IoMdArrowDropdown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="simple-search"
                                    value={searchTipTitulo.toUpperCase()}
                                    onChange={handleInputChange}
                                    onFocus={() => setShowList(true)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="Selecionar Tipo de Título"
                                />
                                {showList && (
                                    <ul className="bg-white border dark:text-gray-300 text-sm border-gray-300 mt-2 rounded-lg overflow-y-auto dark:bg-gray-700 dark:border-gray-600 max-h-[24vh] absolute z-10 w-full shadow-lg">
                                        {uniqueFilteredTipTitulo.length > 0 ? (
                                            uniqueFilteredTipTitulo.map((tipTitulo) => (
                                                <li
                                                    key={tipTitulo.codtiptitulo}
                                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer uppercase"
                                                    onClick={() => handleTipTituloSelect(tipTitulo.desc, tipTitulo.codtiptitulo)}
                                                >
                                                    {tipTitulo.desc}
                                                </li>
                                            ))
                                        ) : (
                                            <li className="p-2 text-gray-500 dark:text-gray-400">
                                                Nenhum Tipo de Título encontrado.
                                            </li>
                                        )}
                                    </ul>
                                )}
                            </div>

                            <div className="flex gap-4 mt-2">
                                <div className="w-full">
                                    <label htmlFor="valorDesdobramento" className="block text-sm font-medium dark:text-white">
                                        Valor:
                                    </label>
                                    <input
                                        type="number"
                                        id="valorDesdobramento"
                                        value={valorDesdobramento.replace(",", ".")}
                                        onChange={(e) => setValorDesdobramento(e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    />
                                </div>
                                <div className="w-full">
                                    <label htmlFor="dataVencimento" className="block text-sm font-medium dark:text-white">
                                        Vencimento:
                                    </label>
                                    <input
                                        type="date"
                                        id="dataVencimento"
                                        value={dataVencimento}
                                        onChange={(e) => setDataVencimento(e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    />
                                </div>
                            </div>
                        </div>


                        <button
                            onClick={handleAddClick}
                            className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                        >
                            Adicionar Parcela
                        </button>
                        <div className="flex justify-end items-center mb-2 mt-2">
                            <span className="text-sm text-gray-500 dark:text-gray-300">
                                Valor Restante:{" "}
                                <strong>
                                    R${(totalPedido - totalDesdobramentos).toLocaleString("pt-BR", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </strong>
                            </span>
                        </div>
                    </div>
                </div>

                {/* TABELA DIVERSOS ADICIONADOS*/}
                <div className="flex-1 max-w-full md:max-w-[50%]">
                    <div className="relative shadow-lg rounded-lg bg-white dark:bg-gray-800 max-h-[30vh] overflow-y-auto">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th className="px-6 py-3 font-semibold">Título</th>
                                        <th className="px-6 py-3 font-semibold">Valor</th>
                                        <th className="px-6 py-3 font-semibold">Vencimento</th>
                                        <th className="px-6 py-3 font-semibold">Ação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {diversosResult && diversosResult.length > 0 ? (
                                        diversosResult.map((diverso, index) => (
                                            <tr key={index} className="hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                                                <td className="px-6 py-4 text-gray-900 dark:text-white truncate">
                                                    {diverso.descTipTitulo.toUpperCase()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    R${diverso.valorDesdobramento.toLocaleString("pt-BR", {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    })}
                                                </td>
                                                <td className="px-6 py-4">{diverso.dataVencimento}</td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => removeDiverso(index)}
                                                        className="text-red-500 hover:text-red-600"
                                                    >
                                                        Remover
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="py-4 text-center text-gray-500">
                                                Sem registros
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>


    );
};

export default PageComDesdobramentos;
