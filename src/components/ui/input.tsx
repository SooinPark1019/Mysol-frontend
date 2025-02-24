import React from "react";

// ✅ 사용자 정의 속성 추가
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: React.FC<InputProps> = ({ className, label, ...props }) => {
  return (
    <div className="flex flex-col">
      {label && <label className="mb-1 text-gray-700">{label}</label>}
      <input
        {...props}
        className={`w-full p-2 rounded bg-gray-200 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 ${className}`}
      />
    </div>
  );
};

export default Input;
