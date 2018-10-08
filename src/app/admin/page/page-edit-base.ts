import { OnInit } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Page } from '@app/admin/page/page';
import { AutoFocusService } from '@app/core/focus/auto-focus.service';
import { ErrorFocusService } from '@app/core/focus/error-focus.service';
import { Result } from '@app/core/result';
import { Pages } from '@app/page/pages';
import { EMPTY, Subject } from 'rxjs';
import { catchError, debounceTime } from 'rxjs/operators';
import { PageApproveResult } from '../page/commands/page-approve-command.service';
import { PageChangeResult } from '../page/commands/page-change-command.service';
import { PageDeleteResult } from '../page/commands/page-delete-command.service';
import { PageRecallResult } from '../page/commands/page-recall-command.service';
import { PageRecoverResult } from '../page/commands/page-recover-command.service';
import { PageUpdateCommand, PageUpdateResult } from '../page/commands/page-update-command.service';
import { PageIdQuery } from '../page/queries/page-id-query.service';

export abstract class PageEditBase<TPage extends Page> implements OnInit {
  errors: any;
  model: TPage;
  modelCreator: { new(): TPage };
  name = '';
  private errorStateMatchers: { [propName: string]: ErrorStateMatcher } = {};
  private pages = new Pages();
  protected abstract approvalRules: { check: (model: TPage) => Result };
  readOnly = false;
  saveStream = new Subject();

  constructor(
    protected autoFocusService: AutoFocusService,
    protected errorFocusService: ErrorFocusService,
    protected pageIdQuery: PageIdQuery,
    protected pageUpdateCommand: PageUpdateCommand,
    protected route: ActivatedRoute,
    protected router: Router,
  ) {
    this.model = {} as TPage;
  }

  ngOnInit() {
    this.model = new this.modelCreator();

    this.saveStream.pipe(
      debounceTime(750)
    ).subscribe(() => this.update());

    this.route.paramMap.subscribe((params) => this.onIdParam(params));
  }

  protected onIdParam(params: ParamMap) {
    // tslint:disable-next-line:no-unused-expression
    String.isNullOrWhitespace(this.model.kind) && (this.model.kind = params.get('kind'));

    const pageInfo = this.pages.list.filter(p => p.link === this.model.kind);
    if (pageInfo.length === 1) {
      this.name = `${pageInfo[0].name} edit`;
    }

    this.pageIdQuery.execute(Number(params.get('id')), this.model.kind, this.modelCreator).pipe(
      catchError(err => this.onError(err))
    ).subscribe(_ => this.onPage(_));
  }

  protected onPage(model: TPage) {
    this.model = model;

    this.readOnly = model.status !== 'Draft';

    // tslint:disable-next-line:no-unused-expression
    !this.readOnly && this.autoFocusService.focusFirst();
  }

  createCanApprove() {
    return () => {
      const res = this.approvalRules.check(this.model);
      if (res.hasErrors) {
        this.onError(res);
        return false;
      }

      return true;
    };
  }

  onApprove(res: PageApproveResult) {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  onChange(result: PageChangeResult) {
    if (result.id !== this.model.id) {
      this.router.navigate(['..', result.id], { relativeTo: this.route, replaceUrl: true });
      return;
    }

    this.readOnly = false;
    this.model.status = result.status;
    this.model.savedBy = result.savedBy;
    this.model.savedOn = result.savedOn;
    this.model.version = result.version;
  }

  onDelete(res: PageDeleteResult) {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  onRecall(res: PageRecallResult) {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  onRecover(result: PageRecoverResult) {
    this.readOnly = false;
    this.model.status = result.status;
    this.model.savedBy = result.savedBy;
    this.model.savedOn = result.savedOn;
    this.model.version = result.version;
  }

  protected update() {
    this.pageUpdateCommand.execute(this.model).pipe(
      catchError(err => this.onError(err))
    ).subscribe(_ => this.onUpdate(_));
  }

  private onUpdate(result: PageUpdateResult) {
    this.model.status = result.status;
    this.model.savedBy = result.savedBy;
    this.model.savedOn = result.savedOn;
    this.model.version = result.version;
  }

  createErrorStateMatcher(propName: string) {
    if (!(propName in this.errorStateMatchers)) {
      const errMatcher = new ErrorStateMatcher();
      errMatcher['inError'] = false;

      errMatcher.isErrorState = () => this.errors && errMatcher['inError'];

      this.errorStateMatchers[propName] = errMatcher;
    }

    return this.errorStateMatchers[propName];
  }

  onError(result: Result) {
    this.errors = result.errors;
    this.setErrorStateMatchers();
    this.errorFocusService.scrollIntoView();
    return EMPTY;
  }

  private setErrorStateMatchers() {
    for (const propName in this.errorStateMatchers) {
      if (!this.errorStateMatchers.hasOwnProperty(propName)) {
        continue;
      }
      const errorStateMatcher = this.errorStateMatchers[propName];
      errorStateMatcher['inError'] = false;

      const parts = propName.split('.');
      let val = this.errors;

      for (let index = 0; index < parts.length; index++) {
        val = val[parts[index]];

        if (val === null || val === undefined) {
          break;
        }

        if (typeof val === 'string') {
          errorStateMatcher['inError'] = String.hasData(val);
          break;
        }
      }
    }
  }
}
