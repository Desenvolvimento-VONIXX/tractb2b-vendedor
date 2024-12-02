// import React, { useEffect, useState } from "react";
// import axiosInstance from "../helper/axiosInstance";
// import { IoMdArrowDropdown } from "react-icons/io";
// import { FaCalendarMinus } from "react-icons/fa6";
// import "react-datepicker/dist/react-datepicker.css";

// interface FormTipDiversos {
//     onAdd: (newData: any) => void;
//     totalPedido: number;

// }

// const FormDiversos: React.FC<FormTipDiversos> = ({
//     onAdd,
//     totalPedido
// }) => {

//     const [codTipoTituloSelecionado, setCodTipoTituloSelecionado] = useState("");
//     const [descTipoTituloSelecionado, setDescTipoTituloSelecionado] = useState("");
//     const [valorDesdobramento, setValorDesdobramento] = useState("");
//     const [dataVencimento, setDataVencimento] = useState("");
//     const [selectedDate, setSelectedDate] = useState(null);
//     const [showList, setShowList] = useState(false);

//     const handleAddClick = () => {
//         const newData = {
//             codTipoTituloSelecionado,
//             valorDesdobramento,
//             dataVencimento: new Date(dataVencimento).toLocaleDateString('pt-BR')
//         };

//         onAdd(newData);
//         setCodTipoTituloSelecionado("");
//         setValorDesdobramento("");
//         setDataVencimento("");
//     };




//     return (
//         <>
//             <div className="w-full">
//                 <div>
//                     <p className="font-semibold dark:text-white mb-1 ">Tipo de Título</p>

//                     <div className="flex items-center">
//                         <div className="relative w-full">
//                             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                                 <IoMdArrowDropdown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
//                             </div>

//                             <input
//                                 type="text"
//                                 id="simple-search"
//                                 value={codTipoTituloSelecionado.toUpperCase()}
//                                 onChange={(e) => setCodTipoTituloSelecionado(e.target.value)}
//                                 onFocus={() => setShowList(true)}
//                                 className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-[5px] focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
//                                 placeholder="Selecionar Tipo de Negociação"
//                             />
//                         </div>
//                     </div>

                    
//                 </div>
//                 <div className="w-full mt-2 flex flex-row gap-4">
//                     <div className="flex-1">
//                         <p className="font-semibold dark:text-white mb-1">Valor do Desdobramento</p>
//                         <div className="flex items-center">
//                             <div className="relative w-full">
//                                 <input
//                                     type="number"
//                                     value={valorDesdobramento}
//                                     onChange={(e) => setValorDesdobramento(e.target.value)}
//                                     className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                                     placeholder="Digite o valor"
//                                 />
//                             </div>
//                         </div>
//                     </div>
//                     <div className="flex-1">
//                         <p className="font-semibold dark:text-white mb-1">Data de Vencimento</p>
//                         <div className="flex items-center">
//                             <div className="relative w-full">
//                                 <input
//                                     id="default-datepicker"
//                                     type="date"
//                                     value={dataVencimento}
//                                     onChange={(e) => setDataVencimento(e.target.value)}
//                                     className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                                     placeholder="Selecionar data"
//                                 />

//                             </div>
//                         </div>
//                     </div>

//                 </div>
//                 <button
//                     type="button"
//                     onClick={handleAddClick}
//                     className="mt-5 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600"
//                 >
//                     Adicionar
//                 </button>
//             </div>
//         </>
//     )

// };
// export default FormDiversos;
