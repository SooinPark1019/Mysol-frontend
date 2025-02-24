// slider.tsx
import React from "react";

interface SliderProps {
  min: number;
  max: number;
  step: number;
  value: number[];
  onValueChange: (value: number[]) => void;
}

const Slider: React.FC<SliderProps> = ({ min, max, step, value, onValueChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = [...value];
    newValue[index] = Number(e.target.value);
    onValueChange(newValue);
  };

  return (
    <div className="flex space-x-4 items-center">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value[0]}
        onChange={(e) => handleChange(e, 0)}
        className="w-full"
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value[1]}
        onChange={(e) => handleChange(e, 1)}
        className="w-full"
      />
    </div>
  );
};

export default Slider;