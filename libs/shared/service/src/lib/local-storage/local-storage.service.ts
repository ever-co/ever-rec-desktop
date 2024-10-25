import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

export interface StorageItem<T> {
  value: T;
  timestamp: number;
  expiry?: number; // Optional expiry time in milliseconds
}

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private readonly prefix = 'app_'; // Namespace for your application

  /**
   * Checks if localStorage is available and working
   */
  private isLocalStorageAvailable(): boolean {
    try {
      const testKey = `${this.prefix}__test__`;
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validates the key string
   */
  private validateKey(key: string): string {
    if (!key || typeof key !== 'string') {
      throw new Error('Invalid storage key');
    }
    return `${this.prefix}${key}`;
  }

  /**
   * Wraps localStorage operations in an observable with proper error handling
   */
  private handleLocalStorageOperation<T>(
    operation: () => T,
    errorMessage: string
  ): Observable<T> {
    if (!this.isLocalStorageAvailable()) {
      return throwError(() => new Error('localStorage is not available'));
    }

    try {
      const result = operation();
      return of(result);
    } catch (error) {
      const errorDetails =
        error instanceof Error ? error.message : String(error);
      return throwError(() => new Error(`${errorMessage}: ${errorDetails}`));
    }
  }

  /**
   * Sets an item in localStorage with optional expiry
   */
  public setItem<T>(
    key: string,
    value: T,
    options: { expiry?: number; merge?: boolean } = {}
  ): Observable<void> {
    return this.handleLocalStorageOperation(() => {
      const storageKey = this.validateKey(key);
      const storageItem: StorageItem<T> = {
        value,
        timestamp: Date.now(),
        expiry: options.expiry,
      };

      if (options.merge && typeof value === 'object') {
        const existingItem = this.getItemSync<T>(key);
        if (existingItem) {
          storageItem.value = {
            ...existingItem,
            ...value,
          } as T;
        }
      }

      localStorage.setItem(storageKey, JSON.stringify(storageItem));
    }, 'Failed to set item in localStorage');
  }

  /**
   * Gets an item from localStorage with expiry check
   */
  public getItem<T>(key: string): Observable<T | null> {
    return this.handleLocalStorageOperation(() => {
      const item = this.getItemSync<T>(key);
      return item;
    }, 'Failed to get item from localStorage');
  }

  /**
   * Synchronous version of getItem (for internal use)
   */
  private getItemSync<T>(key: string): T | null {
    const storageKey = this.validateKey(key);
    const data = localStorage.getItem(storageKey);

    if (!data) return null;

    try {
      const item: StorageItem<T> = JSON.parse(data);

      // Check if item has expired
      if (item.expiry && Date.now() - item.timestamp > item.expiry) {
        localStorage.removeItem(storageKey);
        return null;
      }

      return item.value;
    } catch {
      return null;
    }
  }

  /**
   * Removes an item from localStorage
   */
  public removeItem(key: string): Observable<void> {
    return this.handleLocalStorageOperation(() => {
      const storageKey = this.validateKey(key);
      localStorage.removeItem(storageKey);
    }, 'Failed to remove item from localStorage');
  }

  /**
   * Clears all items set by this service
   */
  public clear(): Observable<void> {
    return this.handleLocalStorageOperation(() => {
      Object.keys(localStorage)
        .filter((key) => key.startsWith(this.prefix))
        .forEach((key) => localStorage.removeItem(key));
    }, 'Failed to clear localStorage');
  }

  /**
   * Gets all keys stored by this service
   */
  public getAllKeys(): Observable<string[]> {
    return this.handleLocalStorageOperation(() => {
      return Object.keys(localStorage)
        .filter((key) => key.startsWith(this.prefix))
        .map((key) => key.slice(this.prefix.length));
    }, 'Failed to get localStorage keys');
  }

  /**
   * Checks if a key exists and has not expired
   */
  public hasItem(key: string): Observable<boolean> {
    return this.getItem(key).pipe(map((value) => value !== null));
  }

  /**
   * Gets the remaining time before expiry for a key (in milliseconds)
   */
  public getTimeToExpiry(key: string): Observable<number | null> {
    return this.handleLocalStorageOperation(() => {
      const storageKey = this.validateKey(key);
      const data = localStorage.getItem(storageKey);

      if (!data) return null;

      try {
        const item: StorageItem<unknown> = JSON.parse(data);
        if (!item.expiry) return null;

        const timeToExpiry = item.expiry - (Date.now() - item.timestamp);
        return timeToExpiry > 0 ? timeToExpiry : null;
      } catch {
        return null;
      }
    }, 'Failed to get expiry time');
  }
}
