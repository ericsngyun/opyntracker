
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const positionsRouter = createTRPCRouter({
  

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.position.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),

  delete: publicProcedure.input(z.object({
    id: z.string(),
  })).mutation(({ input, ctx }) => {
    return ctx.db.position.delete({
      where: { id: input.id },
    });
  }),

  update: publicProcedure.input(z.object({
    id: z.string(),
    data: z.object({
      name: z.string(),
      ticker: z.string(),
      platform: z.string(),
      quantity: z.number(),
    }),
  })).mutation(({ input, ctx }) => {
    return ctx.db.position.update({
      where: { id: input.id },
      data: input.data,
    });
  }),

  create: publicProcedure.input(z.object({
    name: z.string(),
    ticker: z.string(),
    platform: z.string(),
    quantity: z.number(),
  })).mutation(({ input, ctx }) => {
    return ctx.db.position.create({
      data: {
        name: input.name,
        ticker: input.ticker.toUpperCase(),
        platform: input.platform,
        quantity: input.quantity,
      },
    });
  }),
});
