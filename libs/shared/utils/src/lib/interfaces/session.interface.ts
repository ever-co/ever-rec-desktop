import { IBase } from "./base.interface";
import { ITimeLog } from "./time-log.interface";
import { IUser } from "./user.interface";

export interface ISession extends IBase {
  user: IUser;
  timeLogs: ITimeLog[];
  loginAt?: string;
  logoutAt?: string;
}
