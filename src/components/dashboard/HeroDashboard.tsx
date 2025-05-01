import Image from "next/image";

const HeroDashboard = () => {
  return (
    <>
      <div className="flex flex-row w-[78.264vw] gap-[7vw]">
        <div className="flex flex-col w-[51.736vw] gap-[0.667vw] font-jakarta ">
          <h4 className="text-[#420092] text-[2.639vw] font-bold">Dashboard</h4>
          <p className="text-[1.25vw] text-[#535862]">
            Your gateway to transparent and real-time insights into tokenized
            real-world assets (RWAs) across the protocol. Monitor key metrics,
            assess on-chain backing, and verify collateral health — all in one
            glance.
          </p>
        </div>
        <div className="relative flex w-[20.486vw] aspect-[295/266]">
          <Image
            src={"/images/dashboard/hero-dashboard-image.png"}
            fill
            alt="Hero Dashboard image"
          />
        </div>
      </div>
    </>
  );
};

export default HeroDashboard;

import Image from "next/image";

const HeroDashboard = () => {
  return (
    <>
      <div className="flex flex-row w-[78.264vw] gap-[7vw]">
        <div className="flex flex-col w-[51.736vw] gap-[0.667vw] font-jakarta ">
          <h4 className="text-[#420092] text-[2.639vw] font-bold">Dashboard</h4>
          <p className="text-[1.25vw] text-[#535862]">
            Your gateway to transparent and real-time insights into tokenized
            real-world assets (RWAs) across the protocol. Monitor key metrics,
            assess on-chain backing, and verify collateral health — all in one
            glance.
          </p>
        </div>
        <div className="relative flex w-[20.486vw] aspect-[295/266]">
          <Image
            src={"/images/dashboard/hero-dashboard-image.png"}
            fill
            alt="Hero Dashboard image"
          />
        </div>
      </div>
    </>
  );
};

export default HeroDashboard;
