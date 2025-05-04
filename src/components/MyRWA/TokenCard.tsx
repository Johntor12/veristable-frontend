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
import { createClient } from "@supabase/supabase-js";

// Supabase Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Validate Supabase configuration
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Supabase configuration missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
  );
}
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

// Alamat Kontrak di Pharos Network
const reserveAddress = "0xb080914D90A76EC677a9d288e9BF03B9a052769d";

type TokenAction = {
  label: React.ReactNode;
  text: string;
  isPrimary?: boolean;
  onClick?: () => void;
};

type TokenProps = {
  contractAddress?: string;
  owner?: string;
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

const TokenCard = ({
  contractAddress = "0x123",
  owner = "unknown",
}: TokenProps) => {
  const { address: account } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [totalSupply, setTotalSupply] = useState(0);
  const [ownedByYou, setOwnedByYou] = useState(0);
  const [reserveBalance, setReserveBalance] = useState(0);
  const [lastUpdateTimestamp, setLastUpdateTimestamp] = useState("");
  const [decimals, setDecimals] = useState(18);
  const [symbol, setSymbol] = useState("BAL");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState<"Mint" | "Burn" | "Reserve">(
    "Mint"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Test Supabase connectivity on component mount
  useEffect(() => {
    const testSupabase = async () => {
      console.log("Testing Supabase connectivity...");
      try {
        const { data, error } = await supabase
          .from("real_estate")
          .select("address")
          .limit(1);
        console.log("Supabase test result:", { data, error });
        if (error) {
          console.error("Supabase connectivity test failed:", error);
        } else {
          console.log("Supabase connectivity test successful. Data:", data);
        }
      } catch (err) {
        console.error("Supabase connectivity test error:", err);
      }
    };
    testSupabase();
  }, []);

  // Log contractAddress dan owner untuk debugging
  useEffect(() => {
    console.log("Received contractAddress:", contractAddress);
    console.log("Received owner:", owner);
    console.log("Is valid contractAddress:", ethers.isAddress(contractAddress));
    console.log("Is valid owner:", ethers.isAddress(owner));
  }, [contractAddress, owner]);

  // Fungsi untuk menyimpan data ke Supabase
  const saveToSupabase = async (
    onchainTotalSupply: number,
    onchainReserveBalance: number
  ) => {
    if (!ethers.isAddress(contractAddress)) {
      console.error("Invalid contract address for Supabase:", contractAddress);
      setErrorMessage("Invalid contract address for saving to Supabase");
      return;
    }

    if (!ethers.isAddress(owner)) {
      console.error("Invalid owner address for Supabase:", owner);
      setErrorMessage("Invalid owner address for saving to Supabase");
      return;
    }

    const realEstateData = {
      address: contractAddress,
      owner: owner,
      reserve: Math.floor(onchainReserveBalance),
      totalSupply: Math.floor(onchainTotalSupply),
    };

    try {
      console.log(
        "Attempting to save to Supabase real_estate table:",
        realEstateData
      );

      // Check if row exists
      const { data: existingData, error: selectError } = await supabase
        .from("real_estate")
        .select("address")
        .eq("address", contractAddress)
        .single();

      console.log("Supabase select response:", { existingData, selectError });

      if (selectError && selectError.code !== "PGRST116") {
        console.error("Supabase select error:", selectError);
        throw new Error(
          `Failed to check existing data: ${selectError.message || JSON.stringify(selectError)}`
        );
      }

      let data, error;
      if (existingData) {
        // Update existing row
        ({ data, error } = await supabase
          .from("real_estate")
          .update({
            owner: owner,
            reserve: Math.floor(onchainReserveBalance),
            totalSupply: Math.floor(onchainTotalSupply),
          })
          .eq("address", contractAddress));
      } else {
        // Insert new row
        ({ data, error } = await supabase
          .from("real_estate")
          .insert([realEstateData]));
      }

      console.log("Supabase operation response:", { data, error });

      if (error) {
        console.error("Supabase operation error:", error);
        throw new Error(
          `Failed to save to Supabase: ${error.message || JSON.stringify(error)}`
        );
      }

      console.log("Successfully saved to Supabase real_estate table:", data);
    } catch (err: string) {
      console.error("Error saving to Supabase:", err);
      setErrorMessage(
        `Failed to save to Supabase: ${err.message || "Unknown error"}`
      );
    }
  };

  // Fetch data token dari kontrak (tanpa menyimpan ke Supabase)
  useEffect(() => {
    const fetchTokenData = async () => {
      if (!walletClient || !account || !ethers.isAddress(contractAddress)) {
        setErrorMessage("Invalid token address or wallet not connected.");
        setIsLoadingBalance(true);
        return;
      }

      try {
        setIsLoadingBalance(true);
        setErrorMessage(null);
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

        // Ambil decimals dan konversi ke number
        const decimalsBigInt = await tokenContract.decimals();
        const decimals = Number(decimalsBigInt);
        setDecimals(decimals);

        // Ambil totalSupply
        const totalSupplyRaw = await tokenContract.totalSupply();
        const totalSupply = parseFloat(
          ethers.formatUnits(totalSupplyRaw, decimals)
        );
        setTotalSupply(totalSupply);

        // Ambil balanceOf (owned by you)
        const balanceRaw = await tokenContract.balanceOf(account);
        const balance = parseFloat(ethers.formatUnits(balanceRaw, decimals));
        setOwnedByYou(balance);

        // Ambil reserve balance dan timestamp
        const [reserveBalanceRaw, timestampBigInt] = await Promise.all([
          reserveContract.getReserveBalance(contractAddress),
          reserveContract.getLastUpdateTimestamp(),
        ]);
        const reserveBalance = parseFloat(
          ethers.formatUnits(reserveBalanceRaw, decimals)
        );
        const timestamp = Number(timestampBigInt);
        setReserveBalance(reserveBalance);
        setLastUpdateTimestamp(new Date(timestamp * 1000).toLocaleString());

        // Ambil symbol
        const symbol = await tokenContract.symbol();
        setSymbol(symbol);

        console.log("Token data:", {
          totalSupply,
          balance,
          reserveBalance,
          decimals,
          symbol,
          lastUpdateTimestamp: new Date(timestamp * 1000).toLocaleString(),
        });
      } catch (err: string) {
        console.error("Error fetching token data:", err);
        setErrorMessage(
          `Failed to load token data: ${err.reason || err.message || "Unknown error"}`
        );
        setReserveBalance(0);
        setLastUpdateTimestamp("N/A");
      } finally {
        setIsLoadingBalance(false);
      }
    };

    fetchTokenData();
  }, [walletClient, account, contractAddress]);

  // Fungsi untuk mint token
  const handleMint = async (amount: number) => {
    if (!walletClient || !account) {
      setErrorMessage("Please connect your wallet!");
      return;
    }

    if (amount <= 0 || isNaN(amount)) {
      setErrorMessage("Amount must be greater than 0");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, TokenABI, signer);
      const reserveContract = new ethers.Contract(
        reserveAddress,
        ReserveABI,
        provider
      );

      // Validasi bahwa hanya owner yang bisa mint
      const contractOwner = await contract.owner();
      if (contractOwner.toLowerCase() !== account.toLowerCase()) {
        setErrorMessage("Only the contract owner can mint tokens");
        return;
      }

      // Konversi amount ke format yang sesuai dengan decimals
      const amountRaw = ethers.parseUnits(amount.toString(), decimals);

      // Panggil fungsi mint
      const tx = await contract.mint(account, amountRaw);
      await tx.wait();

      // Ambil data onchain terbaru
      const totalSupplyRaw = await contract.totalSupply();
      const newTotalSupply = parseFloat(
        ethers.formatUnits(totalSupplyRaw, decimals)
      );
      const balanceRaw = await contract.balanceOf(account);
      const newBalance = parseFloat(ethers.formatUnits(balanceRaw, decimals));
      const reserveBalanceRaw =
        await reserveContract.getReserveBalance(contractAddress);
      const newReserveBalance = parseFloat(
        ethers.formatUnits(reserveBalanceRaw, decimals)
      );

      // Perbarui state
      setTotalSupply(newTotalSupply);
      setOwnedByYou(newBalance);

      // Simpan ke Supabase dengan data onchain
      await saveToSupabase(newTotalSupply, newReserveBalance);

      setErrorMessage(null);
      alert(`Successfully minted ${amount} ${symbol}!`);
    } catch (err: string) {
      console.error("Error minting token:", err);
      setErrorMessage(
        `Failed to mint token: ${err.reason || err.message || "Unknown error"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk burn token
  const handleBurn = async (amount: number) => {
    if (!walletClient || !account) {
      setErrorMessage("Please connect your wallet!");
      return;
    }

    if (amount <= 0 || isNaN(amount)) {
      setErrorMessage("Amount must be greater than 0");
      return;
    }

    if (amount > ownedByYou) {
      setErrorMessage("Cannot burn more tokens than you own");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, TokenABI, signer);
      const reserveContract = new ethers.Contract(
        reserveAddress,
        ReserveABI,
        provider
      );

      // Validasi bahwa hanya owner yang bisa burn
      const contractOwner = await contract.owner();
      if (contractOwner.toLowerCase() !== account.toLowerCase()) {
        setErrorMessage("Only the contract owner can burn tokens");
        return;
      }

      // Konversi amount ke format yang sesuai dengan decimals
      const amountRaw = ethers.parseUnits(amount.toString(), decimals);

      // Panggil fungsi burn
      const tx = await contract.burn(amountRaw);
      await tx.wait();

      // Ambil data onchain terbaru
      const totalSupplyRaw = await contract.totalSupply();
      const newTotalSupply = parseFloat(
        ethers.formatUnits(totalSupplyRaw, decimals)
      );
      const balanceRaw = await contract.balanceOf(account);
      const newBalance = parseFloat(ethers.formatUnits(balanceRaw, decimals));
      const reserveBalanceRaw =
        await reserveContract.getReserveBalance(contractAddress);
      const newReserveBalance = parseFloat(
        ethers.formatUnits(reserveBalanceRaw, decimals)
      );

      // Perbarui state
      setTotalSupply(newTotalSupply);
      setOwnedByYou(newBalance);

      // Simpan ke Supabase dengan data onchain
      await saveToSupabase(newTotalSupply, newReserveBalance);

      setErrorMessage(null);
      alert(`Successfully burned ${amount} ${symbol}!`);
    } catch (err: string) {
      console.error("Error burning token:", err);
      setErrorMessage(
        `Failed to burn token: ${err.reason || err.message || "Unknown error"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk set reserve balance
  const handleReserve = async (amount: number) => {
    if (!walletClient || !account) {
      setErrorMessage("Please connect your wallet!");
      return;
    }

    if (!ethers.isAddress(contractAddress)) {
      setErrorMessage("Invalid token address.");
      return;
    }

    if (amount <= 0 || isNaN(amount)) {
      setErrorMessage("Please enter a valid positive reserve amount.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);

      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const reserveContract = new ethers.Contract(
        reserveAddress,
        ReserveABI,
        signer
      );
      const tokenContract = new ethers.Contract(
        contractAddress,
        TokenABI,
        provider
      );

      // Konversi amount ke format yang sesuai dengan decimals
      const amountRaw = ethers.parseUnits(amount.toString(), decimals);

      // Panggil fungsi setReserveBalance
      const tx = await reserveContract.setReserveBalance(
        contractAddress,
        amountRaw
      );
      await tx.wait();

      // Ambil data onchain terbaru
      const reserveBalanceRaw =
        await reserveContract.getReserveBalance(contractAddress);
      const newReserveBalance = parseFloat(
        ethers.formatUnits(reserveBalanceRaw, decimals)
      );
      const totalSupplyRaw = await tokenContract.totalSupply();
      const newTotalSupply = parseFloat(
        ethers.formatUnits(totalSupplyRaw, decimals)
      );
      const timestampBigInt = await reserveContract.getLastUpdateTimestamp();
      const timestamp = Number(timestampBigInt);

      // Perbarui state
      setReserveBalance(newReserveBalance);
      setLastUpdateTimestamp(new Date(timestamp * 1000).toLocaleString());

      // Simpan ke Supabase dengan data onchain
      await saveToSupabase(newTotalSupply, newReserveBalance);

      setErrorMessage(null);
      alert(`Successfully set reserve balance to ${amount} ${symbol}!`);
    } catch (err: string) {
      console.error("Error setting reserve balance:", err);
      let userMessage = "Failed to set reserve balance.";
      if (err.reason) {
        userMessage += ` Reason: ${err.reason}`;
      } else if (err.message) {
        userMessage += ` Error: ${err.message}`;
      }
      setErrorMessage(userMessage);
    } finally {
      setIsLoading(false);
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

  if (errorMessage && !isLoadingBalance) {
    return (
      <div className="flex flex-col bg-transparent p-[1.994vw] w-[51.667vw] aspect-[744/262] rounded-[0.694vw] border-2 border-[#D5D7DA] gap-[1.833vw]">
        <p className="text-red-500 font-jakarta">{errorMessage}</p>
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
          {isLoadingBalance ? (
            <p className="font-jakarta text-[0.833vw] text-[#717680]">
              Loading reserve data...
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
              <div className="flex flex-col">
                <p className="font-jakarta text-[0.833vw] leading-[1.25vw] text-[#717680]">
                  Last Update
                </p>
                <div className="text-[1.111vw] font-bold text-black leading-[1.667vw]">
                  {lastUpdateTimestamp || "N/A"}
                </div>
              </div>
            </div>
          )}
          {errorMessage && (
            <p className="text-red-500 font-jakarta text-[0.833vw]">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-[0.833vw] bg-[#FAFAFA] p-[1.883vw]">
          <p className="font-jakarta text-[1.25vw] leading-[1.875vw] text-black font-bold border-b-2 border-[#D5D7DA]">
            Token Details
          </p>
          {isLoadingBalance ? (
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
        reserveBalance={reserveBalance}
        symbol={symbol}
        isLoading={isLoading}
        errorMessage={errorMessage}
      />
    </>
  );
};

export default TokenCard;
