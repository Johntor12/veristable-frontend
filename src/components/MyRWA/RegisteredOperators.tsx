import { AiOutlineSearch } from "react-icons/ai";
import Image from "next/image";

type RegisteredOperatorProps = {
  variant?: "dashboard" | "myrwa";
};
interface Operator {
  id: number;
  name: string;
  logoUrl: string;
  totalValueRestake: string;
}

// Just Dummy data, nanti diganti fetch dari backend
const dummyOperators: Operator[] = [
  {
    id: 1,
    name: "EigenYields",
    logoUrl: "/images/logo-eigenyields.png",
    totalValueRestake: "100.50K",
  },
  {
    id: 2,
    name: "AltLayer",
    logoUrl: "/images/logo-altlayer.png",
    totalValueRestake: "90.50K",
  },
  {
    id: 3,
    name: "InfStones",
    logoUrl: "/images/logo-infstones.png",
    totalValueRestake: "70.50K",
  },
];

const RegisteredOperators = ({
  variant = "myrwa",
}: RegisteredOperatorProps) => {
  return (
    <div
      className={`flex flex-col bg-transparent p-[1.994vw] rounded-[0.694vw] border-1 border-[#D5D7DA] gap-[1.833vw] ${variant == "myrwa" ? "w-[51.667vw] aspect-[744/319]" : "w-[78.264vw] aspect-[1128/319]"} `}
    >
      <div className="flex flex-col gap-[1.111vw]">
        <h2 className="font-jakarta text-[1.25vw] text-black font-bold leading-[2.292vw] border-b-1 border-[#D5D7DA]">
          Registered Operators/Underwriter
        </h2>
        <div
          className={`flex justify-between items-center rounded-[0.833vw] border-1 border-[#B086E2] px-[1.333vw] py-[0.667vw] ${variant == "myrwa" ? "w-full" : "w-[51.667vw]"}`}
        >
          <input
            type="text"
            placeholder="Search Operators"
            className="w-full text-[0.972vw] font-jakarta text-[#A4A7AE] leading-[1.25vw] outline-none"
          />
          <button className="hover:cursor-pointer active:cursor-pointer flex items-center justify-center w-[1.25vw]">
            <AiOutlineSearch className="text-[1.25vw] aspect-square text-[#B086E2]" />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-[0.333vw]">
        <div className="flex flex-row justify-between items-center w-full bg-transparent border-b-1 border-[#D5D7DA] text-center pb-[0.667vw]">
          <p className="font-jakarta text-[0.833vw] text-black leading-[1.25vw]">
            OPERATOR
          </p>
          <p className="font-jakarta text-[0.833vw] text-black leading-[1.25vw]">
            TOTAL VALUE RESTAKE
          </p>
        </div>
        <div className="flex flex-col gap-[1vw]">
          {dummyOperators.map((operator) => (
            <div
              key={operator.id}
              className="flex flex-row justify-between items-center w-full border-b border-[#D5D7DA] pb-[0.333vw]"
            >
              <div className="flex flex-row items-center gap-[0.833vw]">
                <div className="w-[1.944vw] aspect-square relative rounded-full overflow-hidden">
                  <Image
                    src={operator.logoUrl}
                    alt={operator.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <span className="font-jakarta text-center font-medium text-[0.972vw] text-black">
                  {operator.name}
                </span>
              </div>
              <span className="font-jakarta  text-center font-medium text-[0.972vw] text-black">
                {operator.totalValueRestake} ETH
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RegisteredOperators;
