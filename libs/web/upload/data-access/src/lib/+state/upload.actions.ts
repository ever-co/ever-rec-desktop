import { IUpload } from '@ever-co/shared-utils';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IUploadItem } from '../models/upload.model';

export const uploadActions = createActionGroup({
  source: 'Upload',
  events: {
    'Add Item To Queue': props<{ items?: IUploadItem[]; item?: IUploadItem }>(),

    'Start Item Upload': props<{ item: IUploadItem }>(),
    'Start Item Upload Success': props<{ config: IUpload }>(),

    'Upload Item In Progress': props<{
      itemId: IUploadItem['id'];
      progress: number;
    }>(),

    'Upload Item Success': props<{ itemId: IUploadItem['id'] }>(),
    'Upload Item Failure': props<{
      itemId: IUploadItem['id'];
      error: string;
    }>(),

    'Remove Item From Queue': props<{ itemId: IUploadItem['id'] }>(),
    'Retry Upload Item': props<{ itemId: IUploadItem['id'] }>(),
    'Clear Upload On Complete': emptyProps(),

    'Cancel Upload': props<{ itemId: IUploadItem['id'] }>(),
    'Silent Upload Cancellation': emptyProps(),
    'Cancel Upload Success': emptyProps(),

    'No Operation': emptyProps(),
  },
});
