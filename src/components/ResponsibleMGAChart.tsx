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

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

const ResponsibleMGAChart: React.FC<ResponsibleMGAChartProps> = ({ data }) => {
  // Formatage des valeurs pour le tooltip
  const formatValue = (value: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calcul du total pour les pourcentages
  const total = data.reduce((sum, item) => sum + item.totalMGA, 0);

  // Custom tooltip component
  interface CustomTooltipProps {
    active?: boolean;
    payload?: { payload: ResponsibleMGAData }[];
  }

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.totalMGA / total) * 100).toFixed(1);

      return (
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 min-w-[160px] font-sans">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {data.responsible}
          </p>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Montant:
              </span>
              <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                {formatValue(data.totalMGA)} MGA
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Pourcentage:
              </span>
              <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                {percentage}%
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Composant légende personnalisée
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map(
          (entry: { color: string; value: string }, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                {entry.value}
              </span>
            </div>
          ),
        )}
      </div>
    );
  };

  // Formatage des labels sur le graphique
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Masquer les labels pour les petits segments

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize="12"
        fontWeight="600"
        fontFamily="Inter, sans-serif"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="w-full">
      {/* En-tête du graphique */}
      <div className="mb-4 px-1">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Total: {formatValue(total)} MGA
        </p>
      </div>

      {/* Conteneur du graphique */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
        <ResponsiveContainer width="100%" height={350}>
          <PieChart
            margin={{
              top: 20,
              right: 30,
              left: 30,
              bottom: 20,
            }}
          >
            <Pie
              data={data}
              dataKey="totalMGA"
              nameKey="responsible"
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={120}
              innerRadius={60}
              fill="#8884d8"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            {/* Tooltip personnalisé */}
            <Tooltip content={<CustomTooltip />} />

            {/* Légende personnalisée */}
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Tableau récapitulatif */}
      <div className="mt-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
          Détails par actionnaire
        </h3>
        <div className="space-y-2">
          {data
            .sort((a, b) => b.totalMGA - a.totalMGA)
            .map((item, index) => {
              const percentage = ((item.totalMGA / total) * 100).toFixed(1);
              return (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {item.responsible}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {formatValue(item.totalMGA)} MGA
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {percentage}%
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default ResponsibleMGAChart;
