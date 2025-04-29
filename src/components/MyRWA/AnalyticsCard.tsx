import { HiPlusSm } from "react-icons/hi";

const AnalyticsCard = ({}) => {
  return (
    <div className="flex flex-col justify-center items-center w-[51.667vw] aspect-[744/410] font-bold text-[1.25vw] rounded-[0.694vw] border-1 p-[1.667vw] gap-[0.833vw]">
      <div className="flex flex-row w-full justify-between w-full border-b-1 p-2">
        <p className="text-[1.25vw] leading-[1.875vw] text-black font-bold">
          Analytics
        </p>
        <button
          onClick={() => {}}
          className="flex flex-row gap-[0.333vw] bg-transparent border-1 border-[#D5D7DA] w-[5.833vw] aspect-[90/34] font-normal p-[0.333vw] rounded-[0.208vw] text-black font-bold"
        >
          <HiPlusSm className="text-[1.25vw]" />
          <div className="text-[0.833vw] leading-[1.25vw]">View All</div>
        </button>
      </div>
      <div className="w-full bg-[#E9EAEB] aspect-[668/298] rounded-[0.26vw]"></div>
    </div>
  );
};

export default AnalyticsCard;
