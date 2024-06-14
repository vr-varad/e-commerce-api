import { ErrorCode, HttpException } from "./root";

export class InvalidData extends HttpException { 
    constructor(errors: any, message: string, errorCode: ErrorCode){
        super(message, errorCode, 422, errors)
        this.errors = errors
        this.message = message
    }
}