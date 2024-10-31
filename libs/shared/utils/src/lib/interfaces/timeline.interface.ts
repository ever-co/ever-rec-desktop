import { IScreenshot } from './screenshot.interface';
import { IVideo } from './video.interface';

export type ITimelineItem = IScreenshot | IVideo;

export interface ICursor {
  position: number;
  scroll: number;
  width: number;
  height: number;
}

export interface ITimeline {
  items: ITimelineItem[];
  selectedItem: ITimelineItem | null;
  isPlaying: boolean;
  cursor: ICursor;
  loading: boolean;
  error: string | null;
}

export interface ITimelinePort {
  getItems(): Promise<ITimelineItem[]>;
  addItem(item: ITimelineItem): Promise<ITimelineItem>;
  removeItem(item: ITimelineItem): Promise<void>;
  updateItem(item: ITimelineItem): Promise<ITimelineItem>;
}
