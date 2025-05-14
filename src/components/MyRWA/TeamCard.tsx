// import { deflate } from "zlib";
import Button from "../Button"; // Assuming this is the refactored shadcn Button
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"; // Import shadcn Card components
import { cn } from "@/lib/utils"; // Import cn

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
    <Card
      className={cn(
        "flex flex-col rounded-[0.694vw] border-1 border-[#D5D7DA] w-[25vw] aspect-[360/135] gap-[1.111svw]",
        customClass
      )}
    >
      {" "}
      {/* Use shadcn Card */}
      <CardContent className="flex flex-col justify-between p-4 gap-[1.111vw]">
        {" "}
        {/* Use CardContent */}
        <div className="flex flex-col gap-[0.139vw] font-jakarta">
          <CardTitle className="flex justify-items-center text-[1.25vw] leading-[1.25vw] text-black font-bold">
            {" "}
            {/* Use CardTitle */}
            {team}
          </CardTitle>
          <CardDescription className="text-[0.972vw] leading-[1.458vw] font-normal font-jakarta text-[#535862]">
            {" "}
            {/* Use CardDescription */}
            {description}
          </CardDescription>
        </div>
        <div className="flex justify-between">
          <p className="font-jakarta text-[0.833vw] text-black flex items-center">
            {createdAt}
          </p>
          <div className="w-[7.708vw] aspect-[111/30]">
            <Button variant={"outline"} size={"sm"} fullW={true}>
              {" "}
              {/* Use children instead of text prop, use outline variant and sm size */}
              View
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamCard;
