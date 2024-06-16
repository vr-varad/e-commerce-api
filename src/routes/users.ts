import { Router } from "express";
import {addAddress, deleteAddress, listAddress, updateUser} from '../controllers/users'
import { errorHandler } from "../errorHandler";
import authMiddleware from "../middlewares/auth";

const userRouter = Router();

userRouter.post('/address',[authMiddleware], errorHandler(addAddress))
userRouter.delete('/address/:id',[authMiddleware], errorHandler(deleteAddress))
userRouter.get('/address/',[authMiddleware], errorHandler(listAddress))
userRouter.put('/',[authMiddleware],errorHandler(updateUser))

export default userRouter

