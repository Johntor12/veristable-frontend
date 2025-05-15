"use client";

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
  totalSupply: number | string;
  reserve: number | string;
  restake: number | string; // Float tetap dibiarkan sebagai number
}

interface SupabaseRealEstate {
  name?: string;
  address?: string;
  totalSupply?: number | string | null;
  reserve?: number | string | null;
  restake?: number | string | null;
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
      const { data: supabaseData, error } = await supabase
        .from("real_estate")
        .select("*");

      if (error) {
        console.error("Supabase error:", error);
        setTokens([]);
        return;
      }

      const formattedTokens: Token[] = (
        supabaseData as SupabaseRealEstate[]
      ).map((item, index) => ({
        id: index + 1,
        name: item.name || "Unknown",
        address: item.address || "-",
        totalSupply:
          typeof item.totalSupply === "number"
            ? item.totalSupply
            : Number(item.totalSupply ?? 0),
        reserve: item.reserve ? Number(item.reserve) : "-",
        restake: item.restake ? Number(item.restake) : "-",
      }));

      setTokens(formattedTokens);
    } catch (err) {
      console.error("Error fetching token data:", err);
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
    <div className="bg-white p-6 rounded-xl shadow-md w-[78.264vw] border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Token Restake List
      </h2>

      {/* Search Box */}
      <div className="mb-6 flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-lg px-4 py-2">
        <AiOutlineSearch className="text-gray-500" size={20} />
        <input
          type="text"
          placeholder="Search Tokens by Name or Address"
          className="w-full bg-transparent outline-none text-sm text-gray-700"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full table-auto divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Token Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Token Address
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Supply
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reserve
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Restake
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : filteredTokens.length > 0 ? (
              filteredTokens.map((token) => (
                <tr key={token.id} className="hover:bg-gray-50 transition-all">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                    {token.name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        Number(token.reserve) >= Number(token.totalSupply)
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {Number(token.reserve) >= Number(token.totalSupply)
                        ? "VERIFIED"
                        : "UNVERIFIED"}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {token.address.slice(0, 6)}...{token.address.slice(-4)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                    {typeof token.totalSupply === "number"
                      ? token.totalSupply.toLocaleString()
                      : "-"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                    {typeof token.reserve === "number"
                      ? token.reserve.toLocaleString()
                      : "-"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                    {typeof token.restake === "number"
                      ? token.restake.toFixed(2)
                      : "-"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setSelectedToken(token)}
                      className="text-purple-600 hover:text-purple-900 font-medium focus:outline-none"
                    >
                      Action
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  Tidak ada token ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Action */}
      {selectedToken && (
        <TokenActionPopup
          isOpen={!!selectedToken}
          onClose={() => setSelectedToken(null)}
          token={{
            id: selectedToken.id,
            name: selectedToken.name,
            address: selectedToken.address,
            totalSupply: selectedToken.totalSupply.toString(),
            reserve: selectedToken.reserve.toString(),
            restake: selectedToken.restake.toString(),
          }}
          walletClient={walletClient}
          account={account as `0x${string}`}
        />
      )}
    </div>
  );
};

export default RegisteredOperators;
