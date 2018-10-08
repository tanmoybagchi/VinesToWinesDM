import { Injectable } from '@angular/core';
import { CallerModule } from '@app/caller/caller.module';
import { DomainHelper } from '@app/core/domain/domain-helper';
import { PagesCurrentQuery } from '@app/page/pages-current-query.service';
import { map } from 'rxjs/operators';
import { Caller } from './caller';

@Injectable({ providedIn: CallerModule })
export class CallerCurrentQuery {
  constructor(
    private pagesCurrentQuery: PagesCurrentQuery,
  ) { }

  execute() {
    return this.pagesCurrentQuery.execute('caller').pipe(
      map(list => list.map(item => DomainHelper.adapt(Caller, item)))
    );
  }
}
