import { AiOutlineSearch } from "react-icons/ai";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { ethers } from "ethers";
import { useAccount, useWalletClient } from "wagmi";
import TokenActionPopup from "./TokenActionPopup";

// Supabase Client Setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// Smart Contract ABI
const TokenABI = [
  "function totalSupply() public view returns (uint256)",
  "function decimals() public view returns (uint256)",
  "function symbol() public view returns (string)",
  "function balanceOf(address account) public view returns (uint256)",
];

const ReserveABI = [
  "function getReserveBalance(address tokenAddress) external view returns (uint256)",
  "function getLastUpdateTimestamp() external view returns (uint256)",
];

interface Token {
  id: number;
  name: string;
  address: string;
  totalSupply: string;
  reserve: string;
  restake: string;
}

const RegisteredOperators = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const { address: account } = useAccount();
  const { data: walletClient } = useWalletClient();

  const fetchTokenData = async () => {
    setLoading(true);
    try {
      // Ambil data dari Supabase
      const { data: supabaseData, error } = await supabase
        .from("real_estate")
        .select("*");

      if (error) {
        console.error("Supabase error:", error);
        setTokens([]);
        setLoading(false);
        return;
      }

      // Format data awal dari Supabase
      const formattedTokens: Token[] = supabaseData.map(
        (item: any, index: number) => ({
          id: index + 1,
          name: item.name || "Unknown",
          address: item.address || "-",
          totalSupply: "-",
          reserve: "-",
          restake: "-",
        })
      );

      // Inisialisasi provider
      const provider = new ethers.JsonRpcProvider(
        "https://devnet.dplabs-internal.com"
      );

      // Debugging: Cek koneksi provider
      try {
        const network = await provider.getNetwork();
        console.log("Connected to network:", network);
      } catch (err) {
        console.error("Provider connection failed:", err);
        setTokens(formattedTokens);
        setLoading(false);
        return;
      }

      // Ambil data on-chain secara paralel
      const tokenPromises = formattedTokens.map(async (token) => {
        if (token.address !== "-" && ethers.isAddress(token.address)) {
          try {
            console.log(`Fetching data for token: ${token.address}`);

            // Verifikasi kontrak ada
            const code = await provider.getCode(token.address);
            if (code === "0x") {
              console.warn(`No contract at ${token.address}`);
              return { ...token, totalSupply: "-", reserve: "-" };
            }

            const tokenContract = new ethers.Contract(
              token.address,
              TokenABI,
              provider
            );
            const reserveContract = new ethers.Contract(
              reserveAddress,
              ReserveABI,
              provider
            );

            // Ambil decimals
            const decimalsBigInt = await tokenContract.decimals();
            const decimals = Number(decimalsBigInt);

            // Ambil symbol
            const symbol = await tokenContract.symbol();

            // Ambil totalSupply
            const totalSupplyRaw = await tokenContract.totalSupply();
            const totalSupply = parseFloat(
              ethers.formatUnits(totalSupplyRaw, decimals)
            ).toFixed(2);

            // Ambil reserve balance
            const reserveBalanceRaw = await reserveContract.getReserveBalance(
              token.address
            );
            const reserve = parseFloat(
              ethers.formatUnits(reserveBalanceRaw, decimals)
            ).toFixed(2);

            console.log(`Success for ${token.address}:`, {
              totalSupply,
              reserve,
              symbol,
            });

            return {
              ...token,
              totalSupply: `${totalSupply} ${symbol}`,
              reserve: `${reserve} ${symbol}`,
            };
          } catch (err) {
            console.error(`Error for ${token.address}:`, err);
            return { ...token, totalSupply: "-", reserve: "-" };
          }
        }
        return token;
      });

      const updatedTokens = await Promise.all(tokenPromises);
      setTokens(updatedTokens);
    } catch (err) {
      console.error("Error in fetchTokenData:", err);
      setTokens([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokenData();
  }, []);

  const filteredTokens = tokens.filter(
    (token) =>
      token.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      token.address.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <div className="flex flex-col bg-transparent p-[1.994vw] w-[51.667vw] aspect-[744/319] rounded-[0.694vw] border-2 border-[#D5D7DA] gap-[1.833vw]">
      <div className="flex flex-col gap-[1.111vw]">
        <h2 className="font-jakarta text-[1.25vw] text-black font-bold leading-[2.292vw] border-b-1 border-[#D5D7DA]">
          Token Restake List
        </h2>
        <div className="flex justify-between items-center w-full rounded-[0.833vw] border-1 border-[#B086E2] px-[1.333vw] py-[0.667vw]">
          <input
            type="text"
            placeholder="Search Tokens"
            className="w-full text-[0.972vw] font-jakarta text-[#A4A7AE] leading-[1.25vw] outline-none"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <button className="hover:cursor-pointer active:cursor-pointer flex items-center justify-center w-[1.25vw]">
            <AiOutlineSearch className="text-[1.25vw] aspect-square text-[#B086E2]" />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-[0.333vw]">
        <div className="flex flex-row justify-between items-center w-full bg-transparent border-b-1 border-[#D5D7DA] text-center pb-[0.667vw]">
          <p className="font-jakarta text-[0.833vw] text-black leading-[1.25vw] w-[20%]">
            TOKEN NAME
          </p>
          <p className="font-jakarta text-[0.833vw] text-black leading-[1.25vw] w-[30%]">
            TOKEN ADDRESS
          </p>
          <p className="font-jakarta text-[0.833vw] text-black leading-[1.25vw] w-[15%]">
            TOKEN SUPPLY
          </p>
          <p className="font-jakarta text-[0.833vw] text-black leading-[1.25vw] W-[15%]">
            TOKEN RESERVE
          </p>
          <p className="font-jakarta text-[0.833vw] text-black leading-[1.25vw] w-[15%]">
            TOKEN RESTAKE
          </p>
          <p className="font-jakarta text-[0.833vw] text-black leading-[1.25vw] w-[15%]">
            ACTIONS
          </p>
        </div>
        <div className="flex flex-col gap-[1vw]">
          {loading ? (
            <p className="text-center text-[0.972vw] text-gray-500">
              Loading...
            </p>
          ) : filteredTokens.length > 0 ? (
            filteredTokens.map((token) => (
              <div
                key={token.id}
                className="flex flex-row justify-between items-center w-full border-b border-[#D5D7DA] pb-[0.333vw]"
              >
                <span className="font-jakarta text-center font-medium text-[0.972vw] text-black w-[20%]">
                  {token.name}
                </span>
                <span className="font-jakarta text-center font-medium text-[0.972vw] text-black w-[30%]">
                  {token.address.slice(0, 6)}...{token.address.slice(-4)}
                </span>
                <span className="font-jakarta text-center font-medium text-[0.972vw] text-black w-[15%]">
                  {token.totalSupply}
                </span>
                <span className="font-jakarta text-center font-medium text-[0.972vw] text-black w-[15%]">
                  {token.reserve}
                </span>
                <span className="font-jakarta text-center font-medium text-[0.972vw] text-black w-[15%]">
                  {token.restake}
                </span>
                <span className="font-jakarta text-center font-medium text-[0.972vw] text-black w-[15%]">
                  <button
                    onClick={() => setSelectedToken(token)}
                    className="bg-purple-500 text-white px-[0.5vw] py-[0.2vw] rounded-[0.3vw] hover:bg-purple-600 text-[0.8vw]"
                  >
                    Action
                  </button>
                </span>
              </div>
            ))
          ) : (
            <p className="text-center text-[0.972vw] text-gray-500">
              Tidak ada token ditemukan
            </p>
          )}
        </div>
      </div>
      <TokenActionPopup
        isOpen={!!selectedToken}
        onClose={() => setSelectedToken(null)}
        token={
          selectedToken || {
            id: 0,
            name: "",
            address: "",
            totalSupply: "",
            reserve: "",
            restake: "",
          }
        }
        walletClient={walletClient}
        account={account}
      />
    </div>
  );
};

export default RegisteredOperators;
