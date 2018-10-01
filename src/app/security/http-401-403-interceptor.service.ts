import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Result } from '@app/core/result';
import { AuthTokenService } from '@app/security/auth-token.service';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class Http401403InterceptorService implements HttpInterceptor {
  constructor(
    private authTokenService: AuthTokenService,
    private router: Router,
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let update = {};

    if (!req.headers.has('Authorization')) {
      const authToken = this.authTokenService.getAuthToken();
      if (authToken) {
        update = { setHeaders: { Authorization: authToken } };
      }
    }

    // Pass on the cloned request instead of the original request.
    return next.handle(req.clone(update)).pipe(
      tap((event: any) => {
        if (event instanceof HttpResponse) {
          try {
            // tslint:disable-next-line:no-unused-expression
            if (event.body && String.hasData(event.body.token)) {
              this.authTokenService.setAuthToken(event.body.token);
            }
          } catch (e) { /* empty */ }
        }
      }),
      catchError(err => {
        if (!(err instanceof HttpErrorResponse)) {
          return throwError(err);
        }

        if (err.status !== 401 && err.status !== 403) {
          return throwError(err);
        }

        if (err.status === 401) {
          this.router.navigate(['sign-in'], { replaceUrl: true });
          return EMPTY;
        }

        if (err.status === 403) {
          const res = new Result();
          res.addError('forbidden');
          return throwError(res);
        }
      })
    );
  }
}
