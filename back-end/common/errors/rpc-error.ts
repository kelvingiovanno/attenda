import { RpcException } from '@nestjs/microservices';

interface RpcError {
    code?: string;
    message?: string;
    errors: string[];
}

export enum RpcErrorCode {
    NOT_RECORD = 'NOT_RECORD',
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    INTERNAL_ERROR = 'INTERNAL_ERROR',
}

export function isRpcError(error: unknown): error is RpcError {
    return typeof error === 'object' && error !== null && 'code' in error;
}

class BaseRpcException extends RpcException {
    constructor(code: RpcErrorCode, message: string, errors?: string[]) {
        super({
            code: code,
            message: message,
            ...(errors && { errors }),
        });
    }
}

export class RpcNotRecordException extends BaseRpcException {
    constructor(message: string, errors?: string[]) {
        super(RpcErrorCode.NOT_RECORD, message, errors);
    }
}

export class RpcValidationErrorException extends BaseRpcException {
    constructor(message: string, errors?: string[]) {
        super(RpcErrorCode.VALIDATION_ERROR, message, errors);
    }
}

export class RpcInternalErrorException extends BaseRpcException {
    constructor(message: string, errors?: string[]) {
        super(RpcErrorCode.INTERNAL_ERROR, message, errors);
    }
}
