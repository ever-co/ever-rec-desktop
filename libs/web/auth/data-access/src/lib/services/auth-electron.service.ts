import { Injectable } from "@angular/core";
import { ElectronService } from "@ever-co/electron-data-access";
import { Channel, IUser } from "@ever-co/shared-utils";

@Injectable()
export class AuthElectronService {
  constructor(private readonly electronService: ElectronService) { }

  public login(user: IUser): void {
    this.electronService.send(Channel.LOGIN, user);
  }

  public logout(): void {
    this.electronService.send(Channel.LOGOUT);
  }
}
