import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Result } from '@app/core/result';
import { GoogleAccessToken } from '@app/gapi/google-access-token';
import { TokenVerifyCommand } from '@app/gapi/token-verify-command.service';
import { AuthTokenService } from '@app/security/auth-token.service';
import { environment } from '@env/environment';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  templateUrl: './sign-in.component.html'
})
export class SignInComponent implements OnInit {
  @HostBinding('style.display') sd = 'flex';
  @HostBinding('style.flex') sf = '1 1 auto';

  private oauthFragment: string;
  private oauthToken: GoogleAccessToken;
  errors: any;

  constructor(
    private authTokenService: AuthTokenService,
    private route: ActivatedRoute,
    private router: Router,
    private tokenVerifyCommand: TokenVerifyCommand,
  ) { }

  ngOnInit() {
    if (this.isAuthenticated()) {
      window.history.back();
      return;
    }

    this.route.fragment.subscribe(value => this.onFragment(value));
  }

  private onFragment(fragment: string) {
    this.oauthFragment = fragment;

    if (this.notGoneToGoogleYet()) {
      this.sendToGoogle();
      return;
    }

    this.oauthToken = GoogleAccessToken.convertFromFragment(this.oauthFragment);

    this.verifyToken();
  }

  private isAuthenticated() {
    return !String.isNullOrWhitespace(this.authTokenService.getAuthToken());
  }

  private notGoneToGoogleYet() {
    return String.isNullOrWhitespace(this.oauthFragment);
  }

  private sendToGoogle() {
    const client_id = `client_id=${environment.client_id}`;
    const redirect_uri = `redirect_uri=${encodeURI(window.location.href)}`;
    const response_type = 'response_type=token';
    const include_granted_scopes = 'include_granted_scopes=true';
    const scope = `scope=${encodeURI(environment.scope)}`;
    const login_hint = `login_hint=${encodeURIComponent(environment.login_hint)}`;

    // tslint:disable-next-line:max-line-length
    window.location.replace(`${environment.endPoint}?${client_id}&${redirect_uri}&${response_type}&${scope}&${login_hint}&${include_granted_scopes}`);
  }

  private verifyToken() {
    this.tokenVerifyCommand.execute(this.oauthToken).pipe(
      catchError(_ => this.onError(_))
    ).subscribe((_: TokenVerifyCommand.Result) => this.onTokenVerify(_));
  }

  private onTokenVerify(tokenVerifyResult: TokenVerifyCommand.Result) {
    if (tokenVerifyResult.aud !== environment.client_id) {
      const result = new Result();
      result.addError('Something went wrong with the sign-in. Please try later.');
      this.errors = result.errors;
      return;
    }

    const exp = Date.now() + this.oauthToken.expires_in * 1000;
    this.authTokenService.setAuthToken(`${this.oauthToken.token_type} ${this.oauthToken.access_token}`, exp);

    this.router.navigateByUrl('/admin/dashboard', { replaceUrl: true });
  }

  private onError(result: Result) {
    this.errors = result.errors;
    return EMPTY;
  }
}
