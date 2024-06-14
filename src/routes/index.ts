import { Router } from "express";
import authRoutes from "./auth";
import productRouter from "./products";


const rootRouter: Router = Router();

rootRouter.use('/auth',authRoutes)
rootRouter.use('/product',productRouter)

export default rootRouter