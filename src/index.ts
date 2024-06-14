import express, { Express, query, Request, Response } from "express";
import { PORT } from "./secrets";
import rootRouter from "./routes";
import { PrismaClient } from "@prisma/client";
import { ErrorMiddleware } from "./middlewares/errors";
import { SignUpSchema } from "./schemas/user";

const app: Express = express();

app.use(express.json());

app.use("/api", rootRouter);

export const prismaClient = new PrismaClient({
  log: ["query"],
}).$extends({
  query: {
    user: {
      create: ({ args, query }) => {
        args.data = SignUpSchema.parse(args.data);
        return query(args);
      },
    },
  },
});

app.use(ErrorMiddleware);

app.listen(PORT, () => {
  console.log("Server Running on Port 3000");
});
