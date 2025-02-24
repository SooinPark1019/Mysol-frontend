// select.tsx
import React, { useState } from "react";

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({ value, onValueChange, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gray-200 text-gray-800 p-2 rounded shadow focus:outline-none"
      >
        {value || "옵션 선택"}
      </button>
      {isOpen && (
        <div className="absolute mt-1 w-full bg-white shadow-lg rounded z-10">
          {children}
        </div>
      )}
    </div>
  );
};

export const SelectItem: React.FC<SelectItemProps> = ({ value, children }) => {
  return (
    <div
      onClick={() => {
        const event = new CustomEvent("selectChange", { detail: value });
        window.dispatchEvent(event);
      }}
      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
    >
      {children}
    </div>
  );
};

// 이벤트 리스너 등록
if (typeof window !== "undefined") {
  window.addEventListener("selectChange", (e: any) => {
    const selectedValue = e.detail;
    console.log("Selected Value:", selectedValue);
  });
}

export default Select;