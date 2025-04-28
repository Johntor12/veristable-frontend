// import Image from "next/image";
import Hero from "@/components/LandingPage/Hero";
import OneClick from "@/components/LandingPage/OneClick";

export default function Home() {
  return (
    <div className="flex flex-col justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-white">
      <Hero />
      <OneClick />
    </div>
  );
}
