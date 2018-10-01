import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomainHelper } from '@app/core/domain/domain-helper';
import { map } from 'rxjs/operators';
import { GapiModule } from './gapi.module';

@Injectable({
  providedIn: GapiModule
})
export class DriveFileCommand {
  constructor(
    private http: HttpClient,
  ) { }

  execute(fileId: string, fileContent: any) {
    const url = `https://www.googleapis.com/upload/drive/v3/files/${fileId}`;

    const httpParams = new HttpParams()
      .append('uploadType', 'media')
      .append('fields', 'modifiedTime,version');

    return this.http.patch(url, fileContent, { params: httpParams }).pipe(
      map(x => DomainHelper.adapt(DriveFileCommand.Result, x))
    );
  }
}

export namespace DriveFileCommand {
  export class Result {
    @Reflect.metadata('design:type', Date)
    modifiedTime: Date = null;
    version = 0;
  }
}
