import { Component, OnInit } from '@angular/core';
import { Result } from '@app/core/result';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EventList } from '../events-models';
import { EventsQuery } from '../events-query.service';

@Component({
  selector: 'app-event-summary',
  templateUrl: './event-summary.component.html',
  styleUrls: ['./event-summary.component.scss']
})
export class EventSummaryComponent implements OnInit {
  errors: any;
  model: EventList;

  constructor(
    private eventsQuery: EventsQuery
  ) { }

  ngOnInit() {
    this.eventsQuery.execute().pipe(
      catchError(err => this.onError(err))
    ).subscribe((value: EventList) => this.onEventsQuery(value));
  }

  onEventsQuery(value: EventList) {
    this.model = value;
  }

  private onError(result: Result) {
    this.errors = result.errors;
    return EMPTY;
  }
}
