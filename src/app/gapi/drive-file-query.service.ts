import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GapiModule } from './gapi.module';
import { ServiceAccountSigninCommand } from './service-account-signin-command.service';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: GapiModule
})
export class DriveFileQuery {
  constructor(
    private http: HttpClient,
    private serviceAccountSigninCommand: ServiceAccountSigninCommand
  ) { }

  execute(fileId: string) {
    return this.serviceAccountSigninCommand.execute().pipe(
      switchMap(googleAccessToken => {
        const options = {
          headers: { 'Authorization': `${googleAccessToken.token_type} ${googleAccessToken.access_token}` }
        };

        const baseUrl = 'https://www.googleapis.com/drive/v3/files';

        return this.http.get(`${baseUrl}/${fileId}?alt=media`, options);
      })
    );
  }
}
