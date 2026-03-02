import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    BadRequestException,
    UnauthorizedException,
    ForbiddenException,
    NotFoundException,
    ConflictException,
    InternalServerErrorException,
    ServiceUnavailableException,
    GatewayTimeoutException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

import { RpcErrorPayload, RpcErrorType } from 'libs/common/error';

@Catch()
export class GlobalRpcExceptionFilter implements ExceptionFilter {
    catch(exception: RpcException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        const error = exception as unknown as RpcErrorPayload;

        const httpException = this.mapRpcError(error);

        response
            .status(httpException.getStatus())
            .json(httpException.getResponse());
    }

    private mapRpcError(error: RpcErrorPayload): HttpException {
        switch (error.code) {
            case RpcErrorType.INVALID_INPUT:
            case RpcErrorType.VALIDATION_FAILED:
            case RpcErrorType.MALFORMED_PAYLOAD:
                return new BadRequestException({
                    message: error.message,
                    errors: error.errors,
                });

            case RpcErrorType.UNAUTHENTICATED:
                return new UnauthorizedException(error.message);

            case RpcErrorType.FORBIDDEN_ACTION:
                return new ForbiddenException(error.message);

            case RpcErrorType.RESOURCE_NOT_FOUND:
                return new NotFoundException(error.message);

            case RpcErrorType.RESOURCE_ALREADY_EXISTS:
            case RpcErrorType.RESOURCE_CONFLICT:
                return new ConflictException(error.message);

            case RpcErrorType.TIMEOUT:
                return new GatewayTimeoutException(error.message);

            case RpcErrorType.DEPENDENCY_FAILURE:
            case RpcErrorType.SERVICE_UNAVAILABLE:
                return new ServiceUnavailableException(error.message);

            case RpcErrorType.INTERNAL_ERROR:
            case RpcErrorType.DATA_ACCESS_ERROR:
            case RpcErrorType.SERIALIZATION_ERROR:
            case RpcErrorType.UNKNOWN_ERROR:
            default:
                return new InternalServerErrorException(
                    error.message ?? 'Internal server error',
                );
        }
    }
}
