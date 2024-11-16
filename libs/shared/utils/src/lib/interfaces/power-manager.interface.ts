/**
 * IPowerEventHandler: Interface for handling power events.
 */
export interface IPowerEventHandler {
  handleEvent(eventType: string): void;
}
