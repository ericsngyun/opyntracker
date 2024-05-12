'use client'
import type React from "react"
import { useEffect, useState } from "react"
import { CryptocurrencySelect } from "~/components/CryptocurrencySelect"
import MaxWidthWrapper from "~/components/MaxWidthWrapper"
import PortfolioTable from "~/components/PortfolioTable/table"
import DemoPage from "~/components/PortfolioTable/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { ScrollArea } from "~/components/ui/scroll-area"


type TCryptocurrency = {
  id: string;
  symbol: string;
  name: string;
}

export default function Dashboard() {


  return(
    <MaxWidthWrapper>
    <main className = "py-4 grid grid-cols-2 gap-4">

    {/* 
      TOTAL VALUE CARD
      DISPLAYS TOTAL VALUE OF ALL HOLDINGS
      cols-1
    */}
      <Card id="" className="col-span-1">
        <CardHeader>
          <CardTitle>Total Value</CardTitle>
          <CardDescription>Value of all your holdings</CardDescription>
        </CardHeader>
        <CardContent>
          <h1> $ 0.00 </h1>
        </CardContent>
      </Card>

    {/* 
      HIGHEST VALUE CARD
      DISPLAYS HIGHEST VALUE HOLDING
      cols-1
    */}
      <Card id="" className="col-span-1">
        <CardHeader>
          <CardTitle>Highest Position</CardTitle>
          <CardDescription>Highest Value Holding</CardDescription>
        </CardHeader>
        <CardContent>
          <h1> $ 0.00 </h1>
        </CardContent>
      </Card>
    {/* 
      PORTFOLIO CARD
      TABLE WITH ALL CURRENT HOLDINGS
      cols-2
    */}
      <Card id = "" className = "col-span-2">
        <CardHeader>
          <CardTitle>Portfolio</CardTitle>
          <CardDescription>Current value of your holdings</CardDescription>
        </CardHeader>
        <PortfolioTable />
      </Card>

    <Card>
      <CardHeader>
        <CryptocurrencySelect />
      </CardHeader>
    </Card>
    


    </main>
  </MaxWidthWrapper>
  )
}