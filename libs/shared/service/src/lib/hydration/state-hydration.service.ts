import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs';
import { IEntity, IndexedDBService } from '../local-storage/indexed-db.service';

export interface AppStateSchema extends IEntity {
  type: string;
}

@Injectable({
  providedIn: 'root',
})
export class StateHydrationService extends IndexedDBService<AppStateSchema> {
  constructor() {
    super('_app_state', { keyPath: 'type' });
  }

  public hydrate(state: AppStateSchema) {
    return this.query((schema) => schema.type === state.type).pipe(
      switchMap((schemas) => {
        if (schemas.length) {
          return this.update(state);
        }
        return this.add(state);
      })
    );
  }

  public reHydrate() {
    return this.getAll();
  }
}
