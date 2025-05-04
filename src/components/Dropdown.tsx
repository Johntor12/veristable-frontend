"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

interface Option {
  label: string;
  icon?: string; // Optional icon
}

interface DropdownProps {
  options: Option[];
  placeholder?: string;
  width?: string; // custom width
  height?: string; // custom height
}

export default function Dropdown({
  options,
  placeholder = "Select",
  width = "w-[16.18vw]",
  height = "h-[2.64vw]",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Option | null>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (option: Option) => {
    setSelected(option);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        type="button"
        className={`border border-[#D5D7DA] rounded-md px-[1vw] flex items-center justify-between ${width} ${height} text-[0.83vw] text-[#000000] font-normal`}
      >
        <div className="flex items-center gap-2">
          {selected?.icon && (
            <Image
              src={selected.icon}
              alt=""
              width={21}
              height={21}
              className="rounded-full"
            />
          )}
          {selected ? selected.label : placeholder}
        </div>
        <ChevronDown size={16} />
      </button>

      {isOpen && (
        <div
          className={`absolute top-[105%] left-0 z-10 bg-white border border-[#D5D7DA] rounded-md shadow-md ${width}`}
        >
          {options.map((option, idx) => (
            <div
              key={idx}
              onClick={() => handleSelect(option)}
              className="flex items-center gap-2 px-[1vw] py-[0.8vw] hover:bg-gray-100 cursor-pointer text-[0.83vw] text-black"
            >
              {option.icon && (
                <Image
                  src={option.icon}
                  alt=""
                  width={21}
                  height={21}
                  className="rounded-full"
                />
              )}
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
