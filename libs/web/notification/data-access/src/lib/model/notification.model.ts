import { INotification, NotificationDTO } from '@ever-co/shared-utils';

export class Notification implements INotification {
  private _id: string;
  private _message: string;
  private _type: 'success' | 'error' | 'info' | 'warning';
  private _timestamp: Date;
  private _read: boolean;

  constructor(
    message: string,
    type: 'success' | 'error' | 'info' | 'warning',
    timestamp: Date,
    read: boolean
  ) {
    this._id = crypto.randomUUID();
    this._message = message;
    this._type = type;
    this._timestamp = timestamp;
    this._read = read;
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get message(): string {
    return this._message;
  }

  set message(value: string) {
    this._message = value;
  }

  get type(): 'success' | 'error' | 'info' | 'warning' {
    return this._type;
  }

  set type(value: 'success' | 'error' | 'info' | 'warning') {
    this._type = value;
  }

  get timestamp(): Date {
    return this._timestamp;
  }

  set timestamp(value: Date) {
    this._timestamp = value;
  }

  get read(): boolean {
    return this._read;
  }

  set read(value: boolean) {
    this._read = value;
  }

  public toDTO(): NotificationDTO {
    return {
      id: this.id,
      message: this.message,
      type: this.type,
      timestamp: this.timestamp,
      read: this.read,
    };
  }
}
