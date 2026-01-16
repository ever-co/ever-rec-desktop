import { EntitySubscriberInterface, EventSubscriber, InsertEvent } from "typeorm";
import { Session } from "../entities/session.entity";

@EventSubscriber()
export class SessionSubscriber implements EntitySubscriberInterface<Session> {
  listenTo() {
    return Session;
  }

  async beforeInsert(event: InsertEvent<Session>): Promise<void> {
    const repo = event.manager.getRepository(Session);

    // close all active sessions
    await repo
      .createQueryBuilder()
      .update(Session)
      .set({ logoutAt: new Date().toISOString() })
      .where("logoutAt IS NULL")
      .execute();

    if (!event.entity.loginAt) {
      event.entity.loginAt = new Date().toISOString();
    }
  }
}
