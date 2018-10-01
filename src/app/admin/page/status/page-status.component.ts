import { Component, Input, OnInit } from '@angular/core';
import { Entity } from '@app/core/domain/models';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'page-status',
  templateUrl: './page-status.component.html'
})
export class PageStatusComponent implements OnInit {
  @Input() model: Entity;

  constructor() { }

  ngOnInit() {
  }
}
