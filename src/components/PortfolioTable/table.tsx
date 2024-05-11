import { DataTable } from "./data-table"
import { api } from "~/trpc/server"
import { Position } from "@prisma/client"
import type { ColumnDef } from "@tanstack/react-table"


export default async function PortfolioTable() {
  const positions = await api.positions.getAll()

  const columns: ColumnDef<Position>[] = [
    {
      accessorKey: "ticker",
      header: "Ticker",
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
    },
    {
      accessorKey: "amount",
      header: () => <div className="text-right">Amount</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("quantity")) * 100
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount)
   
        return <div className="text-right font-medium">{formatted}</div>
      },
    },
  ]

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={positions} />
    </div>
  )
}
