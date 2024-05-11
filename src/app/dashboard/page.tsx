import type React from "react"
import MaxWidthWrapper from "~/components/MaxWidthWrapper"
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
          <p>Portfolio Content</p>
        </CardContent>
      </Card>
    </main>
  </MaxWidthWrapper>
  )
}