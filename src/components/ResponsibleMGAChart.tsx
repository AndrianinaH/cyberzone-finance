"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface ResponsibleMGAData {
  responsible: string;
  totalMGA: number;
}

interface ResponsibleMGAChartProps {
  data: ResponsibleMGAData[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF", "#FF69B4"];

const ResponsibleMGAChart: React.FC<ResponsibleMGAChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <Pie
          data={data}
          dataKey="totalMGA"
          nameKey="responsible"
          cx="50%"
          cy="50%"
          outerRadius={100}
          innerRadius={70}
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number, name: string) => [
            `${value.toLocaleString()} MGA`,
            `Actionnaire: ${name}`,
          ]}
          contentStyle={{ fontFamily: "Inter, sans-serif", fontSize: "12px" }}
        />
        <Legend
          wrapperStyle={{ fontFamily: "Inter, sans-serif", fontSize: "12px" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ResponsibleMGAChart;
