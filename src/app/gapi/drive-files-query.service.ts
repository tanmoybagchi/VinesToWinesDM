import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GapiModule } from './gapi.module';
import { ServiceAccountSigninCommand } from './service-account-signin-command.service';
import { switchMap, map } from 'rxjs/operators';
import { DomainHelper } from '@app/core/domain/domain-helper';

@Injectable({
  providedIn: GapiModule
})
export class DriveFilesQuery {
  constructor(
    private http: HttpClient,
    private serviceAccountSigninCommand: ServiceAccountSigninCommand
  ) { }

  execute(name = '', parents: string[] = []) {
    const searchParams: string[] = [];

    if (!String.isNullOrWhitespace(name)) {
      searchParams.push(`name='${name}'`);
    }

    if (parents.length > 0) {
      searchParams.push(`'${parents.join(',')}' in parents`);
    }

    searchParams.push(`trashed=false`);

    const queryParams = {
      q: searchParams.join(' and '),
      fields: 'files(id,name,modifiedTime,version)'
    };

    const httpParams = new HttpParams({ fromObject: queryParams });
    const url = 'https://www.googleapis.com/drive/v3/files';

    return this.serviceAccountSigninCommand.execute().pipe(
      switchMap(googleAccessToken => {
        const options = {
          params: httpParams,
          headers: { 'Authorization': `${googleAccessToken.token_type} ${googleAccessToken.access_token}` }
        };

        return this.http.get(url, options).pipe(
          map((x: { files: any[] }) => x.files.map(f => DomainHelper.adapt(DriveFilesQuery.Result, f)))
        );
      })
    );
  }
}

export namespace DriveFilesQuery {
  export class Result {
    id = '';
    name = '';
    @Reflect.metadata('design:type', Date)
    modifiedTime: Date = null;
    version = 0;
  }
}
