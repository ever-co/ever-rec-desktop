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

    'Upload All From Queue': emptyProps(),
    'Upload Item Success': props<{ itemId: IUploadItem['id'] }>(),
    'Upload Item Failure': props<{
      itemId: IUploadItem['id'];
      error: string;
    }>(),

    'Remove Item From Queue': props<{ itemId: IUploadItem['id'] }>(),
    'Retry Upload Item': props<{ itemId: IUploadItem['id'] }>(),
    'Retry All Failed Uploads': emptyProps(),
    'Clear Upload On Complete': emptyProps(),

    'Cancel Upload': props<{ itemId: IUploadItem['id'] }>(),
    'Silent Upload Cancellation': emptyProps(),
    'Cancel Upload Success': emptyProps(),

    'No Operation': emptyProps(),

    'Clear Upload Queue': emptyProps(),
    'Clear Failed Uploads': emptyProps(),
    'Clear Canceled Uploads': emptyProps(),

    'Cancel All Uploads': emptyProps(),
  },
});
