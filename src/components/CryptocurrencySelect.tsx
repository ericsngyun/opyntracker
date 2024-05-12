"use client";

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"


type CryptoType = {
  id: string;
  symbol: string;
  name: string;
}

export function CryptocurrencySelect() {
const [cryptocurrencies, setCryptocurrencies] = React.useState<CryptoType[]>([])
  
  const cgurl = 'https://api.coingecko.com/api/v3/coins/list';
  const cgoptions = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'x-cg-demo-api-key': 'CG-pmW1N3MyimefAHgGqm5gGVUk',
    }
  }
React.useEffect(() => {
    fetch(cgurl, cgoptions)
      .then((response) => response.json())
      .then((data: CryptoType[]) => {
        setCryptocurrencies(data.slice(0,10))
      })
      .catch((error) => console.log(error))
  },[])
  


  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[220px] justify-between"
        >
          {value
            ? cryptocurrencies.find((cryptocurrency) => cryptocurrency.symbol === value)?.name
            : "Select cryptocurrency..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0">
        <Command>
          <CommandInput placeholder="Search cryptocurrencies..." />
          <CommandEmpty>No Cryptocurrency Found..</CommandEmpty>
          <CommandGroup>
            {cryptocurrencies.map((cryptocurrency) => (
              <CommandItem
                key={cryptocurrency.id}
                value={cryptocurrency.symbol}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === cryptocurrency.symbol ? "opacity-100" : "opacity-0"
                  )}
                />
                {cryptocurrency.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
