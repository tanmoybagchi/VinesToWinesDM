import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { routes } from '@app/app-routes';
import { AnnouncementModule } from './announcement/announcement.module';
import { AppRootComponent } from './app-root/app-root.component';
import { AppRootModule } from './app-root/app-root.module';
import { CallerModule } from './caller/caller.module';
import { CoreModule } from './core/core.module';
import { LogLevel } from './core/logger/logger-config';
import { EventsModule } from './events/events.module';
import { GapiModule } from './gapi/gapi.module';
import { HomepageModule } from './homepage/homepage.module';
import { PageModule } from './page/page.module';
import { PhotoModule } from './photo/photo.module';
import { SecurityModule } from './security/security.module';
import { SermonModule } from './sermon/sermon.module';
import { ServerErrorModule } from './server-error/server-error.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [],
  imports: [
    // The first two modules need to be BrowserAnimationsModule and SharedModule.
    BrowserAnimationsModule,
    SharedModule,
    AnnouncementModule,
    AppRootModule,
    CallerModule,
    CoreModule.forRoot({ keyPrefix: 'VinesToWinesDM' }, { logLevel: LogLevel.Warn }),
    EventsModule,
    GapiModule,
    HomepageModule,
    PageModule,
    PhotoModule,
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
    SecurityModule,
    SermonModule,
    ServerErrorModule,
  ],
  bootstrap: [AppRootComponent]
})
export class AppModule { }
