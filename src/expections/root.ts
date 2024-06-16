
export class HttpException extends Error {
    message: string;
    errorCode: any;
    statusCode: number;
    errors: any;

    constructor(message: string, errorCode: ErrorCode, statusCode: number, errors: any){
        super(message);
        this.message = message;
        this.errorCode = errorCode;
        this.statusCode = statusCode;
        this.errors = errors
    }
}

export enum ErrorCode {
    USER_NOT_FOUND = 1001,
    USER_ALREADY_EXIXT = 1002,
    INCORRECT_PASSWORD = 1003,
    INVALID_DATA = 2001,
    INTERAL_SERVER_ERROR = 3001,
    UNAUTHORIZED_USER = 4001,
    PRODUCT_NOT_FOUND = 5001,
    ADDRESS_NOT_FOUND = 6001,
    ADDRESS_NOT_BELONG_TO_USER = 7001,

}