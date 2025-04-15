import { ElectronLogger } from '@ever-co/electron-utils';
import {
  IApplication,
  IApplicationService,
  IFindOneOptions,
  ILoggable,
  ILogger,
} from '@ever-co/shared-utils';
import { In } from 'typeorm';
import { Application } from '../entities/application.entity';
import { ApplicationRepository } from '../repositories/application.repository';

export class ApplicationService implements ILoggable, IApplicationService {
  private readonly repository = ApplicationRepository.instance;
  public logger: ILogger = new ElectronLogger('Application Service');

  public async save(input: Partial<IApplication>): Promise<IApplication> {
    const application = new Application();
    const { name, icon } = input;

    if (!name) {
      throw new Error('Application name is required');
    }

    const app = await this.findOne({ where: { name } });

    if (!app) {
      application.name = name;
      application.icon = icon;
      return this.repository.save(application);
    }

    return app;
  }

  public async findOne(
    options: IFindOneOptions<IApplication>
  ): Promise<IApplication> {
    return this.repository.findOne(options);
  }

  public async deleteAll(screenshotIds?: string[]): Promise<void> {
    await this.repository.delete(
      screenshotIds ? { id: In(screenshotIds) } : {}
    );
  }
}
