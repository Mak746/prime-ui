import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, catchError } from 'rxjs';
import { DetailResponse } from '../dtos';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError((err) => {
        const response = err?.response?.message?.toString() || err?.message?.toString() || err;
        const resp = err?.response || err;
        console.log('Are we here with response ', resp);
        if (resp instanceof HttpException) {
          console.log('Are we here with response 1', resp);
          const detailResponse = new DetailResponse(null, response, false, resp?.getStatus());
          return Promise.resolve(detailResponse);
        } else if (err instanceof HttpException) {
          console.log('Are we here with response 2', resp);
          const detailResponse = new DetailResponse(null, response, false, err?.getStatus());
          return Promise.resolve(detailResponse);
        } else {
          console.log('Are we here with response 3', resp);
          const detailResponse = new DetailResponse(null, response, false, HttpStatus.INTERNAL_SERVER_ERROR);
          return Promise.resolve(detailResponse);
        }
      }),
    );
  }
}
