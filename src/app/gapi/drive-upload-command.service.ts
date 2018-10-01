import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomainHelper } from '@app/core/domain/domain-helper';
import { DriveFilesQuery } from '@app/gapi/drive-files-query.service';
import { environment } from '@env/environment';
import { map, switchMap } from 'rxjs/operators';
import { GapiModule } from './gapi.module';
import { DriveFolderQuery } from '@app/gapi/drive-folder-query.service';

@Injectable({
  providedIn: GapiModule
})
export class DriveUploadCommand {
  constructor(
    private http: HttpClient,
    private driveFilesQuery: DriveFilesQuery,
    private driveFolderQuery: DriveFolderQuery,
  ) { }

  execute(file: File) {
    return this.driveFolderQuery.execute(environment.rootFolder).pipe(
      switchMap(folderId => this.onRootFolder(folderId, file))
    );
  }

  private onRootFolder(rootFolderId: string, file: File) {
    return this.driveFolderQuery.execute(environment.assetFolder).pipe(
      switchMap(folderId => this.onAssetFolder(folderId, file))
    );
  }

  private onAssetFolder(assetFolderId: string, file: File) {
    const extensionIndex = file.name.lastIndexOf('.');

    const driveFileResource = {
      name: file.name.slice(0, extensionIndex),
      mimeType: file.type,
      parents: [assetFolderId]
    };

    driveFileResource.parents = [assetFolderId];

    return this.http.post('https://www.googleapis.com/drive/v3/files', driveFileResource).pipe(
      switchMap((_: any) => this.onFile(_, file))
    );
  }

  private onFile(_: any, file: File) {
    const httpParams = new HttpParams()
      .append('uploadType', 'media')
      .append('fields', 'id,webContentLink,name');

    return this.http.patch(`https://www.googleapis.com/upload/drive/v3/files/${_.id}`, file, { params: httpParams }).pipe(
      map(x => DomainHelper.adapt(DriveUploadCommand.Result, x))
    );
  }
}
export namespace DriveUploadCommand {
  export class Result {
    id = '';
    webContentLink = '';
    name = '';
  }
}
