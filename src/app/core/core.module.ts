import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { Http400404Interceptor } from './http-400-404-interceptor.service';
import { ConsoleLoggerService } from './logger/console-logger.service';
import { LoggerConfig } from './logger/logger-config';
import { LoggerService } from './logger/logger.service';
import { StorageConfig } from './storage/storage-config';

@NgModule({
  imports: [HttpClientModule],
  declarations: [],
  entryComponents: [],
  exports: [],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: Http400404Interceptor, multi: true, },
    { provide: LoggerService, useClass: ConsoleLoggerService },
  ]
})
export class CoreModule {
  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
  }

  // tslint:disable-next-line:max-line-length
  static forRoot(storageConfig: StorageConfig, loggerConfig: LoggerConfig): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        { provide: StorageConfig, useValue: storageConfig },
        { provide: LoggerConfig, useValue: loggerConfig }
      ]
    };
  }
}
