'use client'
import type React from "react"
import { useEffect, useState } from "react"
import CreatePosition from "~/components/CreatePosition"
import MaxWidthWrapper from "~/components/MaxWidthWrapper"
import { PortfolioChart } from "~/components/PortfolioChart"
import PortfolioTable from "~/components/PortfolioTable/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { api } from "~/trpc/react"

export type ConversionRateAPIResponse = {
  data: {
    currency: string
    rates: Record<string, string>
  }
}

export default function Dashboard() {
  const {data: positions} = api.positions.getAll.useQuery()         
  const [conversionRates, setConversionRates] = useState<Record<string, string>>()
  const [totalValue, setTotalValue] = useState(0)
  const [highestValue, setHighestValue] = useState<number>(0)
  const [highestTicker, setHighestTicker] = useState({
    ticker:"",
    quantity: 0,
    platform: ""
  })

  useEffect(() => {
    async function fetchConversionRate() {
      await fetch("https://api.coinbase.com/v2/exchange-rates")
        .then((res) => res.json())
        .then((data: ConversionRateAPIResponse) => {
          setConversionRates(data.data.rates);
          return data.data.rates;
        });
    }
    void fetchConversionRate();
  }, []);

  useEffect(() => {
    if (positions && conversionRates) {
      let currTotal = 0
      let currHighest = 0
      positions.forEach((position) => {
        const currValue = position.quantity * (1 / parseFloat(conversionRates[position.ticker] ?? "1"))
        currTotal += currValue
        if (currValue > currHighest) {
          currHighest = currValue
          setHighestTicker({
            ticker: position.ticker,
            quantity: position.quantity,
            platform: position.platform,
          })
        }
      });
      setTotalValue(currTotal)
      setHighestValue(currHighest)


    }
  }, [positions, conversionRates]);

  return (
    <MaxWidthWrapper>
      <main className="grid grid-cols-4 gap-4 py-4">
        <Card
          id="total-value"
          className="col-span-2 flex-col place-items-center justify-between p-4 md:flex"
        >
          <div>
            <h1 className="text-xl font-semibold md:text-2xl">Total Value</h1>
            <h1 className="text-muted-foreground">Sum of all positions</h1>
          </div>
          <h1 className="text-2xl">
            {Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(totalValue)}
          </h1>
        </Card>
        <Card
          id="highest-value"
          className="col-span-2 flex-col place-items-center justify-between p-4 md:flex"
        >
          <div>
            <h1 className="text-xl font-semibold md:text-2xl">Highest Value</h1>
            <h1 className="text-muted-foreground">
              {highestTicker.ticker},{highestTicker.platform}
            </h1>
          </div>
          <h1 className="text-2xl">
            {Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(highestValue)}
          </h1>
        </Card>
        <Card id="" className="md:w-2xl md:cols-span-2 col-span-4">
          <CardHeader className="flex justify-between">
            <div>
              <CardTitle>Portfolio</CardTitle>
              <CardDescription>Table of your current holdings</CardDescription>
            </div>
            <div></div>
          </CardHeader>
          <PortfolioTable
            positions={positions}
            conversionRates={conversionRates}
          />
        </Card>

        <PortfolioChart conversionRates={conversionRates} positions={positions} className="col-span-4" />
      </main>
      <CreatePosition />
    </MaxWidthWrapper>
  );
}
