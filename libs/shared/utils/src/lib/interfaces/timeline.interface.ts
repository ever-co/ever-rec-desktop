import { Observable } from 'rxjs';
import { IScreenshot } from './screenshot.interface';

// Core interfaces
export interface ITimelineItem extends IScreenshot {
  width: number;
  position: number;
  duration?: number; // Duration in milliseconds
  isKeyframe?: boolean; // Indicates if this is a key moment
}

// Cursor interface
export interface ICursor {
  position: number;
  width: number;
  height: number;
  visible: boolean; // Control cursor visibility
  style?: CursorStyle; // Custom styling
}

// Timeline interface
export interface ITimeline {
  items: ITimelineItem[];
  selectedItem: ITimelineItem | null;
  isPlaying: boolean;
  cursor: ICursor;
  totalDuration: number; // Total timeline duration in milliseconds
  currentTime: number; // Current playback time
  zoom: number; // Current zoom level
  allowScrubbing: boolean; // Enable/disable timeline scrubbing
}

// Enum for cursor styles
export enum CursorStyle {
  DEFAULT = 'default',
  PLAYHEAD = 'playhead',
  CUSTOM = 'custom',
}

// Read operations interface
export interface ITimelineReader {
  getItems(): Observable<ITimelineItem[]>;
  getCurrentTime(): Observable<number>;
  getSelectedItem(): Observable<ITimelineItem | null>;
}

// Write operations interface
export interface ITimelineWriter {
  jumpToPosition(position: number, width: number): void;
  updatePosition(percentage: number): void;
}

// Playback controls interface
export interface ITimelinePlayback {
  play(): void;
  pause(): void;
  stop(): void;
}

// Zoom control interface
export interface ITimelineZoom {
  setZoom(level: number): void;
}

// Event handlers interface
export interface ITimelineEventHandlers {
  onTimelineClick?(position: number): void;
  onItemSelect?(item: ITimelineItem): void;
  onZoomChange?(level: number): void;
}

// Configuration interface
export interface ITimelineConfig {
  minZoom: number;
  maxZoom: number;
  defaultDuration: number;
  autoPlay: boolean;
  loop: boolean;
  showThumbnails: boolean;
  cursorStyle: CursorStyle;
}

// Combined interface for a complete timeline functionality
export interface ITimelinePort
  extends ITimelineReader,
    ITimelineWriter,
    ITimelinePlayback,
    ITimelineZoom,
    ITimelineEventHandlers {
  timeline: ITimeline;
}
