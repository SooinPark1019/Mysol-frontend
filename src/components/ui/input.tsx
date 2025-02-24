import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = ({ className, ...props }) => {
  return (
    <input
      {...props}
      className={`w-full p-2 rounded bg-gray-200 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 ${className}`}
    />
  );
};

export default Input;