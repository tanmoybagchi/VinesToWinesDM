import { Component, OnInit } from '@angular/core';
import { DomainHelper } from '@app/core/domain/domain-helper';
import { Result } from '@app/core/result';
import { Homepage } from '@app/homepage/homepage';
import { Page } from '@app/page/page';
import { PageCurrentQuery } from '@app/page/page-current-query.service';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  templateUrl: './homepage.component.html'
})
export class HomepageComponent implements OnInit {
  errors: any;
  model = new Homepage();

  constructor(
    private pageCurrentQuery: PageCurrentQuery,
  ) { }

  ngOnInit() {
    this.pageCurrentQuery.execute('homepage').pipe(
      catchError(err => this.onError(err))
    ).subscribe(_ => this.onQuery(_));
  }

  onQuery(page: Page) {
    // tslint:disable-next-line:no-unused-expression
    page && (this.model = DomainHelper.adapt(Homepage, page.content));
  }

  private onError(result: Result) {
    this.errors = result.errors;
    return EMPTY;
  }
}
