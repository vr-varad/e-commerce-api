import { NextFunction, Request, Response } from "express"
import { ErrorCode, HttpException } from "./expections/root"
import { InternalError } from "./expections/internal_error"


export const errorHandler = (method: Function)=>{
    return async (req: Request, res: Response, next: NextFunction)=>{
        try {
            await method(req,res,next)
        } catch (error: any) {
            console.log(error)
            let expection: HttpException;
            if(error instanceof HttpException){
                expection = error   
            }else{
                expection = new InternalError("Internal Server Error",error,ErrorCode.INTERAL_SERVER_ERROR,)
            }
            next(expection)
        }
    }
    
}