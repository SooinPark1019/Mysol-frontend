import React, { useState } from "react";

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  onSelect: (value: string) => void; // ✅ 명시적으로 onSelect 정의
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
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child as React.ReactElement<SelectItemProps>, {
                onSelect: (selectedValue: string) => {
                  onValueChange(selectedValue);
                  setIsOpen(false);
                }
              });
            }
            return child;
          })}
        </div>
      )}
    </div>
  );
};

export const SelectItem: React.FC<SelectItemProps> = ({ value, children, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(value)} // ✅ 직접 함수 호출
      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
    >
      {children}
    </div>
  );
};

// ✅ 명시적으로 타입 단언하여 이벤트 리스너 등록
if (typeof window !== "undefined") {
  window.addEventListener("selectChange", (e) => {
    const customEvent = e as CustomEvent<string>;
    const selectedValue = customEvent.detail;
    console.log("Selected Value:", selectedValue);
  });
}

export default Select;
