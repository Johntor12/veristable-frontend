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

// ABI dan Alamat Kontrak
const TokenFactoryABI = [
  "function createToken(string name, string symbol, address tokenOwner) public returns (address)",
  "function getTokensByUser(address user) public view returns (address[])",
  "function addToAVSTokens(address token) public",
  "function removeFromAVSTokens(address token) public",
  "function getUserTokenCount(address user) public view returns (uint256)",
];

const TokenABI = [
  "function mint(address to, uint256 amount) public",
  "function burn(uint256 amount) public",
  "function balanceOf(address account) public view returns (uint256)",
  "function totalSupply() public view returns (uint256)",
  "function decimals() public view returns (uint256)",
  "function symbol() public view returns (string)",
  "function owner() public view returns (address)",
];

const ReserveABI = [
  "function setReserveBalance(address tokenAddress, uint256 newBalance) external",
  "function getReserveBalance(address tokenAddress) external view returns (uint256)",
  "function getLastUpdateTimestamp() external view returns (uint256)",
];

const VeristableAVSABI = [
  "function underwrite(address token, uint128 amount) external",
  "function withdraw(address token, uint128 amount) external",
  "function claimRewards(address token) external",
  "function depositRewards(address token, uint128 amount) public",
  "function pause() public",
  "function unpause() public",
  "function transferOwnership(address newOwner) public",
  "function paused() public view returns (bool)",
  "function owner() public view returns (address)",
  "function underwritingAmounts(address token, address underwriter) public view returns (uint128)",
  "function totalUnderwriting(address token) public view returns (uint128)",
  "function totalRewards(address token) public view returns (uint128)",
  "function unclaimedRewards(address token, address underwriter) public view returns (uint128)",
];

// Alamat Kontrak di Pharos Network (NEW)
const reserveAddress = "0xb080914D90A76EC677a9d288e9BF03B9a052769d";
const veristableAVSAddress = "0x9Ec9eb3E56B0B66948dB51ce98A56cA7a5b49Ad7";

type TokenAction = {
  label: React.ReactNode;
  text: string;
  isPrimary?: boolean;
  onClick?: () => void;
};

type TokenProps = {
  contractAddress?: string;
  // owner?: string;
};

type ActionTokenCardProps = TokenAction & {
  customClass?: string;
};

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

const TokenCard = ({ contractAddress }: TokenProps) => {
  const { address: account } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [totalSupply, setTotalSupply] = useState(0);
  const [ownedByYou, setOwnedByYou] = useState(0);
  const [reserveBalance, setReserveBalance] = useState(0);
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
        setLoading(true);
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching token data...");
        console.log("Account:", account);
        console.log("WalletClient:", walletClient);
        console.log("Contract Address:", contractAddress);

        const provider = new ethers.BrowserProvider(walletClient);
        const tokenContract = new ethers.Contract(
          contractAddress,
          TokenABI,
          provider
        );
        const reserveContract = new ethers.Contract(
          reserveAddress,
          ReserveABI,
          provider
        );

        // Ambil totalSupply
        const totalSupplyRaw = await tokenContract.totalSupply();
        const decimals = await tokenContract.decimals();
        const totalSupply = Number(
          ethers.formatUnits(totalSupplyRaw, decimals)
        );
        setTotalSupply(totalSupply);

        // Ambil balanceOf (owned by you)
        const balanceRaw = await tokenContract.balanceOf(account);
        const balance = Number(ethers.formatUnits(balanceRaw, decimals));
        setOwnedByYou(balance);

        // Ambil reserve balance
        const reserveBalanceRaw =
          await reserveContract.getReserveBalance(contractAddress);
        const reserveBalance = Number(
          ethers.formatUnits(reserveBalanceRaw, decimals)
        );
        setReserveBalance(reserveBalance);

        // Ambil decimals
        setDecimals(Number(decimals));

        // Ambil symbol
        const symbol = await tokenContract.symbol();
        setSymbol(symbol);

        console.log("Token data:", {
          totalSupply,
          balance,
          reserveBalance,
          decimals,
          symbol,
        });
      } catch (err: string) {
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

  // Fungsi untuk reserve token (underwrite)
  const handleReserve = async (amount: number) => {
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
      const veristableAVSContract = new ethers.Contract(
        veristableAVSAddress,
        VeristableAVSABI,
        signer
      );
      const reserveContract = new ethers.Contract(
        reserveAddress,
        ReserveABI,
        signer
      );

      // Konversi amount ke format uint128 yang sesuai
      const amountRaw = ethers.parseUnits(amount.toString(), decimals);

      // Panggil fungsi underwrite di VeristableAVS
      const underwriteTx = await veristableAVSContract.underwrite(
        contractAddress,
        amountRaw
      );
      await underwriteTx.wait();

      // Update reserve balance di Reserve contract
      const newReserveBalance = reserveBalance + amount;
      const reserveTx = await reserveContract.setReserveBalance(
        contractAddress,
        ethers.parseUnits(newReserveBalance.toString(), decimals)
      );
      await reserveTx.wait();

      // Perbarui state setelah reserve
      const reserveBalanceRaw =
        await reserveContract.getReserveBalance(contractAddress);
      setReserveBalance(
        Number(ethers.formatUnits(reserveBalanceRaw, decimals))
      );

      alert(`Successfully reserved ${amount} ${symbol}!`);
    } catch (err: any) {
      console.error("Error reserving token:", err);
      alert(
        `Failed to reserve token: ${err.reason || err.message || "Unknown error"}`
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
        handleReserve(amount);
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
                  {reserveBalance} {symbol}
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
