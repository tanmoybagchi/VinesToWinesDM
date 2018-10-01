import { Component } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { EventManagerService } from '@app/core/event-sourcing/event-manager.service';
import { HideThrobberEvent, ShowThrobberEvent } from '@app/shared/throbber/throbber-events';
import { filter } from 'rxjs/operators';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'throbber',
  templateUrl: './throbber.component.html',
  styleUrls: ['./throbber.component.scss']
})
export class ThrobberComponent {
  private requestCount = 0;
  private delay = 500;
  private waitingOnServer = false;

  show = false;

  constructor(
    private router: Router,
    eventManagerService: EventManagerService,
  ) {
    this.router.events.pipe(
      filter(ev => ev instanceof NavigationStart)
    ).subscribe(_ => this.waitStart());

    eventManagerService.handle(ShowThrobberEvent).subscribe(_ => this.waitStart());

    this.router.events.pipe(
      filter(ev => ev instanceof NavigationCancel || ev instanceof NavigationEnd || ev instanceof NavigationError)
    ).subscribe(_ => this.waitEnd());

    eventManagerService.handle(HideThrobberEvent).subscribe(_ => this.waitEnd());
  }

  waitStart() {
    this.requestCount++;
    this.waitingOnServer = true;

    window.setTimeout(() => {
      if (!this.waitingOnServer) {
        return;
      }

      this.show = true;
    }, this.delay);
  }

  waitEnd() {
    this.requestCount--;

    // tslint:disable-next-line:no-unused-expression
    this.requestCount === 0 && (this.show = false);

    this.waitingOnServer = false;
  }
}
