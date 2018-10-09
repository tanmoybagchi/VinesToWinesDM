import { Injectable } from '@angular/core';
import { DomainHelper } from '@app/core/domain/domain-helper';
import { DriveFileQuery } from '@app/gapi/drive-file-query.service';
import { DriveFilesQuery } from '@app/gapi/drive-files-query.service';
import { Page } from '@app/page/page';
import { PageModule } from '@app/page/page.module';
import { environment } from '@env/environment';
import { EMPTY, Observable, of } from 'rxjs';
import { map, share, switchMap } from 'rxjs/operators';
import { DriveFolderQuery } from '@app/gapi/drive-folder-query.service';
import { LocalStorageService } from '@app/core/storage/local-storage.service';

@Injectable({
  providedIn: PageModule
})
export class PageDatabase {
  fileId = '';
  version = 0;
  pages: Page[];
  private observable: Observable<any[]>;
  private initialising = true;

  constructor(
    private driveFileQuery: DriveFileQuery,
    private driveFilesQuery: DriveFilesQuery,
    private driveFolderQuery: DriveFolderQuery,
    private storage: LocalStorageService,
  ) {
    this.pages = null;
    this.initialize();
  }

  initialize(): any {
    this.initialising = true;

    const cachedItem = this.storage.get('database');
    if (cachedItem) {
      this.fileId = cachedItem.fileId || '';
      this.version = cachedItem.version || 0;
      this.pages = (cachedItem.pages || []).map(page => DomainHelper.adapt(Page, page));
    }

    this.observable = this.driveFolderQuery.execute(environment.rootFolder).pipe(
      switchMap(folderId => this.onFolder(folderId)),
      share()
    );
  }

  private onFolder(folderId: string) {
    return this.driveFilesQuery.execute(environment.database, [folderId]).pipe(
      switchMap(files => this.onFiles(files))
    );
  }

  private onFiles(files: DriveFilesQuery.Result[]) {
    if (files.length !== 1) {
      this.pages = [];
      this.initialising = false;
      return EMPTY;
    }

    if (this.fileId === files[0].id && this.version === files[0].version) {
      this.initialising = false;
      return of(this.pages);
    }

    this.fileId = files[0].id;
    this.version = files[0].version;

    return this.driveFileQuery.execute(this.fileId).pipe(
      map((x: any[]) => {
        // when the cached data is available we don't need the 'Observable' reference anymore
        this.observable = null;

        this.pages = x.map(page => DomainHelper.adapt(Page, page));

        this.storage.set('database', { fileId: this.fileId, version: this.version, pages: x });

        this.initialising = false;

        return this.pages;
      })
    );
  }

  get(kind: string) {
    const result = this.initialising ? this.observable : of(this.pages);
    return result.pipe(
      map(pages => pages
        .filter(x => x.kind === kind)
        .map(page => DomainHelper.adapt(Page, page))
      )
    );
  }
}
