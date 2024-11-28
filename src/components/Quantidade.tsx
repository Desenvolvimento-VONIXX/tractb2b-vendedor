import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa";

interface QuantityInputProps {
  codprod: string;
  quantity: number;
  incrementQuantity: (codprod: string) => void;
  decrementQuantity: (codprod: string) => void;
  updateQuantity: (codprod: string, newQuantity: number) => void;
}

const QuantityInput: React.FC<QuantityInputProps> = ({
  codprod,
  quantity,
  incrementQuantity,
  decrementQuantity,
  updateQuantity,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (value === "" || /^[0-9]*$/.test(value)) {
      updateQuantity(codprod, value === "" ? 0 : parseInt(value, 10));
    }
  };

  return (
    <div className="relative flex items-center max-w-[8rem]">
      <button
        type="button"
        onClick={() => decrementQuantity(codprod)} // Decrementa a quantidade
        className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
      >
        <FaMinus className="w-3 h-3 text-gray-900 dark:text-white" />
      </button>
      <input
        type="text" // Mudamos para "text" para lidar melhor com o valor como string
        value={quantity === 0 ? "0" : quantity} // Exibe "0" inicialmente
        onChange={handleChange} // Atualiza a quantidade conforme o usuário digita
        onFocus={(e) => {
          if (e.target.value === "0") {
            e.target.value = ""; // Remove o "0" ao focar
          }
        }}
        onBlur={(e) => {
          if (e.target.value === "") {
            e.target.value = "0"; // Reinsere o "0" se o campo estiver vazio
          }
        }}
        className="bg-gray-50 min-w-12 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
      <button
        type="button"
        onClick={() => incrementQuantity(codprod)}
        className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
      >
        <FaPlus className="w-3 h-3 text-gray-900 dark:text-white" />
      </button>
    </div>
  );
};

export default QuantityInput;
