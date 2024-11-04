// src/main/keytarService.ts
import { app } from 'electron';
import * as keytar from 'keytar';

const SERVICE_NAME = app.getName();

export class KeytarService {
  public static async setPassword(
    account: string,
    password: string
  ): Promise<void> {
    await keytar.setPassword(SERVICE_NAME, account, password);
  }

  public static async getPassword(account: string): Promise<string | null> {
    return await keytar.getPassword(SERVICE_NAME, account);
  }

  public static async deletePassword(account: string): Promise<void> {
    await keytar.deletePassword(SERVICE_NAME, account);
  }
}
