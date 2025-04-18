import { PhotoService } from '@ever-co/electron-database';
import { FileManager } from '@ever-co/electron-utils';
import {
  Channel,
  convertBase64ToBuffer,
  currentDay,
  IPaginationOptions,
  IPhoto,
  IPhotoCreateInput,
  IPhotoSave,
  PHOTO_DIR,
} from '@ever-co/shared-utils';
import { ipcMain } from 'electron';
import { Between } from 'typeorm';

const photoService = new PhotoService();

export function crudPhotoEvent(): void {
  // Get all screenshots
  ipcMain.handle(
    Channel.GET_ALL_PHOTOS,
    async (_, options = {} as IPaginationOptions<IPhoto>) => {
      const {
        page = 1,
        limit = 10,
        start = currentDay().start,
        end = currentDay().end,
      } = options;

      const [data, count] = await photoService.findAndCount({
        where: {
          createdAt: Between(start, end),
        },
        order: { createdAt: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      });

      const hasNext = page * limit < count;

      return { data, count, hasNext };
    }
  );

  // Save video
  ipcMain.handle(Channel.SAVE_PHOTO, async (_, options = {}) => {
    return savePhoto(options);
  });

  // Get one video
  ipcMain.handle(Channel.GET_PHOT0, async (_, options = {}) => {
    return photoService.findOne(options);
  });

  // Delete one video
  ipcMain.handle(Channel.DELETE_PHOTO, async (_, photo: IPhoto) => {
    await photoService.delete(photo.id);
    await FileManager.deleteFile(photo.pathname);
  });

  // Delete Many Videos
  ipcMain.handle(Channel.DELETE_ALL_PHOTOS, async (_, photos: IPhoto[]) => {
    if (!photos || photos.length === 0) {
      await Promise.all([
        photoService.deleteAll(),
        FileManager.removeAllFiles(PHOTO_DIR),
      ]);
      return;
    }
    // Extract IDs
    const ids = photos.map(({ id }) => id);
    // Extract Pathnames
    const pathnames = photos.map(({ pathname }) => pathname);
    // Delete videos in the database
    await photoService.deleteAll(ids);
    // Delete files concurrently
    await Promise.all(
      pathnames.map(async (pathname) => await FileManager.deleteFile(pathname))
    );
  });
}

export async function savePhoto(data: IPhotoSave) {
  const { dataURL, resolution } = data;
  const name = `photo-${Date.now()}.png`;
  const buffer = convertBase64ToBuffer(dataURL);
  const pathname = await FileManager.write(PHOTO_DIR, name, buffer);
  const size = await FileManager.fileSize(pathname);
  const input: IPhotoCreateInput = {
    pathname,
    metadata: {
      size,
      name,
      resolution,
    },
  };

  return photoService.save(input);
}

export function removeCrudPhotoEvent(): void {
  const channels = [
    Channel.SAVE_PHOTO,
    Channel.DELETE_PHOTO,
    Channel.DELETE_ALL_PHOTOS,
    Channel.GET_ALL_PHOTOS,
    Channel.GET_PHOT0,
  ];
  channels.forEach((channel) => ipcMain.removeAllListeners(channel));
}
