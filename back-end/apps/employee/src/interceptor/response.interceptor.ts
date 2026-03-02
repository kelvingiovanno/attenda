import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { ServiceResponse } from 'libs/common/interface';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
    T,
    ServiceResponse<T>
> {
    intercept(
        _context: ExecutionContext,
        next: CallHandler,
    ): Observable<ServiceResponse<T>> {
        return next.handle().pipe(
            map((data: T) => ({
                success: true,
                data,
            })),
        );
    }
}
