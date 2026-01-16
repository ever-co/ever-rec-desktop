import { AudioService } from '@ever-co/electron-database';
import { FileManager } from '@ever-co/electron-utils';
import {
  AUDIO_DIR,
  Channel,
  currentDay,
  IAudio,
  IAudioCreateInput,
  IAudioSave,
  IFindManyOptions,
  IPaginationOptions,
} from '@ever-co/shared-utils';
import { ipcMain } from 'electron';
import { Between } from 'typeorm';
import { userSessionService } from './session.event';

const audioService = new AudioService();

export function crudAudioEvent(): void {
  // Get all audio
  ipcMain.handle(
    Channel.GET_ALL_AUDIO,
    async (_, options = {} as IPaginationOptions<IAudio>) => {
      const {
        page = 1,
        limit = 10,
        start = currentDay().start,
        end = currentDay().end,
      } = options;

      const user = await userSessionService.currentUser();

      const [data, count] = await audioService.findAndCount({
        where: {
          createdAt: Between(start, end),
          timeLog: {
            session: {
              user: {
                id: user.id
              }
            }
          }
        },
        relations: ['metadata', 'chunks'],
        order: { createdAt: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      });

      const hasNext = page * limit < count;

      return { data, count, hasNext };
    }
  );

  // Save audio
  ipcMain.handle(Channel.SAVE_AUDIO, async (_, options = {}) => {
    return saveAudio(options);
  });

  // Get one audio
  ipcMain.handle(Channel.GET_AUDIO, async (_, options = {}) => {
    return audioService.findOne(options);
  });

  // Delete one audio
  ipcMain.handle(Channel.DELETE_AUDIO, async (_, photo: IAudio) => {
    await audioService.delete(photo.id);
    await FileManager.deleteFile(photo.pathname);
  });

  // Delete Many Audio
  ipcMain.handle(Channel.DELETE_ALL_AUDIO, async (_, audio: IAudio[]) => {
    if (!audio || audio.length === 0) {
      await Promise.all([
        audioService.deleteAll(),
        FileManager.removeAllFiles(AUDIO_DIR),
      ]);
      return;
    }
    // Extract IDs
    const ids = audio.map(({ id }) => id);
    // Extract Pathnames
    const pathnames = audio.map(({ pathname }) => pathname);
    // Delete videos in the database
    await audioService.deleteAll(ids);
    // Delete files concurrently
    await Promise.all(
      pathnames.map(async (pathname) => await FileManager.deleteFile(pathname))
    );
  });
}

export async function saveAudio(data: IAudioSave) {
  const { arrayBuffer, duration, channels, rate, videoId } = data;
  const name = `audio-${Date.now()}.webm`;

  const pathname = await FileManager.write(
    AUDIO_DIR,
    name,
    Buffer.from(arrayBuffer)
  );

  const size = await FileManager.fileSize(pathname);

  const input: IAudioCreateInput = {
    pathname,
    videoId,
    metadata: {
      size,
      name,
      duration,
      channels,
      rate,
    },
  };

  return audioService.save(input);
}

// Get many audios for upload
ipcMain.handle(Channel.GET_AUDIOS_TO_UPLOAD, async (_, options: IFindManyOptions<IAudio>) => {
  return audioService.findAll(options);
});

export function removeCrudAudioEvent(): void {
  const channels = [
    Channel.SAVE_AUDIO,
    Channel.DELETE_AUDIO,
    Channel.DELETE_ALL_AUDIO,
    Channel.GET_ALL_AUDIO,
    Channel.GET_AUDIO,
    Channel.GET_AUDIOS_TO_UPLOAD
  ];
  channels.forEach((channel) => ipcMain.removeHandler(channel));
}
