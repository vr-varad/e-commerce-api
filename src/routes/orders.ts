import { Router } from "express";
import { errorHandler } from "../errorHandler";
import authMiddleware from "../middlewares/auth";
import { cancelOrder, createOrder, getOrderById, listOrder, listAllOrders, listUserOrders, changeStatus } from "../controllers/orders";
import adminMiddlware from "../middlewares/admin";

const orderRouter = Router();

orderRouter.post('/',[authMiddleware], errorHandler(createOrder))
orderRouter.get('/',[authMiddleware], errorHandler(listOrder))
orderRouter.put('/:id/cancel',[authMiddleware], errorHandler(cancelOrder))
orderRouter.get('/:id',[authMiddleware],errorHandler(getOrderById))
orderRouter.get('/index',[authMiddleware, adminMiddlware],errorHandler(listAllOrders))
orderRouter.get('/users/:id',[authMiddleware, adminMiddlware],errorHandler(listUserOrders))
orderRouter.put('/:id/status',[authMiddleware, adminMiddlware],errorHandler(changeStatus))

export default orderRouter

