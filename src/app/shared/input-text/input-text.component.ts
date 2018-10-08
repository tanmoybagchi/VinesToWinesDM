import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { ErrorFocusService } from '@app/core/focus/error-focus.service';
import { UniqueIdService } from '@app/core/unique-id.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'input-text',
  templateUrl: './input-text.component.html'
})
export class InputTextComponent {
  @Input() disabled = false;
  @Input() errMsg: string;
  @Input() hint = '';
  @Input() label = '';
  @Input() placeholder = '';
  @Input() required = false;

  _model = '';
  @Input()
  set model(value: string) {
    // tslint:disable-next-line:no-unused-expression
    value !== null && value !== undefined && (this._model = value);
  }

  _maxlength = 256;
  @Input()
  set maxlength(value: number) {
    // tslint:disable-next-line:no-unused-expression
    !isNaN(value) && value > 0 && (this._maxlength = value);
  }

  _style: SafeStyle;
  @Input()
  set style(value: string) {
    this._style = this.sanitizer.bypassSecurityTrustStyle(value);
  }

  @Output()
  modelChange: EventEmitter<string>;

  inputName: string;
  errorStateMatcher: ErrorStateMatcher;

  constructor(
    private sanitizer: DomSanitizer,
    uniqueIdService: UniqueIdService,
    private errorFocusService: ErrorFocusService
  ) {
    this.inputName = uniqueIdService.getUniqueId().toString();
    this.modelChange = new EventEmitter<string>();
    this.errorStateMatcher = new ErrorStateMatcher();
    this.errorStateMatcher.isErrorState = () => String.hasData(this.errMsg);
  }

  onChange() {
    if (String.isNullOrWhitespace(this._model)) {
      this.modelChange.emit(null);
      return;
    }

    this.modelChange.emit(this._model.trim());
  }
}
