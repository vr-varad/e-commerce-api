import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { UnAuthorized } from "../expections/unAuthorized";
import { ErrorCode } from "../expections/root";
import { JWT_SECRET } from "../secrets";
import { prismaClient } from "..";
import { NotFoundError } from "../expections/notFound";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;

  if (!token) {
    return next(
      new UnAuthorized("Unauthorized User", ErrorCode.UNAUTHORIZED_USER)
    );
  }

  try {
    const payload: any = jwt.verify(token, JWT_SECRET);
    const user = await prismaClient.user.findFirst({
      where: {
        id: payload.userId,
      },
    });

    if (!user) {
      return next(
        new NotFoundError("User Not Found", ErrorCode.USER_NOT_FOUND)
      );
    }

    req.user = user as any;
    next();
  } catch (error) {
    return next(
      new UnAuthorized(
        "Unauthorized User",
        ErrorCode.UNAUTHORIZED_USER
      )
    );
  }
};

export default authMiddleware;
