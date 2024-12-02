// import React, { useEffect, useState } from "react";
// import axiosInstance from "../helper/axiosInstance";
// import { IoMdArrowDropdown } from "react-icons/io";
// import { FaCalendarMinus } from "react-icons/fa6";
// import "react-datepicker/dist/react-datepicker.css";

// interface TableTipDiversos {
//     diversosResult: any[];
// }

// const TableDiversos: React.FC<TableTipDiversos> = ({
//     diversosResult
// }) => {

//     useEffect(() => {
//         console.log(diversosResult);
//     }, [diversosResult])

//     return (
//         <>
//             <div className="w-full">


//                 <div className="relative max-h-[30vh] overflow-x-auto">
//                     <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
//                         <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
//                             <tr>
//                                 <th scope="col" className="px-6 py-3">
//                                     Tipo de Título
//                                 </th>
//                                 <th scope="col" className="px-6 py-3">
//                                     Vlr. Desdobramento
//                                 </th>
//                                 <th scope="col" className="px-6 py-3">
//                                     Dt Vencimento
//                                 </th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {diversosResult && diversosResult.length > 0 ? (
//                                 diversosResult.map((diversos, index) => (
//                                     <tr key={index}
//                                         className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
//                                         <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
//                                             {diversos.codTipoTituloSelecionado}
//                                         </th>
//                                         <td className="px-6 py-4">
//                                             R${" "}
//                                             {diversos.valorDesdobramento.toLocaleString("pt-BR", {
//                                                 minimumFractionDigits: 2,
//                                                 maximumFractionDigits: 2,
//                                             })}
//                                         </td>
//                                         <td className="px-6 py-4">
//                                             {diversos.dataVencimento}
//                                         </td>
//                                     </tr>
//                                 ))) : (
//                                 <tr>
//                                     <td colSpan={3} className="pt-2 text-center">
//                                         Sem registros
//                                     </td>
//                                 </tr>
//                             )}



//                         </tbody>
//                     </table>
//                 </div>

//             </div>
//         </>
//     )

// };
// export default TableDiversos;
