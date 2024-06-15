import { NextFunction, Request, Response } from "express";
import { UnAuthorized } from "../expections/unAuthorized";
import { ErrorCode } from "../expections/root";
import { User } from "@prisma/client";

declare module "express-serve-static-core" {
  interface Request {
    user?: User;
  }
}


const adminMiddlware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user && user.role == "ADMIN") {
    return next();
  }
  return next(
    new UnAuthorized("Unauthorised User", ErrorCode.UNAUTHORIZED_USER)
  );
};

export default adminMiddlware;
