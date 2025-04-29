import Image from "next/image";
import DummyHouse from "../../assets/MyRWA/Dummy_Image_RWA.png";
import { IoMdCopy, IoIosOpen } from "react-icons/io";
import { HiCheck } from "react-icons/hi";
import { useState, useMemo } from "react";
import RegisteredOperators from "./RegisteredOperators";
import TokenCard from "./TokenCard";
import AnalyticsCard from "./AnalyticsCard";
import TeamCard from "./TeamCard";
import TokenPopup from "./TokenPopup";

type AfterDeployProps = {
  contractAddress?: string;
};

const SmartContractAddress = ({
  contractAddress = "0x123",
}: {
  contractAddress: string;
}) => {
  return (
    <button className="flex flex-row gap-[0.333vw] hover:cursor-pointer active:cursor-pointer border-1 border-[#D5D7DA] rounded-[0.208vw] w-[10.833vw] aspect-[156/36] justify-center items-center">
      <IoMdCopy className="w-[1.25vw] aspect-square text-[#C5C4C8]" />
      <p className="text-center text-[#0A0D12] font-jakarta text-[#0A0D12] text-[0.833vw]">
        {contractAddress.slice(0, 6)}.....{contractAddress.slice(-6)}
      </p>
    </button>
  );
};

const SmartContractInformation = () => {
  return (
    <button className="flex flex-row gap-[0.333vw] px-[0.667vw] hover:cursor-pointer active:cursor-pointer border-1 border-[#D5D7DA] rounded-[0.208vw] w-[10.833vw] aspect-[156/36] justify-between items-center">
      <p className="text-center text-[#0A0D12] font-jakarta text-[#0A0D12] text-[0.833vw] leading-[1.25vw] bg">
        Gak Tau ini apa
      </p>
      <IoIosOpen className="w-[1.25vw] aspect-square text-[#0A0D12]" />
    </button>
  );
};
  return (
    <button className="flex flex-row gap-[0.333vw] px-[0.667vw] hover:cursor-pointer active:cursor-pointer border-1 border-[#D5D7DA] rounded-[0.208vw] w-[10.833vw] aspect-[156/36] justify-between items-center">
      <p className="text-center text-[#0A0D12] font-jakarta text-[#0A0D12] text-[0.833vw] leading-[1.25vw] bg">
        Gak Tau ini apa
      </p>
      <IoIosOpen className="w-[1.25vw] aspect-square text-[#0A0D12]" />
    </button>
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
              className={`flex flex-row gap-[0.333vw] items-center ${step.completed ? "text-[#31006E]" : "text-[#C5C4C8]"}`}
            >
              <div
                className={`flex w-[1.111vw] aspect-square justify-center items-center rounded-full border-1 border-[#E9EAEB] ${step.completed ? "bg-transparent" : "bg-transparent"}`}
              >
                {step.completed && (
                  <HiCheck className="w-[1.25vw] aspect-square text-[#039855]" />
                )}
              </div>
              <p
                className={`text-[0.972vw] font-jakarta ${step.completed ? "text-[#039855]" : "text-black"}`}
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
  const [steps, setSteps] = useState([
    { id: 1, label: "Contract Deployment", completed: true },
    { id: 2, label: "Verify", completed: false },
    { id: 3, label: "Mint", completed: false },
  ]);
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
      <TokenCard />
    </div>
  );
};

export default AfterDeploy;
