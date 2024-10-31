import { IScreenshot } from './screenshot.interface';
import { IVideo } from './video.interface';

export type ITimelineItem = IScreenshot | IVideo;

export interface ITimeline {
  items: ITimelineItem[];
  selectedItem: ITimelineItem | null;
  isPlaying: boolean;
}

export interface ITimelinePort {
  getItems(): Promise<ITimelineItem[]>;
  addItem(item: ITimelineItem): Promise<ITimelineItem>;
  removeItem(item: ITimelineItem): Promise<void>;
  updateItem(item: ITimelineItem): Promise<ITimelineItem>;
}
