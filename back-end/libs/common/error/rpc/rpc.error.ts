import { RpcException } from '@nestjs/microservices';
import { RpcErrorType } from './rpc-error.enum';

export interface RpcErrorPayload {
    success: false;
    code: RpcErrorType;
    message: string;
    errors?: unknown;
}

export class RpcBaseException extends RpcException {
    constructor(code: RpcErrorType, message: string, errors?: string[]) {
        const payload: RpcErrorPayload = {
            success: false,
            code,
            message,
            ...(errors && { errors }),
        };

        super(payload);
    }
}

export class RpcNotFoundException extends RpcBaseException {
    constructor(message = 'Resource not found', errors?: string[]) {
        super(RpcErrorType.RESOURCE_NOT_FOUND, message, errors);
    }
}

export class RpcValidationException extends RpcBaseException {
    constructor(message = 'Validation failed', errors?: string[]) {
        super(RpcErrorType.VALIDATION_FAILED, message, errors);
    }
}

export class RpcInvalidInputException extends RpcBaseException {
    constructor(message = 'Invalid input', errors?: string[]) {
        super(RpcErrorType.INVALID_INPUT, message, errors);
    }
}

export class RpcUnauthorizedException extends RpcBaseException {
    constructor(message = 'Authentication required') {
        super(RpcErrorType.UNAUTHENTICATED, message);
    }
}

export class RpcForbiddenException extends RpcBaseException {
    constructor(message = 'Action forbidden') {
        super(RpcErrorType.FORBIDDEN_ACTION, message);
    }
}

export class RpcConflictException extends RpcBaseException {
    constructor(message = 'Resource conflict', errors?: string[]) {
        super(RpcErrorType.RESOURCE_CONFLICT, message, errors);
    }
}

export class RpcAlreadyExistsException extends RpcBaseException {
    constructor(message = 'Resource already exists', errors?: string[]) {
        super(RpcErrorType.RESOURCE_ALREADY_EXISTS, message, errors);
    }
}

export class RpcBusinessException extends RpcBaseException {
    constructor(message: string, errors?: string[]) {
        super(RpcErrorType.BUSINESS_RULE_VIOLATION, message, errors);
    }
}

export class RpcTimeoutException extends RpcBaseException {
    constructor(message = 'Operation timeout') {
        super(RpcErrorType.TIMEOUT, message);
    }
}

export class RpcDependencyException extends RpcBaseException {
    constructor(message = 'Dependency service failure', errors?: string[]) {
        super(RpcErrorType.DEPENDENCY_FAILURE, message, errors);
    }
}

export class RpcInternalException extends RpcBaseException {
    constructor(message = 'Internal service error', errors?: string[]) {
        super(RpcErrorType.INTERNAL_ERROR, message, errors);
    }
}

export class RpcUnknownException extends RpcBaseException {
    constructor(message = 'Unknown error', errors?: string[]) {
        super(RpcErrorType.UNKNOWN_ERROR, message, errors);
    }
}
