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
  deleteAll(): Observable<void>;
}

export abstract class IndexedDBService<T extends IEntity>
  implements IRepository<T>
{
  private readonly dbName: string;
  private readonly storeName: string;
  private readonly version: number;
  private readonly keyPath: string;
  private readonly autoIncrement: boolean;
  private readonly isSerialize: boolean;

  protected constructor(
    storeName: string,
    options: {
      keyPath?: string;
      dbName?: string;
      version?: number;
      autoIncrement?: boolean;
      serialize?: boolean;
    } = {}
  ) {
    this.dbName = options.dbName ?? 'ever.rec.db';
    this.storeName = storeName;
    this.version = options.version ?? 1;
    this.keyPath = options.keyPath ?? 'id';
    this.autoIncrement = options.autoIncrement ?? true;
    this.isSerialize = options.serialize ?? true;
  }

  /**
   * Serialize data before storing in IndexedDB
   * Override this method for custom serialization logic
   */
  protected serialize(item: Omit<T, 'id'> | T): any {
    // Default implementation does a deep clone
    return this.isSerialize ? JSON.parse(JSON.stringify(item)) : item;
  }

  /**
   * Deserialize data after retrieving from IndexedDB
   * Override this method for custom deserialization logic
   */
  protected deserialize(data: any): T {
    // Default implementation parses JSON if it's a string
    if (typeof data === 'string' && this.isSerialize) {
      return JSON.parse(data);
    }
    // Otherwise return as-is (or you could do a deep clone here)
    return data;
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
    const serializedItem = this.serialize(item);
    return this.withTransaction(
      'readwrite',
      (store) => store.add(serializedItem) as IDBRequest<number>
    ).pipe(switchMap((id) => this.getById(id) as Observable<T>));
  }

  public getAll(): Observable<T[]> {
    return this.withTransaction<T[]>(
      'readonly',
      (store) => store.getAll() as IDBRequest<T[]>
    ).pipe(map((items) => items.map((item) => this.deserialize(item))));
  }

  public getById(id: number): Observable<T | undefined> {
    return this.withTransaction<T | undefined>(
      'readonly',
      (store) => store.get(id) as IDBRequest<T | undefined>
    ).pipe(map((item) => (item ? this.deserialize(item) : undefined)));
  }

  public update(item: T): Observable<void> {
    const id = item[this.keyPath];
    if (id === undefined || id === null) {
      return throwError(() => new Error('Cannot update item without valid id'));
    }

    const serializedItem = this.serialize(item);
    return this.withTransaction<any>('readwrite', (store) =>
      store.put(serializedItem)
    );
  }

  public delete(id: number): Observable<void> {
    return this.withTransaction<any>('readwrite', (store) => store.delete(id));
  }

  public query(predicate: (item: T) => boolean): Observable<T[]> {
    return this.getAll().pipe(map((items) => items.filter(predicate)));
  }

  public deleteAll(): Observable<void> {
    return this.withTransaction<any>('readwrite', (store) => store.clear());
  }
}
