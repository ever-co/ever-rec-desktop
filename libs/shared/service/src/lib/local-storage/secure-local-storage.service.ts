import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { EncryptionService } from '../encryption/encryption.service';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class SecureLocalStorageService {
  constructor(
    private localStorage: LocalStorageService,
    private encryption: EncryptionService
  ) {}

  /**
   * Sets an encrypted item in localStorage
   */
  public setItem<T>(
    key: string,
    value: T,
    options: { expiry?: number; merge?: boolean } = {}
  ): Observable<void> {
    return this.getItem<T>(key).pipe(
      switchMap((existingItem) => {
        if (options.merge && typeof value === 'object') {
          if (existingItem) {
            value = { ...existingItem, ...value } as T;
          }
        }
        return this.encryption.encrypt(value);
      }),
      switchMap((encryptedValue) => {
        return this.localStorage.setItem(key, encryptedValue, options);
      })
    );
  }

  /**
   * Gets and decrypts an item from localStorage
   */
  public getItem<T>(key: string): Observable<T | null> {
    return this.localStorage.getItem<string>(key).pipe(
      switchMap((encryptedValue) => {
        if (!encryptedValue) return from([null]);
        return this.encryption.decrypt(encryptedValue) as Observable<T>;
      })
    );
  }

  // Delegate other methods to the original LocalStorageService
  public removeItem(key: string): Observable<void> {
    return this.localStorage.removeItem(key);
  }

  public clear(): Observable<void> {
    return this.localStorage.clear();
  }

  public getAllKeys(): Observable<string[]> {
    return this.localStorage.getAllKeys();
  }

  public hasItem(key: string): Observable<boolean> {
    return this.localStorage.hasItem(key);
  }

  public getTimeToExpiry(key: string): Observable<number | null> {
    return this.localStorage.getTimeToExpiry(key);
  }
}
