import React, { useEffect, useState } from "react";
import axiosInstance from "../helper/axiosInstance";

interface ModalPedidosPendentesProps {
    openPedidosRealizados: boolean;
    onCloseModalPedidos: () => void;
}

interface PedidosPendentes {
    "Id do pedido": number;
    "Nro. único": number;
    "Parceiro": string;
    "Cliente": string;
    "Vlr. nota": string;
}

interface PedidosP {
    idPedido: number;
    nroUnico: number;
    parceiro: string;
    cliente: string;
    vlrNota: string;
}

const ModalPedidosPendentes: React.FC<ModalPedidosPendentesProps> = ({
    openPedidosRealizados,
    onCloseModalPedidos,
}) => {
    const handleModalPendentes = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onCloseModalPedidos();
        }
    };

    const handleCloseClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onCloseModalPedidos();
    };

    const [pedidosPendentes, setPedidosPendentes] = useState<PedidosP[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    // const [loading, setLoading] = useState(false);

    const codVend = Number(sessionStorage.getItem("codVend"));

    const getPedidosPendentes = async () => {
        // setLoading(true);

        try {
            const result = await axiosInstance.get<{ Result: PedidosPendentes[] }>(
                `/api/ClientsRetail/BuscaPedidosVendedor/${codVend}`
            );

            const pedidos = result?.data?.Result || [];

            const pedidosFormatados = pedidos.map((pedido) => ({
                idPedido: pedido["Id do pedido"],
                nroUnico: pedido["Nro. único"],
                parceiro: pedido["Parceiro"],
                cliente: pedido["Cliente"],
                vlrNota: pedido["Vlr. nota"],
            }));

            setPedidosPendentes(pedidosFormatados);
            setErrorMessage("");
        } catch (error) {
            console.error("Erro ao buscar Pedidos:", error);
            setErrorMessage(`Erro ao buscar Pedidos: ${error}`);
        } finally {
            // setLoading(false);
        }
    };

    useEffect(() => {
        if (openPedidosRealizados) {
            getPedidosPendentes();
        } else {
            setPedidosPendentes([]);
        }
    }, [openPedidosRealizados]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (openPedidosRealizados) {
                getPedidosPendentes();
            }
        }, 3000);

        return () => clearInterval(interval); 
    }, [openPedidosRealizados]);

    return (
        <>
            {openPedidosRealizados && (
                <div
                    className="flex flex-col overflow-y-auto overflow-x-hidden bg-black/50 fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-[calc(100%)] max-h-full"
                    onClick={handleModalPendentes}
                >
                    <div className="relative p-4 w-full max-w-3xl max-h-full">
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Pedidos Pendentes
                                </h3>
                                <button
                                    onClick={handleCloseClick}
                                    className="text-gray-400 hover:bg-gray-200 rounded-lg text-sm w-8 h-8 dark:hover:bg-gray-600"
                                >
                                    X
                                </button>
                            </div>

                            <div className="p-4 space-y-4">
                                <div className="overflow-x-auto max-h-[60vh]">
                                    <table className="w-full text-sm text-gray-500 dark:text-gray-400 text-left">
                                        <thead className="text-xs text-gray-700 dark:text-gray-200 uppercase bg-gray-50 dark:bg-gray-800">
                                            <tr>
                                                <th className="px-6 py-3">ID PEDIDO</th>
                                                <th className="px-6 py-3">NRO ÚNICO</th>
                                                <th className="px-6 py-3">PARCEIRO</th>
                                                <th className="px-6 py-3">CLIENTE</th>
                                                <th className="px-6 py-3">VLR NOTA</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* {loading && (
                                                <tr>
                                                    <td colSpan={5} className="text-center p-4">
                                                        <Spinner />
                                                    </td>
                                                </tr>
                                            )} */}

                                            {errorMessage && (
                                                <tr>
                                                    <td colSpan={5} className="text-center p-4">
                                                        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                                                            <p>{errorMessage}</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}

                                            {pedidosPendentes.length === 0 && !errorMessage && (
                                                <tr>
                                                    <td colSpan={5} className="px-6 py-4 text-center font-medium text-gray-500 dark:text-gray-400">
                                                        Nenhum pedido pendente encontrado.
                                                    </td>
                                                </tr>
                                            )}

                                            {pedidosPendentes.length > 0 && (
                                                pedidosPendentes.map((pedido) => (
                                                    <tr
                                                        key={pedido.idPedido} // Use idPedido como key para garantir unicidade
                                                        className="bg-white border-b dark:bg-gray-700 text-left"
                                                    >
                                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                            {pedido.idPedido}
                                                        </td>
                                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                            {pedido.nroUnico}
                                                        </td>
                                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                            {pedido.parceiro}
                                                        </td>
                                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                            {pedido.cliente}
                                                        </td>
                                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                            {pedido.vlrNota}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="flex justify-end items-center p-4 border-t border-gray-200 dark:border-gray-600">
                                <button
                                    onClick={onCloseModalPedidos}
                                    className="py-2.5 px-5 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
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

export default ModalPedidosPendentes;
