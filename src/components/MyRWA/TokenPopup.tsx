"use client";

import { IoClose } from "react-icons/io5";
import { useState } from "react";

type TokenPopupProps = {
  type: "Mint" | "Burn" | "Reserve";
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: number) => void;
  totalSupply: number;
  symbol: string;
};

const TokenPopup = ({
  type,
  isOpen,
  onClose,
  onSubmit,
  totalSupply,
  symbol,
}: TokenPopupProps) => {
  const [amount, setAmount] = useState("");

  const handleSubmit = () => {
    const amountNum = parseFloat(amount);

    if (isNaN(amountNum) || amountNum <= 0) {
      alert("Please enter a valid amount greater than 0");
      return;
    }

    onSubmit(amountNum);
    setAmount("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="absolute bg-white rounded-lg w-[30vw] p-6 relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-xl">
          <IoClose className="text-black" />
        </button>
        <h2 className="font-jakarta text-[1.2vw] font-bold mb-4 text-black">
          {type} Token
        </h2>
        <div className="mb-4">
          <label className="block text-[0.833vw] text-gray-600 mb-1">
            {type === "Reserve"
              ? "Current Reserve Balance"
              : "Current Token Supply"}
          </label>
          <p className="w-full font-jakarta text-[0.972vw] text-[#717680] border px-3 py-2 rounded bg-gray-100">
            {totalSupply} {symbol}
          </p>
        </div>
        <div className="mb-6">
          <label className="block text-[0.833vw] text-gray-600 mb-1">
            Amount to {type} <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            placeholder={`Enter amount to ${type.toLowerCase()}`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full font-jakarta text-[0.972vw] text-[#717680] border px-3 py-2 rounded bg-white"
          />
        </div>
        <div className="w-full flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800 text-[0.833vw] font-jakarta"
          >
            {type} Token
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenPopup;
