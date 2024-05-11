import type React from "react"
import MaxWidthWrapper from "~/components/MaxWidthWrapper"
import PortfolioTable from "~/components/PortfolioTable/table"
import DemoPage from "~/components/PortfolioTable/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"


export default async function Dashboard() {


  return(
    <MaxWidthWrapper>
    <main className = "py-4">
      <Card>
        <CardHeader>
          <CardTitle>Portfolio</CardTitle>
          <CardDescription>Current value of your holdings</CardDescription>
        </CardHeader>
        <CardContent>
          <PortfolioTable />
        </CardContent>
      </Card>
    </main>
  </MaxWidthWrapper>
  )
}