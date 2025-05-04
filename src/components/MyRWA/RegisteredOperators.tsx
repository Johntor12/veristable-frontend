import { AiOutlineSearch } from "react-icons/ai";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useAccount, useWalletClient } from "wagmi";
import TokenActionPopup from "./TokenActionPopup";

// Supabase Client Setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

interface Token {
  id: number;
  name: string;
  address: string;
  totalSupply: number;
  reserve: number;
  restake: number; // Sekarang float
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

      // Format data dari Supabase ke interface Token
      const formattedTokens: Token[] = supabaseData.map(
        (item: any, index: number) => ({
          id: index + 1,
          name: item.name || "Unknown",
          address: item.address || "-",
          totalSupply: item.totalSupply ? Number(item.totalSupply) : "-",
          reserve: item.reserve ? Number(item.reserve) : "-",
          restake: item.restake ? Number(item.restake) : "-", // Float tetap dibiarkan sebagai number
        })
      );

      setTokens(formattedTokens);
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
      <div className="flex flex-col gap-[0.833vw] bg-[#FAFAFA] p-[1.883vw]">
        <p className="font-jakarta text-[1.25vw] leading-[1.875vw] text-black font-bold border-b-2 border-[#D5D7DA]">
          Token List Details
        </p>
        <div className="flex flex-row justify-between items-center w-full bg-transparent border-b-1 border-[#D5D7DA] text-center pb-[0.667vw]">
          <p className="font-jakarta text-[0.833vw] text-[#717680] leading-[1.25vw] w-[15%]">
            TOKEN NAME
          </p>
          <p className="font-jakarta text-[0.833vw] text-[#717680] leading-[1.25vw] w-[15%]">
            STATUS
          </p>
          <p className="font-jakarta text-[0.833vw] text-[#717680] leading-[1.25vw] w-[20%]">
            TOKEN ADDRESS
          </p>
          <p className="font-jakarta text-[0.833vw] text-[#717680] leading-[1.25vw] w-[15%]">
            TOKEN SUPPLY
          </p>
          <p className="font-jakarta text-[0.833vw] text-[#717680] leading-[1.25vw] w-[15%]">
            RESERVE
          </p>
          <p className="font-jakarta text-[0.833vw] text-[#717680] leading-[1.25vw] w-[15%]">
            RESTAKE
          </p>
          <p className="font-jakarta text-[0.833vw] text-[#717680] leading-[1.25vw] w-[15%]">
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
                <span className="font-jakarta text-center font-medium text-[0.972vw] text-black w-[15%]">
                  {token.name}
                </span>
                <span
                  className={`font-jakarta text-center font-medium text-[0.972vw] w-[15%] text-white px-[0.5vw] py-[0.2vw] rounded-[0.2vw] ${Number(token.reserve) >= Number(token.totalSupply) ? "bg-green-500" : "bg-red-500"}`}
                >
                  {Number(token.reserve) >= Number(token.totalSupply)
                    ? "VERIFIED"
                    : "UNVERIFIED"}
                </span>
                <span className="font-jakarta text-center font-medium text-[0.972vw] text-black w-[20%]">
                  {token.address.slice(0, 6)}...{token.address.slice(-4)}
                </span>
                <span className="font-jakarta text-center font-medium text-[0.972vw] text-black w-[15%]">
                  {token.totalSupply !== "-" ? `${token.totalSupply}` : "-"}
                </span>
                <span className="font-jakarta text-center font-medium text-[0.972vw] text-black w-[15%]">
                  {token.reserve !== "-" ? `${token.reserve}` : "-"}
                </span>
                <span className="font-jakarta text-center font-medium text-[0.972vw] text-black w-[15%]">
                  {token.restake !== "-" ? `${token.restake.toFixed(2)}` : "-"}
                </span>
                <span className="font-jakarta text-center font-medium text-[0.972vw] text-black w-[15%]">
                  <button
                    onClick={() => setSelectedToken(token)}
                    className="bg-purple-500 text-white px-[0.5vw] py-[0.2vw] rounded-[0.2vw] hover:bg-purple-700 text-[0.8vw]"
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
            totalSupply: 0,
            reserve: 0,
            restake: 0,
          }
        }
        walletClient={walletClient}
        account={account}
      />
    </div>
  );
};

export default RegisteredOperators;
