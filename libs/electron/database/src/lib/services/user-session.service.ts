import { IUser } from "@ever-co/shared-utils";
import { SessionService } from "./session.service";
import { UserService } from "./user.service";

export class UserSessionService {
  private readonly sessionService = new SessionService();
  private readonly userService = new UserService();

  public async login(input: IUser) {
    const { id } = await this.userService.findOrCreate(input);
    await this.userService.markAsLogin(id);
    return this.sessionService.create(id);
  }

  public async logout() {
    const { id } = await this.sessionService.getActiveSession();
    return this.sessionService.close(id);
  }

  public async currentUser(): Promise<IUser> {
    const currentSession = await this.sessionService.getActiveSession();
    return currentSession.user;
  }
}
