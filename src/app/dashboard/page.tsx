import HeroDashboard from "@/components/dashboard/HeroDashboard";
import ReservesChart from "@/components/dashboard/ReserveChart";
import TotalAssetsSection from "@/components/dashboard/TotalAssetsSection";
import RegisteredOperators from "@/components/MyRWA/RegisteredOperators";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-white pt-[6vw] px-4 lg:px-0 font-jakarta">
      <section className="w-[90%] mx-auto py-12 flex flex-col justify-center items-center gap-[3vw]">
        <HeroDashboard />
        <TotalAssetsSection />
        <ReservesChart />
        <RegisteredOperators />
      </section>
    </div>
  );
}
