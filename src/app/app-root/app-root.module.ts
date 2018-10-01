import { NgModule } from '@angular/core';
import { AppFooterComponent } from '@app/app-root/app-footer/app-footer.component';
import { AppHeaderComponent } from '@app/app-root/app-header/app-header.component';
import { SharedModule } from '@app/shared/shared.module';
import { AppRootComponent } from './app-root.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    AppFooterComponent,
    AppHeaderComponent,
    AppRootComponent,
  ],
  exports: [AppRootComponent]
})
export class AppRootModule { }
