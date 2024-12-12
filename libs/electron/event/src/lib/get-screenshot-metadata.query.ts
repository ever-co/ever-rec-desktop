import { FileManager } from '@ever-co/electron-utils';
import {
  IApplicationService,
  IGetScreenshotQueryResult,
} from '@ever-co/shared-utils';
import {
  type IconInfo,
  type WindowInfo,
  activeWindowAsync,
} from '@miniben90/x-win';
import { SCREENSHOT_DIR } from './capture-screen.event';
export class GetScreenShotMetadataQuery {
  async execute(
    service: IApplicationService
  ): Promise<IGetScreenshotQueryResult | null> {
    const current: WindowInfo = await activeWindowAsync();
    const iconObj: IconInfo = await current.getIconAsync();
    const iconBuffer = this.convert(iconObj.data);
    const fileName = `screenshot-${Date.now()}.png`;

    if (!iconBuffer) {
      return null;
    }

    const { info, title, url } = current;
    const name = info.name;
    const description = [name, title ? ` ${title}` : '', url ? ` ${url}` : '']
      .join('')
      .trim();

    if (!name) {
      return null;
    }

    const exists = await service.findOne({ where: { name } });
    let icon;

    if (!exists) {
      icon = await FileManager.write(
        SCREENSHOT_DIR,
        `icon-${fileName}`,
        iconBuffer
      );
    } else {
      icon = exists.icon;
    }

    return { name, description, icon };
  }

  private convert(base64String: string): Buffer {
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
    return Buffer.from(base64Data, 'base64');
  }
}
