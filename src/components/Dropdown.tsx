"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

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
  const [selected, setSelected] = useState<Option | null>(null);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "border border-[#D5D7DA] rounded-md px-[1vw] flex items-center justify-between text-[0.83vw] text-[#000000] font-normal",
            width,
            height
          )}
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
      </DropdownMenuTrigger>
      <DropdownMenuContent className={cn(width)}>
        {options.map((option, idx) => (
          <DropdownMenuItem
            key={idx}
            onClick={() => setSelected(option)}
            className="flex items-center gap-2 cursor-pointer text-[0.83vw] text-black"
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
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
