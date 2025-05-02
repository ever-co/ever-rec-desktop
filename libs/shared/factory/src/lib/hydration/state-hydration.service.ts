import { Injectable } from '@angular/core';
import { IEntity, IndexedDBService } from '@ever-co/shared-service';
import { filter, switchMap } from 'rxjs';


export interface AppStateSchema<T = any> extends IEntity {
  type: string;
  state: T;
}

@Injectable({
  providedIn: 'root',
})
export class StateHydrationService extends IndexedDBService<AppStateSchema> {
  constructor() {
    super('_app_state', { keyPath: 'type' });
  }

  public hydrate<T>(state: T) {
    const persistance: AppStateSchema<T> = {
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
