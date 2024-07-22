import { app } from 'electron';
import { existsSync, promises as fsPromises } from 'fs';
import { platform } from 'os';
import { join, resolve } from 'path';
import { FileTaskRunner } from './file-task-runner';

export class FileManager {
  private static task: FileTaskRunner = new FileTaskRunner();

  public static async write(
    directory: string,
    fileName: string,
    buffer: string | NodeJS.ArrayBufferView,
    log = false
  ): Promise<string> {
    try {
      const filePath = await this.task.run<
        {
          directory: string;
          fileName: string;
          buffer: string | NodeJS.ArrayBufferView;
          log: boolean;
        },
        string
      >('write', { directory, fileName, buffer, log });

      return this.encodePath(filePath);
    } catch (error) {
      console.error('Failed to save file:', error);
      throw error;
    }
  }

  public static async getFiles(directory: string): Promise<string[]> {
    try {
      const files = await this.task.run<{ directory: string }, string[]>(
        'getFiles',
        { directory }
      );

      return files.map((f: string) => this.encodePath(f));
    } catch (error) {
      console.error(`Failed to read directory: ${directory}`, error);
      throw error;
    }
  }

  public static async removeAllFiles(directory: string): Promise<void> {
    try {
      await this.task.run('removeAllFiles', { directory });
    } catch (error) {
      console.warn(`An Error occurred while removing all files ${directory}`);
      throw error;
    }
  }

  public static getFilesByPathnames(pathnames: string[]): string[] {
    return pathnames.map((pathname) => this.decodePath(pathname));
  }

  public static async createFilePath(
    directory: string,
    filename: string
  ): Promise<string> {
    try {
      const createdFilePath = await this.task.run<
        { directory: string; filename: string },
        string
      >('createFilePath', { directory, filename });
      return createdFilePath;
    } catch (error) {
      console.error(`Failed to create file path: ${filename}`, error);
      throw error;
    }
  }

  public static createFilePathSync(
    directory: string,
    filename: string
  ): string {
    directory = join(app.getPath('userData'), directory);
    if (!existsSync(directory)) {
      fsPromises.mkdir(directory, { recursive: true });
    }
    return join(directory, filename);
  }

  public static async deleteFile(localUrl: string): Promise<void> {
    try {
      const filePath = this.decodePath(localUrl);
      await this.task.run('deleteFile', { filePath });
    } catch (error) {
      console.error(`Failed to delete file: ${localUrl}`, error);
      throw error;
    }
  }

  public static async readFile(localUrl: string): Promise<Buffer> {
    try {
      const filePath = this.decodePath(localUrl);
      const fileData = await this.task.run<{ filePath: string }, Buffer>(
        'readFile',
        { filePath }
      );

      return fileData;
    } catch (error) {
      console.error(`Failed to read file: ${localUrl}`, error);
      throw error;
    }
  }

  public static encodePath(filePath: string): string {
    try {
      const absolutePath = resolve(filePath);
      const fileUrl = new URL(
        `file://${platform() === 'win32' ? '/' : ''}${absolutePath}`
      );
      return fileUrl.href;
    } catch (error) {
      console.error('Error encoding file path:', error);
      throw new Error('Invalid file path');
    }
  }

  public static decodePath(localUrl: string): string {
    try {
      const url = new URL(localUrl);
      const pathName =
        platform() === 'win32' && url.pathname[0] === '/'
          ? url.pathname.slice(1)
          : url.pathname;
      return decodeURIComponent(pathName);
    } catch (error) {
      console.error('Error decoding URL:', error);
      throw new Error('Invalid URL');
    }
  }
}
