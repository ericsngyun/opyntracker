import { Position } from "@prisma/client"
import { BarChartBig, PieChart } from "lucide-react"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/tabs"

export type PortfolioChartProps = {
  className?: string
  positions?: Position[]
  conversionRates?: Record<string, string>
}

export function PortfolioChart({className, positions, conversionRates}: PortfolioChartProps) {
  return (
    <Tabs defaultValue="Pie" className={className}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="Pie"><PieChart /></TabsTrigger>
        <TabsTrigger value="Bar"><BarChartBig /></TabsTrigger>
      </TabsList>
      <TabsContent value="Pie">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Pie Chart</CardTitle>
            <CardDescription>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
           
          </CardContent>
          <CardFooter>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="Bar">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Bar Chart</CardTitle>
            <CardDescription>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            
          </CardContent>
          <CardFooter>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
