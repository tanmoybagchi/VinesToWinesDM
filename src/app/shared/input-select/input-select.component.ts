import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { ErrorFocusService } from '@app/core/focus/error-focus.service';
import { UniqueIdService } from '@app/core/unique-id.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'input-select',
  templateUrl: './input-select.component.html'
})
export class InputSelectComponent {
  @Input() disabled = false;
  @Input() errMsg = '';
  @Input() hint = '';
  @Input() label = '';
  @Input() required = false;
  @Input() model = 0;
  @Input() items: SelectItem[] = [];

  @Output()
  modelChange: EventEmitter<number>;

  inputName: string;
  errorStateMatcher: ErrorStateMatcher;

  constructor(
    private sanitizer: DomSanitizer,
    uniqueIdService: UniqueIdService,
    private errorFocusService: ErrorFocusService
  ) {
    this.inputName = uniqueIdService.getUniqueId().toString();
    this.modelChange = new EventEmitter<number>();
    this.errorStateMatcher = new ErrorStateMatcher();
    this.errorStateMatcher.isErrorState = () => String.hasData(this.errMsg);
  }

  onChange() {
    this.modelChange.emit(Number(this.model));
  }
}

export class SelectItem {
  key = 0;
  value = '';
}
