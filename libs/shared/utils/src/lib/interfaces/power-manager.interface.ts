/**
 * IPowerEventHandler: Interface for handling power events.
 */
export interface IPowerEventHandler {
  handleEvent(eventType: IEventType): void;
}

export type IEventType =
  | 'suspend'
  | 'resume'
  | 'on-ac'
  | 'on-battery'
  | 'lock-screen'
  | 'unlock-screen';
