
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
    USER_NOT_FOUND = 5001,
    USER_ALREADY_EXIXT = 1002,
    INCORRECT_PASSWORD = 1003,
    INVALID_DATA = 2001,
    INTERAL_SERVER_ERROR = 3001,
    UNAUTHORIZED_USER = 4001,
    PRODUCT_NOT_FOUND = 5002,
    ADDRESS_NOT_FOUND = 5003,
    ADDRESS_NOT_BELONG_TO_USER = 6001,
    CART_NOT_BELONG_TO_USER = 6002,
    ORDER_NOT_FOUND = 5004,
    ORDER_NOT_BELONG_TO_USER =6003,
}