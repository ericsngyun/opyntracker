import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const positionsRouter = createTRPCRouter({
  

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.position.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),
});
