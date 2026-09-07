"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { formatDateShortEs } from "@/lib/dates";

interface Log {
  logged_on: string;
  weight_kg: number;
}

interface Props {
  logs: Log[];
  goalKg?: number | null;
}

export function WeightChart({ logs, goalKg }: Props) {
  const data = [...logs]
    .sort((a, b) => a.logged_on.localeCompare(b.logged_on))
    .map((l) => ({ date: formatDateShortEs(l.logged_on), peso: l.weight_kg }));

  return (
    <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-on-surface mb-3">Peso (kg)</h3>
      {data.length === 0 ? (
        <p className="text-sm text-on-surface-variant text-center py-8">
          Registra tu peso para ver la gráfica.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <XAxis
              dataKey="date"
              stroke="#767586"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#767586"
              fontSize={11}
              domain={["dataMin - 2", "dataMax + 2"]}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <Tooltip
              contentStyle={{
                background: "#ffffff",
                border: "1px solid #c7c4d7",
                borderRadius: 12,
                fontSize: 13,
              }}
              formatter={(v) => [`${v} kg`, "Peso"]}
            />
            <Line
              type="monotone"
              dataKey="peso"
              stroke="#4648d4"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#4648d4" }}
              activeDot={{ r: 5 }}
            />
            {goalKg && (
              <ReferenceLine
                y={goalKg}
                stroke="#fd761a"
                strokeDasharray="3 3"
                label={{
                  value: `Meta: ${goalKg}kg`,
                  fill: "#fd761a",
                  fontSize: 11,
                  position: "insideTopRight",
                }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
