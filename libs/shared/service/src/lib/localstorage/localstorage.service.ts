import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LocalstorageService {
  private isLocalStorageAvailable(): boolean {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  public setItem<T>(key: string, value: T): Observable<void> {
    return new Observable<void>((observer) => {
      if (this.isLocalStorageAvailable()) {
        try {
          localStorage.setItem(key, JSON.stringify(value));
          observer.next();
          observer.complete();
        } catch (error) {
          observer.error(`Failed to set item in localStorage: ${error}`);
        }
      } else {
        observer.error('localStorage is not available');
      }
    }).pipe(
      catchError((error) => {
        console.error(error);
        return throwError(() => new Error(error));
      })
    );
  }

  public getItem<T>(key: string): Observable<T | null> {
    return new Observable<T | null>((observer) => {
      if (this.isLocalStorageAvailable()) {
        try {
          const value = localStorage.getItem(key);
          const parsedValue = value ? (JSON.parse(value) as T) : null;
          observer.next(parsedValue);
          observer.complete();
        } catch (error) {
          observer.error(`Failed to get item from localStorage: ${error}`);
        }
      } else {
        observer.error('localStorage is not available');
      }
    }).pipe(
      catchError((error) => {
        console.error(error);
        return throwError(() => new Error(error));
      })
    );
  }

  public removeItem(key: string): Observable<void> {
    return new Observable<void>((observer) => {
      if (this.isLocalStorageAvailable()) {
        try {
          localStorage.removeItem(key);
          observer.next();
          observer.complete();
        } catch (error) {
          observer.error(`Failed to remove item from localStorage: ${error}`);
        }
      } else {
        observer.error('localStorage is not available');
      }
    }).pipe(
      catchError((error) => {
        console.error(error);
        return throwError(() => new Error(error));
      })
    );
  }

  public clear(): Observable<void> {
    return new Observable<void>((observer) => {
      if (this.isLocalStorageAvailable()) {
        try {
          localStorage.clear();
          observer.next();
          observer.complete();
        } catch (error) {
          observer.error(`Failed to clear localStorage: ${error}`);
        }
      } else {
        observer.error('localStorage is not available');
      }
    }).pipe(
      catchError((error) => {
        console.error(error);
        return throwError(() => new Error(error));
      })
    );
  }
}
