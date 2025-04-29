import {
  HiOutlineFire,
  HiOutlineShare,
  HiOutlinePaperAirplane,
} from "react-icons/hi";
import { TbTriangleInverted } from "react-icons/tb"; // Icon airdrop
import { IoAdd } from "react-icons/io5"; // Icon Mint
import { ReactNode } from "react";

type TokenAction = {
  label: ReactNode;
  text: string;
  isPrimary?: boolean;
  onClick?: () => void;
};

type TokenProps = {
  totalSupply?: number;
  owenedByYou?: number;
  decimals?: number;
};

type ActionTokenCardProps = TokenAction & {
  customClass?: string;
};

const ActionTokenCard = ({
  label,
  text,
  isPrimary = false,
  onClick = () => {},
  customClass = "",
}: ActionTokenCardProps) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex flex-row p-[0.667vw] 
        justify-center items-center rounded-[0.208vw]
        font-jakarta gap-[0.5vw] hover:cursor-pointer
        ${isPrimary ? "bg-[#6400C9] text-white" : "bg-[#F5F5F5] text-[#717680]"}
        ${customClass}
      `}
    >
      {label}
      <span className="text-[0.972vw]">{text}</span>
    </button>
  );
};

const TokenCard = ({
  totalSupply = 0,
  owenedByYou = 0,
  decimals = 18,
}: TokenProps) => {
  const tokenActions: TokenAction[] = [
    {
      label: <HiOutlineFire className="text-[1.25vw]" />,
      text: "Burn",
    },
    {
      label: <HiOutlinePaperAirplane className="text-[1.25vw]" />,
      text: "Airdrop",
    },
    {
      label: <HiOutlineShare className="text-[1.25vw]" />,
      text: "Share",
    },
    {
      label: <IoAdd className="text-[1.25vw]" />,
      text: "Mint",
      isPrimary: true, // Tombol ungu
    },
  ];

  return (
    <div className="flex flex-col bg-transparent p-[1.994vw] w-[51.667vw] aspect-[744/262] rounded-[0.694vw] border-2 border-[#D5D7DA] gap-[1.833vw]">
      <div className="flex flex-row justify-between pb-[0.833vw] pr-[1.994vw] border-b-1 border-[#D5D7DA]">
        <div className="font-jakarta font-bold text-[1.528vw] leading-[2.292vw] text-black">
          Tokens
        </div>
        <div className="flex flex-row w-[21.944vw] aspect-[316/34] gap-[0.667vw]">
          {tokenActions.map((action, index) => (
            <ActionTokenCard
              key={index}
              label={action.label}
              text={action.text}
              isPrimary={action.isPrimary}
              customClass="w-full h-full justify-center"
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-[0.833vw] bg-[#FAFAFA] p-[1.883vw]">
        <p className="font-jakarta text-[1.25vw] leading-[1.875vw] text-black font-bold border-b-2 border-[#D5D7DA]">
          Token Details
        </p>
        <div className="flex flex-row justify-between">
          <div className="flex flex-col">
            <p className="font-jakarta text-[0.833vw] leading-[1.25vw] text-[#717680]">
              Total Supply
            </p>
            <div className="text-[1.111vw] font-bold text-black leading-[1.667vw]">
              {totalSupply} BAL
            </div>
          </div>
          <div className="flex flex-col">
            <p className="font-jakarta text-[0.833vw] leading-[1.25vw] text-[#717680]">
              Owened by you
            </p>
            <div className="text-[1.111vw] font-bold text-black leading-[1.667vw]">
              {owenedByYou} BAL
            </div>
          </div>
          <div className="flex flex-col">
            <p className="font-jakarta text-[0.833vw] leading-[1.25vw] text-[#717680]">
              Decimals
            </p>
            <div className="text-[1.111vw] font-bold text-black leading-[1.667vw]">
              {decimals}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenCard;
