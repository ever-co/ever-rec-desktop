import { app } from 'electron';
import {
  existsSync,
  promises as fsPromises,
  readFileSync,
  readdirSync,
  unlinkSync,
} from 'fs';
import { join } from 'path';

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

      return filePath;
    } catch (error) {
      console.error('Failed to save file:', error);
      throw error;
    }
  }

  public static getFiles(directory: string): string[] {
    // Safely read directory content
    try {
      directory = join(app.getPath('userData'), directory);

      return readdirSync(directory);
    } catch (error) {
      console.error(`Failed to read directory: ${directory}`, error);
      throw error;
    }
  }

  public static deleteFile(path: string): void {
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

  public static readFile(path: string): Buffer {
    // Safely read file content
    try {
      return readFileSync(path);
    } catch (error) {
      console.error(`Failed to read file: ${path}`, error);
      throw error;
    }
  }
}
