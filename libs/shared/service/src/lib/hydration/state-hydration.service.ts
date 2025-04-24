import { Injectable } from '@angular/core';
import { filter, switchMap } from 'rxjs';
import { IEntity, IndexedDBService } from '../local-storage/indexed-db.service';

export interface AppStateSchema extends IEntity {
  type: string;
  state: any;
}

@Injectable({
  providedIn: 'root',
})
export class StateHydrationService extends IndexedDBService<AppStateSchema> {
  constructor() {
    super('_app_state', { keyPath: 'type' });
  }

  public hydrate(state: AppStateSchema) {
    const persistance: AppStateSchema = {
      state,
      type: 'persistance',
    };
    return this.query((schema) => schema.type === persistance.type).pipe(
      switchMap((schemas) => {
        if (schemas.length) {
          return this.update(persistance);
        }
        return this.add(persistance);
      })
    );
  }

  public reHydrate() {
    return this.getById('persistance').pipe(filter(Boolean));
  }
}
