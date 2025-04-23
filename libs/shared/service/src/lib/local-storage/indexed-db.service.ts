import { Observable, from, throwError, EMPTY } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

export interface IEntity {
  id?: number;
  [key: string]: any;
}

export interface IRepository<T extends IEntity> {
  add(item: Omit<T, 'id'>): Observable<T>;
  getAll(): Observable<T[]>;
  getById(id: number): Observable<T | undefined>;
  query(predicate: (item: T) => boolean): Observable<T[]>;
  update(item: T): Observable<void>;
  delete(id: number): Observable<void>;
}

export abstract class IndexedDBService<T extends IEntity>
  implements IRepository<T>
{
  private readonly dbName: string;
  private readonly storeName: string;
  private readonly version: number;
  private readonly keyPath: string;
  private readonly autoIncrement: boolean;

  protected constructor(
    storeName: string,
    options: {
      keyPath?: string;
      dbName?: string;
      version?: number;
      autoIncrement?: boolean;
    } = {}
  ) {
    this.dbName = options.dbName ?? 'ever.rec.db';
    this.storeName = storeName;
    this.version = options.version ?? 1;
    this.keyPath = options.keyPath ?? 'id';
    this.autoIncrement = options.autoIncrement ?? true;
  }

  private async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, {
            keyPath: this.keyPath,
            autoIncrement: this.autoIncrement,
          });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  private withTransaction<R>(
    mode: IDBTransactionMode,
    operation: (store: IDBObjectStore) => IDBRequest<R>
  ): Observable<R> {
    return from(
      this.openDB().then(
        (db) =>
          new Promise<R>((resolve, reject) => {
            const transaction = db.transaction(this.storeName, mode);
            const store = transaction.objectStore(this.storeName);

            const request = operation(store);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);

            transaction.oncomplete = () => db.close();
            transaction.onerror = () => {
              reject(transaction.error);
              db.close();
            };
          })
      )
    ).pipe(
      catchError((_) => {
        // Soft Catch
        return EMPTY;
      })
    );
  }

  public add(item: Omit<T, 'id'>): Observable<T> {
    return this.withTransaction<number>(
      'readwrite',
      (store) => store.add(item) as IDBRequest<number>
    ).pipe(switchMap((id) => this.getById(id) as Observable<T>));
  }

  public getAll(): Observable<T[]> {
    return this.withTransaction(
      'readonly',
      (store) => store.getAll() as IDBRequest<T[]>
    );
  }

  public getById(id: number): Observable<T | undefined> {
    return this.withTransaction(
      'readonly',
      (store) => store.get(id) as IDBRequest<T | undefined>
    );
  }

  public update(item: T): Observable<void> {
    const id = item[this.keyPath];
    if (id === undefined || id === null) {
      return throwError(() => new Error('Cannot update item without valid id'));
    }
    return this.withTransaction<any>('readwrite', (store) => store.put(item));
  }

  public delete(id: number): Observable<void> {
    return this.withTransaction('readwrite', (store) => store.delete(id));
  }

  /**
   * Query items based on a predicate function
   */
  public query(predicate: (item: T) => boolean): Observable<T[]> {
    return this.getAll().pipe(map((items) => items.filter(predicate)));
  }
}
