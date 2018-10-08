import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GoogleAccessToken } from '@app/gapi/google-access-token';
import { environment } from '@env/environment';
import { Observable, of } from 'rxjs';
import { map, share, switchMap, tap } from 'rxjs/operators';
import { GapiModule } from './gapi.module';
import { ServiceAccountSigninCommand } from './service-account-signin-command.service';

@Injectable({
  providedIn: GapiModule
})
export class DriveFolderQuery {
  private data: { name: string, id: string }[] = [];
  private observable: Observable<any>;
  private initializing = false;

  constructor(
    private http: HttpClient,
    private serviceAccountSigninCommand: ServiceAccountSigninCommand
  ) {
    this.initialize();
  }

  execute(name = '') {
    if (String.isNullOrWhitespace(name)) {
      return of('');
    }

    if (this.initializing) {
      return this.observable.pipe(
        map(() => {
          const item = this.data.find(x => x.name === name);
          return item ? item.id : '';
        })
      );
    }

    const folder = this.data.find(x => x.name === name);
    if (folder) {
      return of(folder.id);
    }
  }

  initialize() {
    if (this.initializing) {
      return;
    }

    this.initializing = true;

    this.data = [];

    this.observable = this.serviceAccountSigninCommand.execute().pipe(
      switchMap(_ => this.onServiceAccountSignin(_)),
      tap(_ => {
        // when the cached data is available we don't need the 'Observable' reference anymore
        this.observable = null;

        this.initializing = false;
      }),
      share()
    );
  }

  private onServiceAccountSignin(accessToken: GoogleAccessToken) {
    return this.getFolderId(environment.rootFolder, null, accessToken).pipe(
      switchMap((x: { files: { id: string }[] }) => {
        this.data.push({ name: environment.rootFolder, id: x.files[0].id });

        return this.getFolderId(environment.assetFolder, x.files[0].id, accessToken).pipe(
          map((y: { files: { id: string }[] }) => {
            this.data.push({ name: environment.assetFolder, id: y.files[0].id });
          })
        );
      })
    );
  }

  private getFolderId(name: string, parentId: string, accessToken: GoogleAccessToken) {
    const searchParams: string[] = [];
    searchParams.push(`name='${name}'`);
    searchParams.push('mimeType = \'application/vnd.google-apps.folder\'');
    searchParams.push(`trashed=false`);

    if (String.hasData(parentId)) {
      searchParams.push(`'${parentId}' in parents`);
    }

    const queryParams = {
      q: searchParams.join(' and '),
      fields: 'files(id)'
    };

    const httpParams = new HttpParams({ fromObject: queryParams });
    const url = 'https://www.googleapis.com/drive/v3/files';

    const options = {
      params: httpParams,
      headers: { 'Authorization': `${accessToken.token_type} ${accessToken.access_token}` }
    };

    return this.http.get(url, options);
  }
}
