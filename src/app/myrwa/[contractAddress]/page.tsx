"use client";
import { useParams } from "next/navigation";
import AfterDeploy from "@/components/MyRWA/AfterDeploy";

const MyRwaDeployPage = () => {
  const params = useParams();
  const contractAddress = params.contractAddress as string;

  return (
    <div className="min-h-screen w-full bg-white pt-[6vw] px-4 lg:px-0 font-jakarta ml-[1vw]">
      <section className="w-[90%] mx-auto py-12 flex flex-col gap-[5vw]">
        <AfterDeploy contractAddress={contractAddress} />
      </section>
    </div>
  );
};

export default MyRwaDeployPage;
