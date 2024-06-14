import { Router } from "express";
import { login, signUp, me } from "../controllers/auth";
import { errorHandler } from "../errorHandler";
import authMiddleware from "../middlewares/auth";

const authRoutes: Router = Router();

authRoutes.post("/signUp", errorHandler(signUp));
authRoutes.post("/login", errorHandler(login));
authRoutes.get("/me", authMiddleware, errorHandler(me));

export default authRoutes;
