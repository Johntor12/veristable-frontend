"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useAccount, useWalletClient } from "wagmi";
import TokenActionPopup from "./TokenActionPopup";
import { Input } from "@/components/ui/input"; // Import shadcn Input
import { Button } from "@/components/ui/button"; // Import shadcn Button
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Import shadcn Card components
import { Search } from "lucide-react"; // Import Search icon
import { cn } from "@/lib/utils"; // Import cn

// Supabase Client Setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

interface Token {
  id: number;
  name: string;
  address: string;
  totalSupply: string; // Change to string
  reserve: string; // Change to string
  restake: string; // Change to string
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

      const formattedTokens: Token[] = supabaseData.map(
        (item: any, index: number) => ({
          id: index + 1,
          name: item.name || "Unknown",
          address: item.address || "-",
          // Convert to string during formatting
          totalSupply: item.totalSupply
            ? Number(item.totalSupply).toLocaleString()
            : "-",
          reserve: item.reserve ? Number(item.reserve).toLocaleString() : "-",
          restake: item.restake ? Number(item.restake).toFixed(2) : "-",
        })
      );

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
    <Card className="w-full max-w-5xl mx-auto border border-gray-200">
      {" "}
      {/* Use shadcn Card */}
      <CardHeader>
        {" "}
        {/* Use CardHeader */}
        <CardTitle className="text-xl font-bold text-gray-800">
          {" "}
          {/* Use CardTitle */}
          Token Restake List
        </CardTitle>
      </CardHeader>
      <CardContent>
        {" "}
        {/* Use CardContent */}
        {/* Search Box */}
        <div className="relative mb-6">
          {" "}
          {/* Use relative positioning for icon */}
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />{" "}
          {/* Use Lucide Search icon */}
          <Input
            type="text"
            placeholder="Search Tokens by Name or Address"
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus-visible:ring-purple-600" // Adjust padding and add focus style
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
                <th className="px-4 py-3 whitespace-nowrap text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {" "}
                  {/* Added whitespace-nowrap */}
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
                  <tr
                    key={token.id}
                    className="hover:bg-gray-50 transition-all"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                      {token.name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span
                        className={cn(
                          "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                          Number(token.reserve) >= Number(token.totalSupply) // Still compare as numbers for logic
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        )}
                      >
                        {Number(token.reserve) >= Number(token.totalSupply) // Still compare as numbers for logic
                          ? "VERIFIED"
                          : "UNVERIFIED"}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {token.address.slice(0, 6)}...{token.address.slice(-4)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                      {token.totalSupply} {/* Now a string */}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                      {token.reserve} {/* Now a string */}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                      {token.restake} {/* Now a string */}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="link" // Use link variant for a text button
                        size="sm" // Use small size
                        onClick={() => setSelectedToken(token)}
                        className="text-purple-600 hover:text-purple-900 p-0 h-auto" // Adjust padding and height
                      >
                        Action
                      </Button>
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
      </CardContent>
      {/* Modal Action */}
      {selectedToken && (
        <TokenActionPopup
          isOpen={!!selectedToken}
          onClose={() => setSelectedToken(null)}
          token={{
            id: selectedToken.id,
            name: selectedToken.name,
            address: selectedToken.address,
            totalSupply: selectedToken.totalSupply, // Now a string
            reserve: selectedToken.reserve, // Now a string
            restake: selectedToken.restake, // Now a string
          }}
          walletClient={walletClient}
          account={account}
        />
      )}
    </Card>
  );
};

export default RegisteredOperators;
