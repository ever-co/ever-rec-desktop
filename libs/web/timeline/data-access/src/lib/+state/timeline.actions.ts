import { ITimelineItem } from '@ever-co/shared-utils';
import { createActionGroup, props } from '@ngrx/store';

export const TimelineActions = createActionGroup({
  source: 'Timeline',
  events: {
    'Timeline Add Item': props<{ item: ITimelineItem }>(),
    'Timeline Remove Item': props<{ item: ITimelineItem }>(),
    'Timeline Update Item': props<{ item: ITimelineItem }>(),

    'Timeline Reorder Items': props<{ items: ITimelineItem[] }>(),

    'Timeline Move Cursor': props<{ position: number }>(),
    'Timeline Move Cursor To Item': props<{ item: ITimelineItem }>(),
  },
});
