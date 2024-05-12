"use client";
 
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { toast } from "~/components/ui/use-toast"
 

import { Position } from "@prisma/client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet"

import { api } from "~/trpc/react";
import React from "react";
import { Input } from "./ui/input";

type EditPositionProps = {
  position: Position
}



const FormSchema = z.object({
  id: z.string(),
  data: z.object({
    name: z.string({ required_error: "Name is required" }),
    ticker: z.string({required_error: "Ticker is required"}),
    platform: z.string({required_error: "Platform is required"}),
    quantity: z.number({required_error: "Quantity is required"}),
  }),
});

type CryptoType = {
  id: string;
  symbol: string;
  name: string;
}


export default function EditPosition({ position }: EditPositionProps) {
  const [cryptocurrencies, setCryptocurrencies] = React.useState<CryptoType[]>([
    {
      id: "bitcoin",
      symbol: "btc",
      name: "Bitcoin",
    },
    {
      id: "ethereum",
      symbol: "eth",
      name: "Ethereum",
    },
    {
      id: "tether",
      symbol: "usdt",
      name: "Tether",
    },
    {
      id: "binancecoin",
      symbol: "bnb",
      name: "Binance Coin",
    },
    {
      id: "cardano",
      symbol: "ada",
      name: "Cardano",
    },
    {
      id: "ripple",
      symbol: "xrp",
      name: "Ripple",
    },
    {
      id: "dogecoin",
      symbol: "doge",
      name: "Dogecoin",
    },
    {
      id: "polkadot",
      symbol: "dot",
      name: "Polkadot",
    },
    {
      id: "usd-coin",
      symbol: "usdc",
      name: "USD Coin",
    },
    {
      id: "uniswap",
      symbol: "uni",
      name: "Uniswap",
    },
  ])

  const utils = api.useUtils()
  const {mutate: updatePosition} = api.positions.update.useMutation({
    async onSuccess() {
      await utils.positions.getAll.invalidate()
    },
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
      updatePosition({
        id: data.id,
        data: data.data,
      })
    }
  
  

  return (
    <Sheet>
      <SheetTrigger>Edit</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Position</SheetTitle>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col gap-6">
                <div>
                  <FormField
                    control={form.control}
                    name="data.name"
                    render={({ field }) => (
                      <FormItem >
                        <FormLabel>Cryptocurrency</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-[300px] justify-between",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value
                                ? cryptocurrencies.find(
                                    (cryptocurrency) =>
                                      cryptocurrency.name === field.value,
                                  )?.name
                                : "Select Cryptocurrency"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[220px] p-0">
                            <Command>
                              <CommandInput
                                placeholder="Search cryptocurrencies..."
                                {...field}
                              />
                              <CommandEmpty>
                                No Cryptocurrency Found..
                              </CommandEmpty>
                              <CommandGroup>
                                <CommandList className="h-full w-full overflow-scroll">
                                  {cryptocurrencies?.map((cryptocurrency) => (
                                    <CommandItem
                                      key={cryptocurrency.id}
                                      value={cryptocurrency.name}
                                      onSelect={() => {
                                        form.setValue(
                                          field.name,
                                          cryptocurrency.name,
                                        );
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          field.value === cryptocurrency.name
                                            ? "opacity-100"
                                            : "opacity-0",
                                        )}
                                      />
                                      {cryptocurrency.name}
                                    </CommandItem>
                                  ))}
                                </CommandList>
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="data.quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              form.setValue(field.name, value);
                            }}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="data.platform"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Platform</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex w-full justify-end">
                  <Button type="submit">Save</Button>
                </div>
              </div>
            </form>
          </Form>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}