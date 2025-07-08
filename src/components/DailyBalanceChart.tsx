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
  CartesianGrid,
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
  // Formatage des dates pour l'affichage
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  // Formatage des valeurs pour le tooltip
  const formatValue = (value: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Custom tooltip component with proper typing
  interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
      name: string;
      color: string;
      value: number;
    }>;
    label?: string;
  }

  const CustomTooltip: React.FC<CustomTooltipProps> = ({
    active,
    payload,
    label,
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 min-w-[140px] font-sans">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {formatDate(label || "")}
          </p>
          {payload.map(
            (
              entry: { name: string; color: string; value: number },
              index: number,
            ) => (
              <div
                key={index}
                className="flex items-center justify-between mb-1"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {entry.name}
                  </span>
                </div>
                <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                  {formatValue(entry.value)}
                </span>
              </div>
            ),
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      {/* En-tête du graphique */}
      <div className="mb-4 px-1">
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span className="text-gray-600 dark:text-gray-400">MGA</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full" />
            <span className="text-gray-600 dark:text-gray-400">RMB</span>
          </div>
        </div>
      </div>

      {/* Conteneur du graphique */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            {/* Grille de fond */}
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-gray-200 dark:stroke-gray-700"
              strokeOpacity={0.6}
            />

            {/* Axe X */}
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{
                fontSize: 12,
                fill: "currentColor",
                fontFamily: "Inter, sans-serif",
              }}
              className="text-gray-600 dark:text-gray-400"
              axisLine={{ stroke: "currentColor" }}
              tickLine={{ stroke: "currentColor" }}
            />

            {/* Axe Y */}
            <YAxis
              tickFormatter={formatValue}
              tick={{
                fontSize: 12,
                fill: "currentColor",
                fontFamily: "Inter, sans-serif",
              }}
              className="text-gray-600 dark:text-gray-400"
              axisLine={{ stroke: "currentColor" }}
              tickLine={{ stroke: "currentColor" }}
            />

            {/* Tooltip personnalisé */}
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "currentColor",
                strokeWidth: 1,
                strokeDasharray: "5 5",
                className: "text-gray-400 dark:text-gray-500",
              }}
            />

            {/* Légende cachée car remplacée par l'en-tête */}
            <Legend wrapperStyle={{ display: "none" }} />

            {/* Ligne MGA */}
            <Line
              type="monotone"
              dataKey="mga"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{
                fill: "#3b82f6",
                strokeWidth: 2,
                stroke: "#ffffff",
                r: 4,
              }}
              activeDot={{
                r: 6,
                fill: "#3b82f6",
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
              name="MGA"
            />

            {/* Ligne RMB */}
            <Line
              type="monotone"
              dataKey="rmb"
              stroke="#10b981"
              strokeWidth={3}
              dot={{
                fill: "#10b981",
                strokeWidth: 2,
                stroke: "#ffffff",
                r: 4,
              }}
              activeDot={{
                r: 6,
                fill: "#10b981",
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
              name="RMB"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DailyBalanceChart;
