import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatDatepickerModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSortModule,
  MatTableModule,
  MatToolbarModule,
  MatTooltipModule,
} from '@angular/material';
import { RouterModule } from '@angular/router';
import { BytesPipe } from './bytes.pipe';
import { GeneralErrorComponent } from './general-error/general-error.component';
import { InputIntegerComponent } from './input-integer/input-integer.component';
import { InputSearchComponent } from './input-search/input-search.component';
import { InputTextComponent } from './input-text/input-text.component';
import { PageTitleComponent } from './page-title/page-title.component';
import { ThrobberComponent } from './throbber/throbber.component';
import { InputSelectComponent } from '@app/shared/input-select/input-select.component';
import { InputDateComponent } from './input-date/input-date.component';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
    MatTooltipModule,
  ],
  declarations: [
    BytesPipe,
    GeneralErrorComponent,
    InputDateComponent,
    InputIntegerComponent,
    InputSearchComponent,
    InputSelectComponent,
    InputTextComponent,
    PageTitleComponent,
    ThrobberComponent,
  ],
  entryComponents: [],
  exports: [
    BytesPipe,
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    GeneralErrorComponent,
    InputDateComponent,
    InputIntegerComponent,
    InputSearchComponent,
    InputSelectComponent,
    InputTextComponent,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
    MatTooltipModule,
    PageTitleComponent,
    RouterModule,
    ThrobberComponent,
  ]
})
export class SharedModule {
  constructor() { }
}
