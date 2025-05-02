"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import { IoMdCopy, IoIosOpen } from "react-icons/io";
import { HiCheck } from "react-icons/hi";
import DummyHouse from "@/assets/MyRWA/Dummy_Image_RWA.png";
import RegisteredOperators from "@/components/MyRWA/RegisteredOperators";
import TokenCard from "@/components/MyRWA/TokenCard";
import AnalyticsCard from "@/components/MyRWA/AnalyticsCard";
import TeamCard from "@/components/MyRWA/TeamCard";

// Supabase Client Setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// Komponen SmartContractAddress
const SmartContractAddress = ({ address }: { address: string }) => {
  return (
    <button className="flex flex-row gap-[0.333vw] hover:cursor-pointer active:cursor-pointer border-1 border-[#D5D7DA] rounded-[0.208vw] w-[10.833vw] aspect-[156/36] justify-center items-center">
      <IoMdCopy className="w-[1.25vw] aspect-square text-[#C5C4C8]" />
      <p className="text-center text-[#0A0D12] font-jakarta text-[0.833vw]">
        {address.slice(0, 6)}...{address.slice(-6)}
      </p>
    </button>
  );
};

// Komponen SmartContractInformation
const SmartContractInformation = ({ label }: { label: string }) => {
  return (
    <button className="flex flex-row gap-[0.333vw] px-[0.667vw] hover:cursor-pointer active:cursor-pointer border-1 border-[#D5D7DA] rounded-[0.208vw] w-[10.833vw] aspect-[156/36] justify-between items-center">
      <p className="text-center text-[#0A0D12] font-jakarta text-[0.833vw] leading-[1.25vw]">
        {label}
      </p>
      <IoIosOpen className="w-[1.25vw] aspect-square text-[#0A0D12]" />
    </button>
  );
};

// Komponen RWAInformation
const RWAInformation = ({ data }: { data: any }) => {
  return (
    <div className="flex flex-row w-[49.722vw] aspect-[716/100] gap-[1.111vw]">
      <div className="relative w-[6.994vw] aspect-[150/100]">
        <Image
          src={data.image?.[0] || DummyHouse.src}
          alt="RWA Image"
          fill
          onError={() =>
            console.error("Failed to load image:", data.image?.[0])
          }
        />
      </div>
      <div className="flex flex-col text-[2.5vw] text-black font-jakarta w-[41.667vw] aspect-[596/99]">
        <p className="text-[2.693vw] text-black font-bold font-jakarta">
          {data.name || "Unnamed Asset"}
        </p>
        <div className="flex flex-row gap-[0.667vw]">
          <SmartContractAddress
            address={
              data.address || "0x0000000000000000000000000000000000000000"
            }
          />
          <SmartContractInformation label="Token Info" />
          <SmartContractInformation label="Owner Info" />
        </div>
      </div>
    </div>
  );
};

// Tipe untuk Step
type Step = {
  id: number;
  label: string;
  completed: boolean;
};

// Komponen ContractChecklist
const ContractChecklist = ({ steps }: { steps: Step[] }) => {
  const completedCount = useMemo(() => {
    return steps.filter((step) => step.completed).length;
  }, [steps]);

  const progressPercentage = useMemo(() => {
    return (completedCount / steps.length) * 100;
  }, [completedCount, steps.length]);

  return (
    <div className="flex flex-col items-center p-[1.994vw] w-[51.667vw] aspect-[744/259] rounded-[0.694vw] border-2 border-[#E9EAEB] gap-[1.111vw]">
      <div className="flex flex-col w-full font-jakarta gap-[0.833vw]">
        <p className="font-jakarta text-[1.528vw] text-black font-bold leading-[2.292vw]">
          Contract Checklist
        </p>
        <div className="w-full h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-[#31006E] rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="text-[0.833vw] text-[#905AD4] font-jakarta">
          {completedCount}/{steps.length} tasks completed
        </p>
        <div className="flex flex-col justify-start gap-[0.667vw]">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex flex-row gap-[0.333vw] items-center ${
                step.completed ? "text-[#31006E]" : "text-[#C5C4C8]"
              }`}
            >
              <div
                className={`flex w-[1.111vw] aspect-square justify-center items-center rounded-full border-1 border-[#E9EAEB] ${
                  step.completed ? "bg-transparent" : "bg-transparent"
                }`}
              >
                {step.completed && (
                  <HiCheck className="w-[1.25vw] aspect-square text-[#039855]" />
                )}
              </div>
              <p
                className={`text-[0.972vw] font-jakarta ${
                  step.completed ? "text-[#039855]" : "text-black"
                }`}
              >
                {step.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Halaman Detail RWA
const RWADetailPage = () => {
  const { contractAddress } = useParams();
  const [rwaData, setRwaData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [steps, setSteps] = useState<Step[]>([
    { id: 1, label: "Contract Deployment", completed: true },
    { id: 2, label: "Verify", completed: false },
    { id: 3, label: "Mint", completed: false },
  ]);

  // Fetch data dari Supabase berdasarkan contractAddress
  useEffect(() => {
    const fetchRWAData = async () => {
      try {
        const { data, error } = await supabase
          .from("real_estate")
          .select("*")
          .eq("address", contractAddress)
          .single();

        if (error) {
          console.error("Error fetching RWA data:", error);
          setError("Failed to load RWA data");
          return;
        }

        if (!data) {
          setError("No RWA found for this contract address");
          return;
        }

        setRwaData(data);

        // Update steps berdasarkan data
        setSteps((prevSteps) =>
          prevSteps.map((step) =>
            step.id === 1 ? { ...step, completed: true } : step
          )
        );
      } catch (err) {
        console.error("Error in fetchRWAData:", err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (contractAddress) {
      fetchRWAData();
    }
  }, [contractAddress]);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-white pt-[6vw] px-4 lg:px-0 font-jakarta flex justify-center items-center">
        <p className="text-black font-jakarta">Loading...</p>
      </div>
    );
  }

  if (error || !rwaData) {
    return (
      <div className="min-h-screen w-full bg-white pt-[6vw] px-4 lg:px-0 font-jakarta flex justify-center items-center">
        <p className="text-red-500 font-jakarta">
          {error || "No data available"}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white pt-[6vw] px-4 lg:px-0 font-jakarta">
      <section className="w-[90%] mx-auto py-12 flex flex-col gap-[1vw]">
        <RWAInformation data={rwaData} />
        <div className="w-full flex flex-row gap-[0.833vw]">
          <ContractChecklist steps={steps} />
          <div className="w-[18.75vw] aspect-[360/171]">
            <TeamCard
              team="Real Estate"
              description={
                rwaData.description ||
                "Long-term value from physical properties."
              }
              createdAt={`by ${rwaData.owner.slice(0, 6)}...${rwaData.owner.slice(-4)}`}
              customClass="w-[18.75vw] aspect-[360/171]"
            />
          </div>
        </div>
        <AnalyticsCard />
        <RegisteredOperators />
        <TokenCard
          contractAddress={contractAddress as string}
          owner={rwaData.owner}
        />
      </section>
    </div>
  );
};

export default RWADetailPage;
