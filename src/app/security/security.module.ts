import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { Http401403InterceptorService } from './http-401-403-interceptor.service';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignOutComponent } from './sign-out/sign-out.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [SignInComponent, SignOutComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: Http401403InterceptorService, multi: true, },
  ]
})
export class SecurityModule { }
