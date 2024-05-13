"use client";
 
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
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




const FormSchema = z.object({
    name: z.string({ required_error: "Name is required" }),
    ticker: z.string({required_error: "Ticker is required"}),
    platform: z.string({required_error: "Platform is required"}),
    quantity: z.number({required_error: "Quantity is required"}),
});


export default function CreatePosition() {
  const utils = api.useUtils()
  const {mutate: createPosition} = api.positions.create.useMutation({
    async onSuccess() {
      toast({
        title: "Position Created",
      })
      await utils.positions.getAll.invalidate()
    },
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
      createPosition({
        name: data.name,
        ticker: data.ticker,
        platform: data.platform,
        quantity: data.quantity,
      })
      
      form.reset();
    }

    function handleValueChange (selectedCryptoName: typeof Cryptocurrencies[number]["name"]){
      const selectedCrypto = Cryptocurrencies.find(
        (crypto) => crypto.name === selectedCryptoName
      );
      
      if(selectedCrypto) {
        form.setValue("ticker", selectedCrypto.symbol);
      }
    };
    
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className = "bottom-[40px] right-[40px] fixed h-12">
          <h1 className = "">Add Holding</h1>
          <Plus className="sm:h-12"/>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Position</SheetTitle>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-6">
                  {/* 
                    ASSET SELECTOR FORM SECTION
                  */}
                  <FormField
                    control={form.control}
                    name="name"
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
                              <SelectValue placeholder="Select DeFi Asset..."/>
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
                    name="platform"
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
                              <SelectValue placeholder="Select a platform..." />
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
                    name="quantity"
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
                            placeholder="0.00"
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
                  <Button type="submit">Add Position</Button>
                </div>
              </div>
            </form>
          </Form>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}