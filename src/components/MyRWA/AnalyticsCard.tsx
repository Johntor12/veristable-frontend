import { Button } from "@/components/ui/button"; // Import shadcn Button
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Import shadcn Card components
import { Plus } from "lucide-react"; // Import Plus icon
import { cn } from "@/lib/utils"; // Import cn

const AnalyticsCard = ({}) => {
  return (
    <Card className="flex flex-col justify-center items-center w-[51.667vw] aspect-[744/410] font-bold text-[1.25vw] rounded-[0.694vw] border-1 p-[1.667vw] gap-[0.833vw]">
      {" "}
      {/* Use shadcn Card */}
      <CardHeader className="flex flex-row w-full justify-between w-full border-b-1 p-2">
        {" "}
        {/* Use CardHeader */}
        <CardTitle className="text-[1.25vw] leading-[1.875vw] text-black font-bold">
          {" "}
          {/* Use CardTitle */}
          Analytics
        </CardTitle>
        <Button
          variant="outline" // Use outline variant
          size="sm" // Use small size
          onClick={() => {}}
          className="flex flex-row gap-[0.333vw] w-[5.833vw] aspect-[90/34] font-normal p-[0.333vw] rounded-[0.208vw] text-black font-bold" // Apply custom classes
        >
          <Plus className="text-[1.25vw]" /> {/* Use Lucide Plus icon */}
          <div className="text-[0.833vw] leading-[1.25vw]">View All</div>
        </Button>
      </CardHeader>
      <CardContent className="w-full bg-[#E9EAEB] aspect-[668/298] rounded-[0.26vw] flex justify-center items-center p-0">
        {" "}
        {/* Use CardContent */}
        <p className="text-[1.25vw] text-black font-bold">Coming Soon</p>
      </CardContent>
    </Card>
  );
};

export default AnalyticsCard;
