// components/ReservesChart.tsx
"use client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type ReserveData = {
  date: string;
  reserves: number;
};

type ReservesChartProps = {
  data?: ReserveData[];
  total?: number; // Misalnya: 100100
};

const sampleData = [
  { date: "21 Jan", reserves: 89.01 },
  { date: "31 Jan", reserves: 89.3 },
  { date: "21 Feb", reserves: 88.9 },
  { date: "31 Feb", reserves: 89.5 },
  { date: "21 Mar", reserves: 90.2 },
  { date: "31 Mar", reserves: 91.8 },
  { date: "21 Apr", reserves: 93.4 },
  { date: "31 Apr", reserves: 92.1 },
  { date: "21 May", reserves: 95.9 },
  { date: "31 May", reserves: 98.2 },
  { date: "21 Jun", reserves: 99.0 },
  { date: "31 Jun", reserves: 100.1 },
  { date: "21 Jul", reserves: 100.5 },
  { date: "21 Agu", reserves: 101.0 },
  { date: "21 Oct", reserves: 100.0 },
];

export default function ReservesChart({
  data = sampleData,
  total = 100100,
}: ReservesChartProps) {
  return (
    <>
      <div className="flex flex-col">
        <p className="text-[#535862] text-[0.972vw] font-inter font-medium">
          Reserves Container
        </p>
        <p className="font-bold text-[1.528vw] text-black ">
          ${total.toLocaleString()}
        </p>
      </div>

      <div className="w-[78.264vw] aspect-[1127/387]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorReserves" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" axisLine={false} tickLine={false} />
            <YAxis
              domain={["dataMin", "dataMax"]}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `$${value.toFixed(2)}`}
            />
            <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
            <Area
              type="monotone"
              dataKey="reserves"
              stroke="#7C3AED"
              fill="url(#colorReserves)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}

// components/ReservesChart.tsx
("use client");
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type ReserveData = {
  date: string;
  reserves: number;
};

type ReservesChartProps = {
  data?: ReserveData[];
  total?: number; // Misalnya: 100100
};

const sampleData = [
  { date: "21 Jan", reserves: 89.01 },
  { date: "31 Jan", reserves: 89.3 },
  { date: "21 Feb", reserves: 88.9 },
  { date: "31 Feb", reserves: 89.5 },
  { date: "21 Mar", reserves: 90.2 },
  { date: "31 Mar", reserves: 91.8 },
  { date: "21 Apr", reserves: 93.4 },
  { date: "31 Apr", reserves: 92.1 },
  { date: "21 May", reserves: 95.9 },
  { date: "31 May", reserves: 98.2 },
  { date: "21 Jun", reserves: 99.0 },
  { date: "31 Jun", reserves: 100.1 },
  { date: "21 Jul", reserves: 100.5 },
  { date: "21 Agu", reserves: 101.0 },
  { date: "21 Oct", reserves: 100.0 },
];

export default function ReservesChart({
  data = sampleData,
  total = 100100,
}: ReservesChartProps) {
  return (
    <>
      <div className="flex flex-col">
        <p className="text-[#535862] text-[0.972vw] font-inter font-medium">
          Reserves Container
        </p>
        <p className="font-bold text-[1.528vw] text-black ">
          ${total.toLocaleString()}
        </p>
      </div>

      <div className="w-[78.264vw] aspect-[1127/387]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorReserves" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" axisLine={false} tickLine={false} />
            <YAxis
              domain={["dataMin", "dataMax"]}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `$${value.toFixed(2)}`}
            />
            <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
            <Area
              type="monotone"
              dataKey="reserves"
              stroke="#7C3AED"
              fill="url(#colorReserves)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
