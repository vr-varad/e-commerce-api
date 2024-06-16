import { Router } from "express";
import {addAddress, changeRole, deleteAddress, getUserById, listAddress, listUsers, updateUser} from '../controllers/users'
import { errorHandler } from "../errorHandler";
import authMiddleware from "../middlewares/auth";
import adminMiddlware from "../middlewares/admin";

const userRouter = Router();

userRouter.post('/address',[authMiddleware], errorHandler(addAddress))
userRouter.delete('/address/:id',[authMiddleware], errorHandler(deleteAddress))
userRouter.get('/address/',[authMiddleware], errorHandler(listAddress))
userRouter.put('/',[authMiddleware],errorHandler(updateUser))
userRouter.put('/:id/role',[authMiddleware,adminMiddlware], errorHandler(changeRole))
userRouter.get('/',[authMiddleware,adminMiddlware],errorHandler(listUsers))
userRouter.get('/:id',[authMiddleware,adminMiddlware],errorHandler(getUserById))

export default userRouter

