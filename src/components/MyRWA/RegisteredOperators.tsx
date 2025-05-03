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
  contract?: string;
  status?: "verified" | "unverified";
  reserve?: string;
  totalSupply?: string;
}

// Just Dummy data, nanti diganti fetch dari backend
const dummyOperators: Operator[] = [
  {
    id: 1,
    name: "EigenYields",
    logoUrl: "/images/logo-eigenyields.png",
    totalValueRestake: "100.50K",
    contract: "0x123...abc",
    status: "verified",
    reserve: "40K",
    totalSupply: "190NA",
  },
  {
    id: 2,
    name: "AltLayer",
    logoUrl: "/images/logo-altlayer.png",
    totalValueRestake: "90.50K",
    contract: "0x456...def",
    status: "unverified",
    reserve: "30K",
    totalSupply: "90K NA",
  },
  {
    id: 3,
    name: "InfStones",
    logoUrl: "/images/logo-infstones.png",
    totalValueRestake: "70.50K",
    contract: "0x789...ghi",
    status: "verified",
    reserve: "30K",
    totalSupply: "200KP",
  },
];

const RegisteredOperators = ({
  variant = "myrwa",
}: RegisteredOperatorProps) => {
  const isDashboard = variant === "dashboard";

  return (
    <div
      className={`flex flex-col bg-transparent p-[1.994vw] rounded-[0.694vw] border-1 border-[#D5D7DA] gap-[1.833vw] ${isDashboard ? "w-[78.264vw] aspect-[1128/319]" : "w-[51.667vw] aspect-[744/319]"} `}
    >
      {!isDashboard ? (
        <>
          <div className="flex flex-col gap-[1.111vw]">
            <h2 className="font-jakarta text-[1.25vw] text-black font-bold leading-[2.292vw] border-b-1 border-[#D5D7DA]">
              Registered Operators/Underwriter
            </h2>
            <div
              className={`flex justify-between items-center rounded-[0.833vw] border-1 border-[#B086E2] px-[1.333vw] py-[0.667vw] ${isDashboard ? "w-[51.667vw]" : "w-full"}`}
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
        </>
      ) : (
        <div className="flex flex-col bg-transparent p-6 rounded-lg border border-[#D5D7DA] gap-6 w-full">
          <h2 className="font-jakarta text-xl font-bold text-black">
            Registered operators
          </h2>

          <div className="flex items-center border border-[#B086E2] rounded-lg px-4 py-2">
            <input
              type="text"
              placeholder="Search operators"
              className="w-full text-base text-[#A4A7AE] outline-none"
            />
            <AiOutlineSearch className="text-xl text-[#B086E2]" />
          </div>

          <div className="w-full">
            <div className="grid grid-cols-5 font-jakarta text-sm text-[#535862] font-medium border-b border-[#D5D7DA] pb-2">
              <div>Asset</div>
              <div>Contract</div>
              <div>Status</div>
              <div>Reserve</div>
              <div>Total Supply</div>
            </div>

            <div className="flex flex-col gap-4 mt-2">
              {dummyOperators.map((operator) => (
                <div
                  key={operator.id}
                  className="grid grid-cols-5 items-center text-sm font-jakarta text-black border-b border-[#D5D7DA] pb-2"
                >
                  {/* operators */}
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 relative rounded-full overflow-hidden">
                      <Image
                        src={operator.logoUrl}
                        alt={operator.name}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                    {operator.name}
                  </div>

                  {/* Contract */}
                  <div className="text-gray-600">
                    {operator.contract || "-"}
                  </div>

                  {/* Status */}
                  <div>
                    {operator.status === "verified" ? (
                      <span className="bg-green-500 text-white px-3 py-0.5 rounded-md text-xs">
                        Verified
                      </span>
                    ) : (
                      <span className="bg-[#DB2020] text-white px-3 py-0.5 rounded-md text-xs">
                        Unverified
                      </span>
                    )}
                  </div>

                  {/* Reserve */}
                  <div className="text-gray-800">{operator.reserve || "-"}</div>

                  {/* Total Supply */}
                  <div className="text-gray-800">{operator.totalSupply}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisteredOperators;
