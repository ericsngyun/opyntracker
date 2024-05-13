import { type Position } from "@prisma/client"
import { BarChartBig, Grid2x2, PieChartIcon } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/tabs"

import React, { useEffect, useState } from "react"
import { BarChart, Bar, PieChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Pie, Cell, Treemap } from 'recharts';

export type PortfolioChartProps = {
  className?: string
  positions?: Position[]
  conversionRates?: Record<string, string>
}

export type DataType = {
  name: string
  value: number
  amount: number
  platform: string
}

export function PortfolioChart({className, positions, conversionRates}: PortfolioChartProps) {

  const [data, setData] = useState<DataType[]>([])

  useEffect(() => {
    if (positions && conversionRates) {
      const data = positions.map((position) => {
        const value = position.quantity * (1 / parseFloat(conversionRates[position.ticker] ?? "1"))
        return {
          name: position.ticker,
          value: Math.log(value),
          amount: position.quantity,
          platform: position.platform,
        };
      })
      setData(data)
    }
  }, [positions, conversionRates])

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];


  return (
    <Tabs defaultValue="Pie" className={className}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="Pie">
          <PieChartIcon />
        </TabsTrigger>
        <TabsTrigger value="Bar">
          <BarChartBig />
        </TabsTrigger>
        <TabsTrigger value="Tree">
          <Grid2x2 />
        </TabsTrigger>
      </TabsList>
      <TabsContent value="Pie">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Pie Chart</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart width={400} height={400}>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="Bar">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Bar Chart</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                width={500}
                height={300}
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" stackId="b" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="Tree">
        <Card>
          <CardHeader>
            <CardTitle>Treemap Chart</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <ResponsiveContainer width="100%" height={400}>
              <Treemap width={400} height={200} data={data} dataKey="size" aspectRatio={4 / 3} stroke="#fff" fill="#8884d8" />
            </ResponsiveContainer>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

const RADIAN = Math.PI / 180;
interface RenderCustomizedLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
}
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }:RenderCustomizedLabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

