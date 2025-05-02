"use client";

import {
  HiOutlineFire,
  HiOutlineShare,
  HiOutlinePaperAirplane,
} from "react-icons/hi";
import { IoAdd } from "react-icons/io5";
import { useState, useEffect } from "react";
import TokenPopup from "./TokenPopup";
import { useAccount, useWalletClient } from "wagmi";
import { ethers } from "ethers";

type TokenAction = {
  label: React.ReactNode;
  text: string;
  isPrimary?: boolean;
  onClick?: () => void;
};

type TokenProps = {
  contractAddress: string;
  owner: string;
};

type ActionTokenCardProps = TokenAction & {
  customClass?: string;
};

// ABI Kontrak Token
const TokenABI = [
  "function mint(address to, uint256 amount) public",
  "function burn(uint256 amount) public",
  "function balanceOf(address account) public view returns (uint256)",
  "function totalSupply() public view returns (uint256)",
  "function decimals() public view returns (uint256)",
  "function symbol() public view returns (string)",
  "function owner() public view returns (address)",
];

const ActionTokenCard = ({
  label,
  text,
  isPrimary = false,
  onClick = () => {},
  customClass = "",
}: ActionTokenCardProps) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex flex-row p-[0.667vw] 
        justify-center items-center rounded-[0.208vw]
        font-jakarta gap-[0.5vw] hover:cursor-pointer
        ${isPrimary ? "bg-[#6400C9] text-white" : "bg-[#F5F5F5] text-[#717680]"}
        ${customClass}
      `}
    >
      {label}
      <span className="text-[0.972vw]">{text}</span>
    </button>
  );
};

const TokenCard = ({ contractAddress, owner }: TokenProps) => {
  const { address: account } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [totalSupply, setTotalSupply] = useState(0);
  const [ownedByYou, setOwnedByYou] = useState(0);
  const [decimals, setDecimals] = useState(18);
  const [symbol, setSymbol] = useState("BAL");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState<"Mint" | "Burn" | "Reserve">(
    "Mint"
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Log contractAddress untuk debugging
  useEffect(() => {
    console.log("Received contractAddress:", contractAddress);
    console.log("Is valid address:", ethers.isAddress(contractAddress));
  }, [contractAddress]);

  // Fetch data token dari kontrak
  useEffect(() => {
    const fetchTokenData = async () => {
      if (!walletClient || !account) {
        setLoading(true); // Tetap loading hingga wallet terhubung
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching token data...");
        console.log("Account:", account);
        console.log("WalletClient:", walletClient);
        console.log("Contract Address:", contractAddress);

        const provider = new ethers.BrowserProvider(walletClient);
        const contract = new ethers.Contract(
          contractAddress,
          TokenABI,
          provider
        );

        // Ambil totalSupply
        const totalSupplyRaw = await contract.totalSupply();
        const decimals = await contract.decimals();
        const totalSupply = Number(
          ethers.formatUnits(totalSupplyRaw, decimals)
        );
        setTotalSupply(totalSupply);

        // Ambil balanceOf (owned by you)
        const balanceRaw = await contract.balanceOf(account);
        const balance = Number(ethers.formatUnits(balanceRaw, decimals));
        setOwnedByYou(balance);

        // Ambil decimals
        setDecimals(Number(decimals));

        // Ambil symbol
        const symbol = await contract.symbol();
        setSymbol(symbol);

        console.log("Token data:", { totalSupply, balance, decimals, symbol });
      } catch (err: any) {
        console.error("Error fetching token data:", err);
        setError(
          `Failed to load token data: ${err.reason || err.message || "Unknown error"}`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTokenData();
  }, [walletClient, account, contractAddress]);

  // Fungsi untuk mint token
  const handleMint = async (amount: number) => {
    if (!walletClient || !account) {
      alert("Please connect your wallet!");
      return;
    }

    if (amount <= 0) {
      alert("Amount must be greater than 0");
      return;
    }

    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, TokenABI, signer);

      // Validasi bahwa hanya owner yang bisa mint
      const contractOwner = await contract.owner();
      if (contractOwner.toLowerCase() !== account.toLowerCase()) {
        alert("Only the contract owner can mint tokens");
        return;
      }

      // Konversi amount ke format yang sesuai dengan decimals
      const amountRaw = ethers.parseUnits(amount.toString(), decimals);

      // Panggil fungsi mint
      const tx = await contract.mint(account, amountRaw);
      await tx.wait();

      // Perbarui state setelah mint
      const totalSupplyRaw = await contract.totalSupply();
      setTotalSupply(Number(ethers.formatUnits(totalSupplyRaw, decimals)));
      const balanceRaw = await contract.balanceOf(account);
      setOwnedByYou(Number(ethers.formatUnits(balanceRaw, decimals)));

      alert(`Successfully minted ${amount} ${symbol}!`);
    } catch (err: any) {
      console.error("Error minting token:", err);
      alert(
        `Failed to mint token: ${err.reason || err.message || "Unknown error"}`
      );
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk burn token
  const handleBurn = async (amount: number) => {
    if (!walletClient || !account) {
      alert("Please connect your wallet!");
      return;
    }

    if (amount <= 0) {
      alert("Amount must be greater than 0");
      return;
    }

    if (amount > ownedByYou) {
      alert("Cannot burn more tokens than you own");
      return;
    }

    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, TokenABI, signer);

      // Validasi bahwa hanya owner yang bisa burn
      const contractOwner = await contract.owner();
      if (contractOwner.toLowerCase() !== account.toLowerCase()) {
        alert("Only the contract owner can burn tokens");
        return;
      }

      // Konversi amount ke format yang sesuai dengan decimals
      const amountRaw = ethers.parseUnits(amount.toString(), decimals);

      // Panggil fungsi burn
      const tx = await contract.burn(amountRaw);
      await tx.wait();

      // Perbarui state setelah burn
      const totalSupplyRaw = await contract.totalSupply();
      setTotalSupply(Number(ethers.formatUnits(totalSupplyRaw, decimals)));
      const balanceRaw = await contract.balanceOf(account);
      setOwnedByYou(Number(ethers.formatUnits(balanceRaw, decimals)));

      alert(`Successfully burned ${amount} ${symbol}!`);
    } catch (err: any) {
      console.error("Error burning token:", err);
      alert(
        `Failed to burn token: ${err.reason || err.message || "Unknown error"}`
      );
    } finally {
      setLoading(false);
    }
  };

  // Handler untuk popup submit
  const handlePopupSubmit = (amount: number) => {
    switch (popupType) {
      case "Mint":
        handleMint(amount);
        break;
      case "Burn":
        handleBurn(amount);
        break;
      case "Reserve":
        alert(`Token ${amount} reserved successfully (not implemented).`);
        break;
    }
    setIsPopupOpen(false);
  };

  const tokenActions: TokenAction[] = [
    {
      label: <HiOutlineFire className="text-[1.25vw]" />,
      text: "Reserve",
      onClick: () => {
        setPopupType("Reserve");
        setIsPopupOpen(true);
      },
    },
    {
      label: <HiOutlineFire className="text-[1.25vw]" />,
      text: "Burn",
      onClick: () => {
        setPopupType("Burn");
        setIsPopupOpen(true);
      },
    },
    {
      label: <HiOutlinePaperAirplane className="text-[1.25vw]" />,
      text: "Airdrop",
      onClick: () => alert("Airdrop not implemented yet"),
    },
    {
      label: <HiOutlineShare className="text-[1.25vw]" />,
      text: "Share",
      onClick: () => alert("Share not implemented yet"),
    },
    {
      label: <IoAdd className="text-[1.25vw]" />,
      text: "Mint",
      isPrimary: true,
      onClick: () => {
        setPopupType("Mint");
        setIsPopupOpen(true);
      },
    },
  ];

  // Jika wallet belum terhubung, tampilkan UI untuk koneksi
  if (!account || !walletClient) {
    return (
      <div className="flex flex-col bg-transparent p-[1.994vw] w-[51.667vw] aspect-[744/262] rounded-[0.694vw] border-2 border-[#D5D7DA] gap-[1.833vw]">
        <p className="text-[#717680] font-jakarta text-[0.833vw]">
          Please connect your wallet to view token data
        </p>
        <button
          onClick={() =>
            window.ethereum.request({ method: "eth_requestAccounts" })
          }
          className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800 text-[0.833vw] font-jakarta w-[10vw]"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col bg-transparent p-[1.994vw] w-[51.667vw] aspect-[744/262] rounded-[0.694vw] border-2 border-[#D5D7DA] gap-[1.833vw]">
        <p className="text-red-500 font-jakarta">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col bg-transparent p-[1.994vw] w-[51.667vw] aspect-[744/262] rounded-[0.694vw] border-2 border-[#D5D7DA] gap-[1.833vw]">
        <div className="flex flex-row justify-between pb-[0.833vw] pr-[1.994vw] border-b-1 border-[#D5D7DA]">
          <div className="font-jakarta font-bold text-[1.528vw] leading-[2.292vw] text-black">
            Tokens
          </div>
          <div className="flex flex-row w-[29.4vw] aspect-[316/34] gap-[0.667vw]">
            {tokenActions.map((action, index) => (
              <ActionTokenCard
                key={index}
                {...action}
                customClass="w-full h-full justify-center"
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-[0.833vw] bg-[#FAFAFA] p-[1.883vw]">
          <p className="font-jakarta text-[1.25vw] leading-[1.875vw] text-black font-bold border-b-2 border-[#D5D7DA]">
            Reserve Details
          </p>
          {loading ? (
            <p className="font-jakarta text-[0.833vw] text-[#717680]">
              Loading token data...
            </p>
          ) : (
            <div className="flex flex-row justify-between">
              <div className="flex flex-col">
                <p className="font-jakarta text-[0.833vw] leading-[1.25vw] text-[#717680]">
                  Total Reserve
                </p>
                <div className="text-[1.111vw] font-bold text-black leading-[1.667vw]">
                  {totalSupply}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-[0.833vw] bg-[#FAFAFA] p-[1.883vw]">
          <p className="font-jakarta text-[1.25vw] leading-[1.875vw] text-black font-bold border-b-2 border-[#D5D7DA]">
            Token Details
          </p>
          {loading ? (
            <p className="font-jakarta text-[0.833vw] text-[#717680]">
              Loading token data...
            </p>
          ) : (
            <div className="flex flex-row justify-between">
              <div className="flex flex-col">
                <p className="font-jakarta text-[0.833vw] leading-[1.25vw] text-[#717680]">
                  Total Supply
                </p>
                <div className="text-[1.111vw] font-bold text-black leading-[1.667vw]">
                  {totalSupply} {symbol}
                </div>
              </div>
              <div className="flex flex-col">
                <p className="font-jakarta text-[0.833vw] leading-[1.25vw] text-[#717680]">
                  Owned by you
                </p>
                <div className="text-[1.111vw] font-bold text-black leading-[1.667vw]">
                  {ownedByYou} {symbol}
                </div>
              </div>
              <div className="flex flex-col">
                <p className="font-jakarta text-[0.833vw] leading-[1.25vw] text-[#717680]">
                  Decimals
                </p>
                <div className="text-[1.111vw] font-bold text-black leading-[1.667vw]">
                  {decimals}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <TokenPopup
        isOpen={isPopupOpen}
        type={popupType}
        onClose={() => setIsPopupOpen(false)}
        onSubmit={handlePopupSubmit}
        totalSupply={totalSupply}
        symbol={symbol}
      />
    </>
  );
};

export default TokenCard;
