import { IUser } from "@ever-co/shared-utils";
import { UserRepository } from "../repositories/user.repository";
import { User } from "../entities/user.entity";

export class UserService {
  private readonly repository = UserRepository.instance;

  /**
   * Finds a user by remoteId or email, or creates one if not found.
   */
  public async findOrCreate(user: IUser): Promise<IUser> {
    if (!user) {
      throw new Error("User payload cannot be null or undefined.");
    }

    const existing = await this.findExisting(user);
    if (existing) {
      return existing;
    }

    const created = this.buildUserEntity(user);
    return this.repository.save(created);
  }

  /**
   * Attempts to find a user by remoteId or email.
   */
  private async findExisting(user: IUser): Promise<IUser | null> {
    if (user.id) {
      const byRemoteId = await this.repository.findOneBy({ remoteId: user.id });
      if (byRemoteId) {
        return byRemoteId;
      }
    }

    if (user.email) {
      return await this.repository.findOne({ where: { email: user.email } });
    }

    return null;
  }

  /**
   * Builds a User entity from the given IUser object.
   */
  private buildUserEntity(user: IUser): User {
    const entity = new User();
    entity.remoteId = user.id;
    entity.email = user.email ?? null;
    entity.imageUrl = user.imageUrl ?? null;
    entity.isVerified = user.isVerified ?? false;
    entity.name = user.name ?? null;
    return entity;
  }
}
