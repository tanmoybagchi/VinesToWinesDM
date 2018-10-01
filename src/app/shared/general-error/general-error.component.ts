import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-general-error',
  templateUrl: './general-error.component.html',
  styleUrls: ['./general-error.component.scss']
})
export class GeneralErrorComponent implements OnInit {
  @Input() errors: any;

  constructor() { }

  ngOnInit() {
  }
}
