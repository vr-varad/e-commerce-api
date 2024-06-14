import { ErrorCode, HttpException } from "./root";

export class UnAuthorized extends HttpException {
    constructor(message: string, errorCode: ErrorCode){
        super(message, errorCode, 401, null)
    }
}
