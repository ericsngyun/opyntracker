'use client'
import { DataTable } from "./data-table"
import { api } from "~/trpc/react"
import { Position } from "@prisma/client"
import type { ColumnDef } from "@tanstack/react-table"
import { useEffect, useState } from "react"
import { Checkbox } from "../ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import {  MoreHorizontal } from "lucide-react"
import EditPosition from "../EditPosition"
import { toast } from "../ui/use-toast"
import { ConversionRateAPIResponse } from "~/app/page"

type PortfolioTableProps = {
  positions: Position[] | undefined
  conversionRates: Record<string, string> | undefined
}

export default function PortfolioTable({positions, conversionRates}:PortfolioTableProps) {
  const utils = api.useUtils()
 
  const {mutate: deletePosition} = api.positions.delete.useMutation({
    async onSuccess() {
      await utils.positions.getAll.invalidate()
    },
  })

  const columns: ColumnDef<Position>[] = [

    {
      accessorKey: "ticker",
      header: "Ticker",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            
            <span>{row.original.ticker}</span>
          </div>
        )
      }
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ row }) => {
        return (
          <div className="text-center">
            {row.original.quantity}
          </div>
        )
      }
    },
    {
      accessorKey: "platform",
      header: "Platform",
    },
    {
      accessorKey: "amount",
      header: () => {
        return(
          <div 
            className="text-right"
          >
            Amount
          </div>
        )
        
      },
      cell: ({ row }) => {
        const currentRate = conversionRates?.[row.original.ticker] ?? 1;
        const amount = parseFloat(row.getValue("quantity")) * (1 / (currentRate as number));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);

        return <div className="text-end font-medium">{formatted}</div>;
      },

    },
    {
      id: "actions",
      cell: ({ row }) => {
        const position = row.original; 
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="space-y-2">
              <DropdownMenuItem asChild>
                <EditPosition position={position} />
              </DropdownMenuItem>

              <DropdownMenuItem
                className="bg-red-500 text-white hover:bg-red-100"
                onClick={() => {
                  deletePosition({ id: position.id });
                  toast({
                    variant: "destructive",
                    title: "Position deleted",
                    description: "Your position has been deleted",
                  });
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  if (!positions) {
    return null
  }

  return (
    <div className="container mx-auto pb-7">
      <DataTable columns={columns} data={positions} />
    </div>
  )
}
