import {HttpException} from '../expections/root'
import { NextFunction, Request, Response } from 'express'


export const ErrorMiddleware = (err: HttpException, req:Request, res:Response, next: NextFunction) => {
    return res.status(err.statusCode).json({
        message: err.message,
        errorCode: err.errorCode,
        errors: err.errors
    })
}