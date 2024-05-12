'use client'
import { DataTable } from "./data-table"
import { api } from "~/trpc/react"
import { Position } from "@prisma/client"
import type { ColumnDef } from "@tanstack/react-table"
import { useEffect, useState } from "react"
import { Checkbox } from "../ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { MoreHorizontal } from "lucide-react"
import EditPosition from "../EditPosition"

type ConverionRateAPIResponse = {
  data: {
    currency: string
    rates: Record<string, string>
  }
}

export default function PortfolioTable() {
  const utils = api.useUtils()
  const {data: positions} = api.positions.getAll.useQuery()
  const {mutate: deletePosition} = api.positions.delete.useMutation({
    async onSuccess() {
      await utils.positions.getAll.invalidate()
    },
  })

  const [conversionRate, setConversionRate] = useState<Record<string, string>>()


  useEffect(() => {
    async function fetchConversionRate() {
      await fetch("https://api.coinbase.com/v2/exchange-rates")
        .then((res) => res.json())
        .then((data: ConverionRateAPIResponse) => {
          setConversionRate(data.data.rates);
        });
    }
    void fetchConversionRate()
  }, [])


  const columns: ColumnDef<Position>[] = [
    {
      accessorKey: "ticker",
      header: "Ticker",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
    },
    {
      accessorKey: "platform",
      header: "Platform",
    },
    {
      accessorKey: "amount",
      header: () => <div className="text-right">Amount</div>,
      cell: ({ row }) => {
      const currentRate = conversionRate?.[row.original.ticker] ?? 1
      const amount = parseFloat(row.getValue("quantity")) * (1 / (currentRate as number))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
 
      return <div className="text-right font-medium">{formatted}</div>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const position = row.original
   
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                className="bg-red-200 text-red-800 hover:bg-red-300"
                onClick={() => deletePosition({ id: position.id })}
              >
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem asChild className="">
                <EditPosition position={position} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ]
  if (!positions) {
    return null
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={positions} />
    </div>
  )
}
