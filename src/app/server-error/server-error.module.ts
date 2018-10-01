import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { Http500Interceptor } from './http-500-interceptor.service';
import { ServerErrorComponent } from './server-error.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    ServerErrorComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: Http500Interceptor, multi: true, },
  ]
})
export class ServerErrorModule {
  constructor( @Optional() @SkipSelf() parentModule: ServerErrorModule) {
    if (parentModule) {
      throw new Error('ServerErrorModule is already loaded. Import it in the AppModule only');
    }
  }
}
