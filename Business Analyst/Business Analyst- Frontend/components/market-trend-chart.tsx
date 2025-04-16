"use client";

import React from "react";
import { Line } from "react-chartjs-2";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartDataset,
    TooltipItem
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface MarketTrendChartProps {
  data?: { dates: string[]; values: number[] };
  isLoading?: boolean;
  title?: string;
  description?: string;
}

export function MarketTrendChart({
  data,
  isLoading = false,
  title = "Market Growth Trends",
  description = "Projected market growth over time",
}: MarketTrendChartProps) {
  if (isLoading || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] w-full flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </CardContent>
      </Card>
    );
  }

    // Find the maximum value in the data.values array
    const maxValue = Math.max(...data.values);

    // Calculate a suitable maximum for the y-axis (add some padding)
    const yAxisMax = Math.ceil(maxValue / 10) * 10 + 10; // Round up to nearest 10, add 10


  const chartData = {
      labels: data.dates,
      datasets: [
        {
          label: 'Market Growth',
          data: data.values,
          fill: false,
           borderColor: 'rgb(75, 192, 192)',
          tension: 0.4,
          pointBackgroundColor: 'hsl(var(--primary))',
          pointBorderColor: 'hsl(var(--background))',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };


   const options = {
        scales: {
            x: {
            ticks: {
                color: 'hsl(var(--foreground))',
                font: { size: 12 },
            },
            grid: {
                color: 'hsl(var(--border))',
                display: false,
            },
            },
            y: {
            ticks: {
                color: 'hsl(var(--foreground))',
                font: { size: 12 },
                callback: (value: string | number) => Number(value).toFixed(0) + '%',

            },
            grid: {
                color: 'hsl(var(--border))',
            },
            beginAtZero: false,
            max: yAxisMax, // Set the y-axis maximum dynamically

            },
        },
        plugins: {
            legend: {
                display: true,
                labels: {
                    color: 'hsl(var(--foreground))',
                    font: { size: 12 },
                    usePointStyle: true,
                },
            },
           tooltip: {
                backgroundColor: '#222',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#444',
                borderWidth: 1,
                padding: 10,
                cornerRadius: 8,
                displayColors: false,
              bodyFont: {
                size: 14 // Increase font size if needed
              },
                callbacks: {
                    label: function(context: TooltipItem<'line'>) { // Use TooltipItem
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += context.parsed.y + "%"; //add percentage symbol.
                        }
                        return label;
                    }
                }
            }
        }
    };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] w-full">
        <Line data={chartData} options={options as any} />
      </CardContent>
    </Card>
  );
}