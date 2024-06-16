import { Router } from "express";
import { errorHandler } from "../errorHandler";
import authMiddleware from "../middlewares/auth";
import { addItemtoCart, changeQuantity, deleteItemFromCart, getCart } from "../controllers/cart";

const cartRouter = Router();

cartRouter.post('/',[authMiddleware], errorHandler(addItemtoCart))
cartRouter.get('/',[authMiddleware], errorHandler(getCart))
cartRouter.delete('/:id',[authMiddleware], errorHandler(deleteItemFromCart))
cartRouter.put('/:id',[authMiddleware],errorHandler(changeQuantity))

export default cartRouter

