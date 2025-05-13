import {
  IFindOneOptions,
  IPaginationOptions,
  IPaginationResponse,
  IPaginationScreenshotStatisticsResponse,
  IScreenCaptureConfig,
  IScreenshot,
  IScreenshotChartLine,
  ISelected,
  IUploadDone,
  IVideo,
} from '@ever-co/shared-utils';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const screenshotActions = createActionGroup({
  source: 'Screenshot',
  events: {
    'Start Capture': props<IScreenCaptureConfig>(),
    'Start Capture Success': emptyProps(),

    'Stop Capture': emptyProps(),
    'Stop Capture Success': emptyProps(),

    'Capture Success': props<{ screenshot: IScreenshot }>(),
    'Capture Failure': props<{ error: string }>(),
    'Load Screenshots': props<IPaginationOptions<IScreenshot>>(),
    'Load Screenshots Success': props<IPaginationResponse<IScreenshot>>(),
    'Load Screenshots Failure': props<{ error: string }>(),

    'Load Screenshot': props<{ options: IFindOneOptions<IScreenshot> }>(),
    'Load Screenshot Success': props<{ screenshot: IScreenshot }>(),
    'Load Screenshot Failure': props<{ error: string }>(),

    'Delete Screenshot': props<IScreenshot>(),
    'Delete Screenshot Success': props<{ id: string }>(),
    'Delete Screenshot Failure': props<{ error: string }>(),

    'Delete Selected Screenshots': props<{ screenshots?: IScreenshot[] }>(),
    'Delete Selected Screenshots Success': props<{
      screenshots: IScreenshot[];
    }>(),
    'Delete Selected Screenshots Failure': props<{ error: string }>(),

    'Delete Screenshots': emptyProps(),
    'Delete Screenshots Success': emptyProps(),
    'Delete Screenshots Failure': props<{ error: string }>(),
    'Reset Screenshots': emptyProps(),

    'Get Screenshots Statistics': props<IPaginationOptions<IScreenshot>>(),
    'Get Screenshots Statistics Success':
      props<IPaginationScreenshotStatisticsResponse>(),
    'Get Screenshots Statistics Failure': props<{ error: string }>(),
    'Reset Screenshots Statistics': emptyProps(),

    ask: props<IPaginationOptions<IScreenshot>>(),
    'ask Success': props<IPaginationResponse<IScreenshot>>(),
    'ask Failure': props<{ error: string }>(),
    'Reset Ask': emptyProps(),

    'Unselect All Screenshots': emptyProps(),
    'Unselect Screenshot': props<{ screenshot: ISelected<IScreenshot> }>(),
    'Select Screenshot': props<{ screenshot: ISelected<IScreenshot> }>(),

    'Overlay Clicked': props<{ isOpen: boolean }>(),

    'Load History': emptyProps(),
    'Load History Success': props<{ history: string[] }>(),
    'Load History Failure': props<{ error: string }>(),

    'Add To History': props<{ searchQuery: string }>(),
    'Remove From History': props<{ searchQuery: string }>(),
    'Filter History': props<{ searchQuery: string }>(),

    'Get Screenshots Chart Line': emptyProps(),
    'Get Screenshots Chart Line Success': props<{
      dataLine: IScreenshotChartLine[];
    }>(),
    'Get Screenshots Chart Line Failure': props<{ error: string }>(),
    'Auto Deletion': props<{ video: IVideo }>(),

    Purge: emptyProps(),
    'Purge Success': emptyProps(),
    'Purge Failure': props<{ error: string }>(),

    'Update Uploaded Screenshot': props<{ upload: IUploadDone }>(),
  },
});
