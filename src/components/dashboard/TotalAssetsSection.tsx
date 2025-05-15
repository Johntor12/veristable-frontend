"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Supabase Client Setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

type TotalAssetsData = {
  verifiablity?: number;
  verificationInterval?: string;
};

const TotalAssetsSection = ({
  verifiablity = 100,
  verificationInterval = "Real-time",
}: TotalAssetsData) => {
  const [assetSupply, setAssetSupply] = useState<number>(0);
  const [protocolReserve, setProtocolReserve] = useState<number>(0);
  const [colleteralRatio, setColleteralRatio] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const fetchAssetData = async () => {
    setLoading(true);
    try {
      const { data: supabaseData, error } = await supabase
        .from("real_estate")
        .select("totalSupply, reserve");

      if (error) {
        console.error("Supabase error:", error);
        setAssetSupply(0);
        setProtocolReserve(0);
        setColleteralRatio(0);
        return;
      }

      let totalAssetSupply = 0;
      let totalProtocolReserve = 0;

      if (supabaseData) {
        supabaseData.forEach((item) => {
          totalAssetSupply += Number(item.totalSupply || 0);
          totalProtocolReserve += Number(item.reserve || 0);
        });
      }

      setAssetSupply(totalAssetSupply);
      setProtocolReserve(totalProtocolReserve);

      if (totalProtocolReserve > 0) {
        setColleteralRatio((totalProtocolReserve / totalAssetSupply) * 100);
      } else {
        setColleteralRatio(0);
      }
    } catch (err) {
      console.error("Error fetching asset data:", err);
      setAssetSupply(0);
      setProtocolReserve(0);
      setColleteralRatio(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssetData();
  }, []);

  return (
    <>
      <div className="flex flex-col w-[78.264vw] rounded-[0.694vw]">
        <div className="grid grid-cols-2 w-full">
          <div className="col-span-1 flex flex-col gap-[0.333vw] text-black border-1 rounded-tl-[0.694vw] border-[#D5D7DA] p-[0.883vw]">
            <p className="font-jakarta text-[0.972vw] text-[#535862]">
              Total Assets Supply
            </p>
            <p className="font-jakarta font-bold text-[1.528vw]">
              ${loading ? "Loading..." : assetSupply.toLocaleString("en-us")}
            </p>
            <p className="font-jakarta text-[#717680] text-[0.833vw]">
              Total value of tokenized real-world assets currently circulating
              on-chain.
            </p>
          </div>
          <div className="col-span-1 flex flex-col gap-[0.333vw] text-black border-1 rounded-tr-[0.694vw] border-[#D5D7DA] p-[0.883vw]">
            <p className="font-jakarta text-[0.972vw] text-[#535862]">
              Total Protocol Reserves
            </p>
            <p className="font-jakarta font-bold text-[1.528vw]">
              {loading ? "Loading..." : protocolReserve.toLocaleString("en-us")}
              USDC
            </p>
            <p className="font-jakarta text-[#717680] text-[0.833vw]">
              Reserves backing all tokenized assets, held in stable and audited
              vaults.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 w-full">
          <div className="col-span-1">
            <div className="col-span-1 flex flex-col gap-[0.333vw] text-black border-1 rounded-bl-[0.694vw] border-[#D5D7DA] p-[0.883vw]">
              <p className="font-jakarta text-[0.972vw] text-[#535862]">
                Verifibiality
              </p>
              <p className="font-jakarta font-bold text-[1.528vw]">
                {verifiablity}%
              </p>
              <p className="font-jakarta text-[#717680] text-[0.833vw]">
                All assets verified through trusted oracles and off-chain data
                attestations.
              </p>
            </div>
          </div>
          <div className="col-span-1">
            <div className="col-span-1 flex flex-col gap-[0.333vw] text-black border-1 border-[#D5D7DA] p-[0.883vw]">
              <p className="font-jakarta text-[0.972vw] text-[#535862]">
                Verification Interval
              </p>
              <p className="font-jakarta font-bold text-[1.528vw]">
                {verificationInterval}
              </p>
              <p className="font-jakarta text-[#717680] text-[0.833vw]">
                Data synced continuously via automated audit feeds and oracle
                networks.
              </p>
            </div>
          </div>
          <div className="col-span-1">
            <div className="col-span-1 flex flex-col gap-[0.333vw] text-black border-1 rounded-br-[0.694vw] border-[#D5D7DA] p-[0.883vw]">
              <p className="font-jakarta text-[0.972vw] text-[#535862]">
                Colleteral Ratio
              </p>
              <p className="font-jakarta font-bold text-[1.528vw]">
                {loading ? "Loading..." : colleteralRatio.toFixed(2)}%
              </p>
              <p className="font-jakarta text-[#717680] text-[0.833vw]">
                Assets are overcollateralized to ensure protocol solvency and
                user trust.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TotalAssetsSection;
