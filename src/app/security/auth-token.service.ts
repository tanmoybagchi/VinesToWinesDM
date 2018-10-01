import { Injectable } from '@angular/core';
import { SessionStorageService } from '@app/core/storage/session-storage.service';
import { SecurityModule } from './security.module';

@Injectable({ providedIn: SecurityModule })
export class AuthTokenService {
  private key = 'AuthToken';

  constructor(private sessionStorageService: SessionStorageService) { }

  setAuthToken(token: string, expiresOn?: number): void {
    this.sessionStorageService.set(this.key, token, expiresOn);
  }

  getAuthToken(): string {
    return this.sessionStorageService.get(this.key);
  }

  removeAuthToken() {
    this.sessionStorageService.remove(this.key);
  }
}
