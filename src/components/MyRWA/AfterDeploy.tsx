"use client";

import Image from "next/image";
import DummyHouse from "../../assets/MyRWA/Dummy_Image_RWA.png";
import { useMemo } from "react";
import RegisteredOperators from "./RegisteredOperators";
import TokenCard from "./TokenCard";
import AnalyticsCard from "./AnalyticsCard";
import TeamCard from "./TeamCard";
import { Button } from "@/components/ui/button"; // Import shadcn Button
import { Progress } from "@/components/ui/progress"; // Import shadcn Progress
import { Copy, ExternalLink, Check } from "lucide-react"; // Import Lucide icons
import { cn } from "@/lib/utils";
import { useAccount } from "wagmi"; // Import useAccount

// import TokenPopup from "./TokenPopup";

type AfterDeployProps = {
  contractAddress?: string;
};

const SmartContractAddress = ({
  contractAddress = "0x123",
}: {
  contractAddress: string;
}) => {
  // TODO: Implement copy to clipboard functionality
  const handleCopy = () => {
    navigator.clipboard.writeText(contractAddress);
    // Optionally show a success message
  };

  return (
    <Button
      variant="outline" // Use outline variant
      size="sm" // Use small size
      className="flex flex-row gap-[0.333vw] w-[10.833vw] aspect-[156/36] justify-center items-center text-[0.833vw]" // Apply custom classes
      onClick={handleCopy}
    >
      <Copy className="w-[1.25vw] aspect-square text-[#C5C4C8]" />{" "}
      {/* Use Lucide Copy icon */}
      <p className="text-center text-[#0A0D12] font-jakarta">
        {contractAddress.slice(0, 6)}.....{contractAddress.slice(-6)}
      </p>
    </Button>
  );
};

const SmartContractInformation = () => {
  // TODO: Implement link opening functionality
  const handleOpenLink = () => {
    // Open relevant smart contract information link
  };

  return (
    <Button
      variant="outline" // Use outline variant
      size="sm" // Use small size
      className="flex flex-row gap-[0.333vw] px-[0.667vw] w-[10.833vw] aspect-[156/36] justify-between items-center text-[0.833vw]" // Apply custom classes
      onClick={handleOpenLink}
    >
      <p className="text-center text-[#0A0D12] font-jakarta leading-[1.25vw]">
        Gak Tau ini apa
      </p>
      <ExternalLink className="w-[1.25vw] aspect-square text-[#0A0D12]" />{" "}
      {/* Use Lucide ExternalLink icon */}
    </Button>
  );
};

const RWAInformation = ({
  contractAddress = "0x123",
}: {
  contractAddress: string;
}) => {
  return (
    <div className="flex flex-row w-[49.722vw] aspect-[716/100] gap-[1.111vw]">
      <div className="relative w-[6.994vw] aspect-[150/100]">
        <Image src={DummyHouse} alt="RWA Image" fill />
      </div>
      <div className=" flex flex-col text-[2.5vw] text-black font-jakarta w-[41.667vw] aspect-[596/99]">
        <p className="text-[2.693vw] text-black font-bold font-jakarta">
          Fresh Bali Villa
        </p>
        <div className="flex flex-row gap-[0.667vw] ">
          <SmartContractAddress contractAddress={contractAddress} />
          <SmartContractInformation />
          <SmartContractInformation />
        </div>
      </div>
    </div>
  );
};

type Step = {
  id: number;
  label: string;
  completed: boolean;
};

type ContractChecklistProps = {
  steps: Step[];
};

const ContractChecklist = ({ steps }: ContractChecklistProps) => {
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
        {/* Progress Bar */}
        <Progress value={progressPercentage} className="w-full h-2" />{" "}
        {/* Use shadcn Progress */}
        <p className="text-[0.833vw] text-[#905AD4] font-jakarta">
          {completedCount}/{steps.length} tasks completed
        </p>
        <div className="flex flex-col justify-start gap-[0.667vw]">
          {steps.map((step) => (
            <div
              key={step.id}
              className={cn(
                "flex flex-row gap-[0.333vw] items-center",
                step.completed ? "text-[#31006E]" : "text-[#C5C4C8]"
              )}
            >
              <div
                className={cn(
                  "flex w-[1.111vw] aspect-square justify-center items-center rounded-full border-1 border-[#E9EAEB]",
                  step.completed ? "bg-transparent" : "bg-transparent" // Consider if a different background is needed for completed
                )}
              >
                {step.completed && (
                  <Check className="w-[1.25vw] aspect-square text-[#039855]" /> // Use Lucide Check icon
                )}
              </div>
              <p
                className={cn(
                  "text-[0.972vw] font-jakarta",
                  step.completed ? "text-[#039855]" : "text-black"
                )}
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

const AfterDeploy = ({ contractAddress = "0x123" }: AfterDeployProps) => {
  const { address: account } = useAccount(); // Get connected account
  const steps = [
    { id: 1, label: "Contract Deployment", completed: true },
    { id: 2, label: "Verify", completed: false },
    { id: 3, label: "Mint", completed: false },
  ];
  return (
    <div className="flex flex-col gap-[1.667vw] w-full min-h-screen bg-white pt-[3vw]">
      <RWAInformation contractAddress={contractAddress} />
      <div className="w-full flex flex-row gap-[0.833vw]">
        <ContractChecklist steps={steps} />
        <div className="w-[18.75vw] aspect-[360/171] ">
          <TeamCard
            team="Real Estate"
            description="Long-term value from physical properties."
            createdAt="by. companyA"
            customClass="w-[18.75vw] aspect-[360/171]"
          />
        </div>
      </div>
      <AnalyticsCard />
      <RegisteredOperators />
      {/* Pass contractAddress and account to TokenCard */}
      <TokenCard
        contractAddress={contractAddress}
        owner={account || "0x0"}
      />{" "}
      {/* Pass account as owner, use 0x0 if not connected */}
    </div>
  );
};

export default AfterDeploy;
