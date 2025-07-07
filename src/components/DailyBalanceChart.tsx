"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ChartData {
  date: string;
  mga: number;
  rmb: number;
}

interface DailyBalanceChartProps {
  data: ChartData[];
}

const DailyBalanceChart: React.FC<DailyBalanceChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="mga"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
          name="MGA"
        />
        <Line type="monotone" dataKey="rmb" stroke="#82ca9d" name="RMB" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default DailyBalanceChart;
