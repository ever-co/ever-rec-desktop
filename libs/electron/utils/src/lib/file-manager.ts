import { app } from 'electron';
import {
  existsSync,
  promises as fsPromises,
  readFileSync,
  readdirSync,
  rmSync,
  unlinkSync,
} from 'fs';
import { platform } from 'os';
import { join, resolve } from 'path';

export class FileManager {
  public static async write(
    directory: string,
    fileName: string,
    buffer: string | NodeJS.ArrayBufferView,
    log = false
  ): Promise<string> {
    try {
      directory = join(app.getPath('userData'), directory);

      const filePath = join(directory, fileName);

      if (!existsSync(directory)) {
        // Create directory if it doesn't exist
        await fsPromises.mkdir(directory, { recursive: true });
      }

      await fsPromises.writeFile(filePath, buffer);

      if (log) {
        console.log(`File written: ${filePath}`);
      }

      return this.encodePath(filePath);
    } catch (error) {
      console.error('Failed to save file:', error);
      throw error;
    }
  }

  public static getFiles(directory: string): string[] {
    // Safely read directory content
    try {
      directory = join(app.getPath('userData'), directory);
      if (!existsSync(directory)) return [];
      return readdirSync(directory).map((file) => this.encodePath(file));
    } catch (error) {
      console.error(`Failed to read directory: ${directory}`, error);
      throw error;
    }
  }

  public static removeAllFiles(directory: string): void {
    // Safely read directory content
    try {
      directory = join(app.getPath('userData'), directory);
      if (!existsSync(directory)) return;
      rmSync(directory, { recursive: true });
    } catch (error) {
      console.warn(`An Error occurred while removing all files ${directory}`);
    }
  }

  public static deleteFile(localUrl: string): void {
    const path = this.decodePath(localUrl);
    // Safely delete a file if it exists
    if (existsSync(path)) {
      try {
        unlinkSync(path);
      } catch (error) {
        console.error(`Failed to delete file: ${path}`, error);
        throw error;
      }
    } else {
      console.warn(`File does not exist: ${path}`);
    }
  }

  public static readFile(localUrl: string): Buffer | null {
    const path = this.decodePath(localUrl);
    if (!existsSync(path)) {
      return null;
    }
    // Safely read file content
    try {
      return readFileSync(path);
    } catch (error) {
      console.error(`Failed to read file: ${path}`, error);
      throw error;
    }
  }

  private static encodePath(filePath: string): string {
    try {
      // Use resolve to ensure the file path is absolute
      const absolutePath = resolve(filePath);
      // Create the URL from the absolute file path
      const fileUrl = new URL(
        `file://${platform() === 'win32' ? '/' : ''}${absolutePath}`
      );
      return fileUrl.href;
    } catch (error) {
      console.error('Error encoding file path:', error);
      throw new Error('Invalid file path');
    }
  }

  private static decodePath(localUrl: string): string {
    try {
      // Parse the URL and extract the pathname
      const url = new URL(localUrl);
      // On Windows, remove the leading slash from the pathname
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
