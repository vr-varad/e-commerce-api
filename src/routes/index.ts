import { Router } from "express";
import authRoutes from "./auth";
import productRouter from "./products";
import userRouter from "./users";


const rootRouter: Router = Router();

rootRouter.use('/auth',authRoutes)
rootRouter.use('/product',productRouter)
rootRouter.use('/users',userRouter)

export default rootRouter