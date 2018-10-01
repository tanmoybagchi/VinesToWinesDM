import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable, of } from 'rxjs';
import { share, tap } from 'rxjs/operators';
import { GapiModule } from './gapi.module';
import { GoogleAccessToken } from './google-access-token';

@Injectable({
  providedIn: GapiModule
})
export class ServiceAccountSigninCommand {
  private data: GoogleAccessToken;
  private observable: Observable<GoogleAccessToken>;
  private initializing = false;

  constructor(
    private http: HttpClient,
  ) {
    this.initialize();
  }

  execute(): Observable<GoogleAccessToken> {
    return this.data
      ? of(this.data) // if 'data' is available just return it as 'Observable'
      : this.observable; // if 'this.observable' is set then the request is in progress, return the 'Observable' for the ongoing request
  }

  initialize() {
    if (this.initializing) {
      return;
    }

    this.initializing = true;

    this.data = null;

    const googleAuthInput = new HttpParams()
      .set('grant_type', 'urn:ietf:params:oauth:grant-type:jwt-bearer')
      .set('assertion', this.createJWS());

    this.observable = this.http.post<GoogleAccessToken>('https://www.googleapis.com/oauth2/v4/token', googleAuthInput).pipe(
      tap((response: GoogleAccessToken) => {
        this.data = response;

        // when the cached data is available we don't need the 'Observable' reference anymore
        this.observable = null;

        this.initializing = false;

        setTimeout(() => this.initialize(), (response.expires_in - 10) * 1000);
      }),
      share()
    );
  }

  private createJWS() {
    const jwtHeader = { 'alg': 'RS256', 'typ': 'JWT' };

    const jwtClaimSet = {
      aud: 'https://www.googleapis.com/oauth2/v4/token',
      scope: environment.gserviceaccountscope,
      iss: environment.gserviceaccount,
      exp: window['KJUR'].jws.IntDate.get('now + 1hour'),
      iat: window['KJUR'].jws.IntDate.get('now')
    };

    return window['KJUR'].jws.JWS.sign(null, jwtHeader, jwtClaimSet, environment.gserviceaccountkey);
  }
}
