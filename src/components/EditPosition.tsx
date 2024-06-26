"use client";
 
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown, Link } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"

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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet"

import { type Position } from "@prisma/client";


import { api } from "~/trpc/react";
import React from "react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { Cryptocurrencies } from "~/lib/data";
import { Platforms } from "~/lib/data";
import Image from "next/image";
import { toast } from "./ui/use-toast";

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


export default function EditPosition({ position }: EditPositionProps) {
  const utils = api.useUtils()
  const {mutate: updatePosition} = api.positions.update.useMutation({
    async onSuccess() {
      toast({
        title: "Position updated",
      })
      await utils.positions.getAll.invalidate()
    },
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      id: position.id,
      data: {
        name: position.name,
        ticker: position.ticker,
        platform: position.platform,
        quantity: position.quantity,
      },
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
      updatePosition({
        id: data.id,
        data: data.data,
      })
    }

    function handleValueChange (selectedCryptoName: typeof Cryptocurrencies[number]["name"]){
      const selectedCrypto = Cryptocurrencies.find(
        (crypto) => crypto.name === selectedCryptoName
      );
      
      if(selectedCrypto) {
        form.setValue("data.ticker", selectedCrypto.symbol);
      }
    };
    
  
  

  return (
    <Sheet>
      <SheetTrigger className="w-full rounded-md px-2 py-1 text-left text-sm hover:bg-slate-100">
        Edit
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Position</SheetTitle>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-6">
                  {/* 
                    ASSET SELECTOR FORM SECTION
                  */}
                  <FormField
                    control={form.control}
                    name="data.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Asset</FormLabel>
                        <Select
                          onValueChange={(selectedCryptoName) => {
                            field.onChange(selectedCryptoName);
                            handleValueChange(selectedCryptoName);
                            console.log(form.getValues());
                          }}
                          value={field.value ?? ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Cryptocurrencies ? (
                              Cryptocurrencies.map((crypto) => (
                                <SelectItem key={crypto.id} value={crypto.name}>
                                  <div className="flex items-center gap-2">
                                    <Image
                                      src={crypto.image}
                                      alt={crypto.name}
                                      width={4}
                                      height={4}
                                      className="h-6 w-6 rounded-full"
                                    />
                                    <span>
                                      {crypto.name} | {crypto.symbol}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem
                                value="No cryptocurrencies found"
                                disabled
                              />
                            )}
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* 
                    PLATFORM SELECTOR FORM SECTION
                  */}
                  <FormField
                    control={form.control}
                    name="data.platform"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Platform</FormLabel>
                        <Select
                          onValueChange={(selectedPlatformName) => {
                            field.onChange(selectedPlatformName);
                          }}
                          value={field.value ?? ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Platforms ? (
                              Platforms.map((platform) => (
                                <SelectItem
                                  key={platform.id}
                                  value={platform.name}
                                >
                                  <div className="flex items-center gap-2">
                                    {/* <Image
                                      src={platform.image}
                                      alt={platform.name}
                                      width={4}
                                      height={4}
                                      className="h-6 w-6 rounded-full"
                                    /> */}
                                    <span>{platform.name}</span>
                                  </div>
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem
                                value="No platforms found..."
                                disabled
                              />
                            )}
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* 
                    ASSET AMOUNT FORM SECTION
                  */}
                  <FormField
                    control={form.control}
                    name="data.quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === '' || value.endsWith('.')) {
                                form.setValue(field.name, value);
                              } else {
                                const parsedValue = parseFloat(value);
                                if (!Number.isNaN(parsedValue)) {
                                  form.setValue(field.name, parsedValue);
                                }
                              }
                            }}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormDescription>
                          Amount of the asset you own
                        </FormDescription>
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