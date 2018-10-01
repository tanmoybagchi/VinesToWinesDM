﻿import { Injectable } from '@angular/core';
import { StorageConfig } from './storage-config';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService extends StorageService {
  constructor(config: StorageConfig) {
    if (!config || !config.keyPrefix || config.keyPrefix.trim().length === 0) {
      throw new Error('Must configure.');
    }

    super(window.localStorage, config.keyPrefix);
  }
}
