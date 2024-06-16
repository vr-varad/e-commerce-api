import { NextFunction, Request, Response } from "express";
import { ErrorCode, HttpException } from "./expections/root";
import { InternalError } from "./expections/internal_error";
import { ZodError } from "zod";
import { BadRequestException } from "./expections/bad_request";

export const errorHandler = (method: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await method(req, res, next);
    } catch (error: any) {
      let expection: HttpException;
      if (error instanceof HttpException) {
        expection = error;
      } else {
        if (error instanceof ZodError) {
          expection = new BadRequestException(
            "Invalid Data Entered",
            ErrorCode.INVALID_DATA
          );
        } else {
          expection = new InternalError(
            "Internal Server Error",
            error,
            ErrorCode.INTERAL_SERVER_ERROR
          );
        }
      }
      next(expection);
    }
  };
};
