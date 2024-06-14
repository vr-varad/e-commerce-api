import { Router } from "express";
import { login, signUp } from "../controllers/auth";
import { errorHandler } from "../errorHandler";

const authRoutes: Router = Router();

authRoutes.post("/signUp", errorHandler(signUp));
authRoutes.post("/login", errorHandler(login));

export default authRoutes;
