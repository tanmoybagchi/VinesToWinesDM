import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './admin-events.component.html'
})
export class AdminEventsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onOKClick() {
    // https://calendar.google.com/calendar/embed?src=staveschurchdsm%40gmail.com&ctz=America%2FChicago
    window.location.href = 'https://calendar.google.com/calendar/b/1/r';
  }
}
