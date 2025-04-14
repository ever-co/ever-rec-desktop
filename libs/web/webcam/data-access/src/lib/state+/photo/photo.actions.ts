import {
  IPaginationOptions,
  IPaginationResponse,
  IPhoto,
  IPhotoSave,
  ISelected,
  IFindOneOptions,
} from '@ever-co/shared-utils';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const photoActions = createActionGroup({
  source: 'Photo',
  events: {
    'Load Photos': props<IPaginationOptions<IPhoto>>(),
    'Load Photos Success': props<IPaginationResponse<IPhoto>>(),
    'Load Photos Failure': props<{ error: string }>(),

    'Load Photo': props<IFindOneOptions<IPhoto>>(),
    'Load Photo Success': props<{ photo: IPhoto }>(),
    'Load Photo Failure': props<{ error: string }>(),

    'Save Photo': props<IPhotoSave>(),
    'Save Photo Success': props<{ photo: IPhoto }>(),
    'Save Photo Failure': props<{ error: string }>(),

    'Delete Photo': props<IPhoto>(),
    'Delete Photo Success': props<{ id: string }>(),
    'Delete Photo Failure': props<{ error: string }>(),

    'Delete Selected Photos': props<{ photos: IPhoto[] }>(),
    'Delete Selected Photos Success': props<{
      photos: IPhoto[];
    }>(),
    'Delete Selected Photos Failure': props<{ error: string }>(),

    'Delete Photos': emptyProps(),
    'Delete Photos Success': emptyProps(),
    'Delete Photos Failure': props<{ error: string }>(),
    'Reset Photos': emptyProps(),

    'Unselect All Photos': emptyProps(),
    'Unselect Photo': props<{ photo: ISelected<IPhoto> }>(),
    'Select Photo': props<{ photo: ISelected<IPhoto> }>(),
  },
});
