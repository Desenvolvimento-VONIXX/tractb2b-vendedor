import React, { ElementType, useEffect, useRef, useState } from "react";

interface ButtonProps {
  icon: ElementType;
  text?: string;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ icon: Icon, text, children }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        className="flex items-center justify-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        type="button"
        onClick={toggleDropdown}
      >
        <Icon className={`w-5 h-5 ${text && "mr-2"}`} />
        {text && text}
      </button>

      {isDropdownOpen && (
        <div className="z-10 absolute -right-2 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
            {children}
          </ul>
        </div>
      )}
    </div>
  );
};

interface OptionsProps {
  icon?: ElementType;
  text: string;
  onClick: () => void;
}

const Options: React.FC<OptionsProps> = ({ icon: Icon, text, onClick }) => {
  return (
    <li>
      <button
        className="flex flex-row justify-center items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
        onClick={onClick}
      >
        {Icon && <Icon className="mr-2" />}
        {text}
      </button>
    </li>
  );
};

const Actions = {
  Button,
  Options,
};

export default Actions;
