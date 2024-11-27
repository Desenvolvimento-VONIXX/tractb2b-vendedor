import React from "react";

const Spinner: React.FC = () => (
  <div className="flex justify-center items-center space-x-2">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
  </div>
);

export default Spinner;
