import { IoClose } from "react-icons/io5";
import { useState } from "react";

type TokenPopupProps = {
  type?: "Mint" | "Burn" | "Reserve";
  isOpen: boolean;
  onClose?: () => void;
  onSubmit: (amount: number) => void;
};

const TokenPopup = ({
  type = "Mint",
  isOpen,
  onClose,
  onSubmit,
}: TokenPopupProps) => {
  const [isShown, setIsShown] = useState(false);
  const [amount, setAmount] = useState("");
  const [totalToken, setTotalToken] = useState("");

  const handleVerify = () => {
    const amountNum = parseFloat(amount);
    const totalNum = parseFloat(totalToken);

    if (isNaN(amountNum) || isNaN(totalNum)) {
      alert("Harap masukkan angka yang valid.");
      return;
    }

    let updatedTotal = totalNum;

    switch (type) {
      case "Mint":
        updatedTotal = totalNum + amountNum;
        console.log(`Token Minted: ${amountNum}`);
        onSubmit(updatedTotal);
        break;

      case "Burn":
        updatedTotal = totalNum - amountNum;
        console.log(`Token Burned: ${amountNum}`);
        onSubmit(updatedTotal);
        break;

      case "Reserve":
        console.log(`Token Reserved: ${amountNum}`);
        break;
    }

    if (type === "Mint" || type === "Burn") {
      setTotalToken(updatedTotal.toString());
    }

    alert(`${type} berhasil diproses!`);
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="absolute bg-white rounded-lg w-[30vw] p-6 relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-xl">
          <IoClose className="text-black" />
        </button>
        <h2 className="font-jakarta text-[0.833vw] leading-[1.25vw] font-bold mb-4 text-black">
          {type} Token
        </h2>
        <div className="mb-4">
          <label className="blocype-sm text-gray-600 mb-1">Token Supply</label>
          <input
            type="text"
            placeholder="200.000 NL"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full font-jakarta font-regular text-[#717680] border px-3 py-2 rounded bg-white"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-1">
            Token {type}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Type here"
            value={totalToken}
            onChange={(e) => setTotalToken(e.target.value)}
            className="w-full border px-3 py-2 rounded text-[#717680] border px-3 py-2 rounded bg-white"
          />
        </div>
        <div className="w-full flex justify-end">
          <button
            onClick={handleVerify}
            className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
          >
            Verify RWA
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenPopup;
