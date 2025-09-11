import { ISession } from "@ever-co/shared-utils";
import { SessionRepository } from "../repositories/session.repository";

export class SessionService {
  private readonly repository = SessionRepository.instance;
  /**
   * Create a new session for a user
   */
  public async create(userId: string): Promise<ISession> {
    if (!userId) throw new Error("UserId is required");

    const session = this.repository.create({
      user: { id: userId },
      loginAt: new Date().toISOString(),
    });

    return this.repository.save(session);
  }

  /**
   * Update a session with new properties
   */
  public async update(sessionId: string, input: Partial<ISession>): Promise<void> {
    const existing = await this.repository.findOneBy({ id: sessionId });
    if (!existing) throw new Error(`Session ${sessionId} not found`);

    await this.repository.update(sessionId, { ...input });
  }

  /**
   * Close a session (set logoutAt)
   */
  public async close(sessionId: string): Promise<void> {
    const existing = await this.repository.findOneBy({ id: sessionId });
    if (!existing) throw new Error(`Session ${sessionId} not found`);

    existing.logoutAt = new Date().toISOString();
    await this.repository.save(existing);
  }

  /**
   * Get active session by user
   */
  public async getActiveSession(): Promise<ISession | null> {
    return this.repository.findOne({
      where: { logoutAt: null },
      relations: ["timeLogs", "users"],
      order: {
        createdAt: 'DESC'
      }
    });
  }
}
