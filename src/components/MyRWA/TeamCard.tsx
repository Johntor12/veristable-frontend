// import { deflate } from "zlib";
import Button from "../Button";

export type TeamCardProps = {
  team?: string;
  createdAt?: string;
  description?: string;
  customClass?: string;
};

const TeamCard = ({
  team = "Hani's Team",
  createdAt = "10 RWA Project",
  description = "Created 22/04/2025",
  customClass,
}: TeamCardProps) => {
  return (
    <div
      className={`flex flex-col rounded-[0.694vw] border-1 border-[#D5D7DA] gap-[1.111svw] ${customClass}`}
    >
      <div className="flex flex-col justify-between p-4 gap-[1.111vw]">
        <div className="flex flex-col gap-[0.139vw] font-jakarta">
          <h4 className="flex justify-items-center text-[1.25vw] leading-[1.25vw] text-black font-bold">
            {team}
          </h4>
          <p className="text-[0.972vw] leading-[1.458vw] font-normal font-jakarta text-[#535862]">
            {description}
          </p>
        </div>
        <div className="flex justify-between">
          <p className="font-jakarta text-[0.833vw] text-black flex items-center">
            {createdAt}
          </p>
          <div className="w-[7.708vw] aspect-[111/30]">
            <Button variant={"secondary"} text={"View"} fullW={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
