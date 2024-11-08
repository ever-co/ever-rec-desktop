import { app } from 'electron';
import { existsSync, promises as fsPromises } from 'fs';
import { platform } from 'os';
import { join, normalize, resolve } from 'path';
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
      if (!filePath || typeof filePath !== 'string') {
        throw new Error('Failed to encode path');
      }
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

  public static async fileSize(localUrl: string): Promise<number> {
    try {
      const filePath = this.decodePath(localUrl);
      return this.task.run('getFileSize', { filePath });
    } catch (error) {
      console.error(`Failed to get file size file: ${localUrl}`, error);
      throw error;
    }
  }

  /**
   * Converts a file path to a properly encoded file URL.
   *
   * @param filePath - The file path to encode
   * @returns The encoded file URL as a string
   * @throws {TypeError} If filePath is not a string
   * @throws {Error} If the path cannot be encoded or is invalid
   *
   * @example
   * ```typescript
   * const url = encodePath('/path/to/file.txt');
   *  On Unix: 'file:///path/to/file.txt'
   *  On Windows: 'file:///C:/path/to/file.txt'
   * ```
   */
  public static encodePath(filePath: string): string {
    // Input validation
    if (typeof filePath !== 'string') {
      throw new TypeError(
        `Expected string for path, but got ${typeof filePath}`
      );
    }

    if (!filePath.trim()) {
      throw new Error('File path cannot be empty');
    }

    try {
      // Normalize path separators and resolve to absolute path
      const normalizedPath = normalize(filePath);
      const absolutePath = resolve(normalizedPath);

      // Handle Windows paths specially
      const isWindows = platform() === 'win32';
      const pathPrefix = isWindows ? '/' : '';

      // Replace backslashes with forward slashes for Windows
      const formattedPath = isWindows
        ? absolutePath.replace(/\\/g, '/')
        : absolutePath;

      // Construct and validate URL
      const fileUrl = new URL(`file://${pathPrefix}${formattedPath}`);

      // Ensure URL is properly formed
      if (!fileUrl.protocol || fileUrl.protocol !== 'file:') {
        throw new Error('Invalid file URL protocol');
      }

      // return href
      return fileUrl.href;
    } catch (error) {
      // Add context to the error and preserve stack trace
      const enhancedError = new Error(
        `Failed to encode file path "${filePath}": ${error}`
      );
      enhancedError.cause = error;
      throw enhancedError;
    }
  }

  /**
   * Decodes a local file system URL path into a regular file system path.
   * Handles Windows-specific path formatting and URL decoding.
   *
   * @param localUrl - A file URL string (e.g., 'file:///C:/path/to/file' or 'file:///usr/local/file')
   * @returns The decoded filesystem path
   * @throws {Error} If the URL is invalid or cannot be decoded
   *
   * @example
   * Windows: returns "C:\path\to\file"
   * decodePath('file:///C:/path/to/file')
   * Unix: returns "/usr/local/file"
   * decodePath('file:///usr/local/file')
   */
  public static decodePath(localUrl: string): string {
    if (!localUrl) {
      throw new Error('URL cannot be empty');
    }

    try {
      // Ensure URL is properly formatted for parsing
      const urlToProcess = localUrl.startsWith('file://')
        ? localUrl
        : `file://${localUrl}`;

      const url = new URL(urlToProcess);

      // Verify it's a file URL
      if (url.protocol !== 'file:') {
        throw new Error('URL must be a file protocol');
      }

      // Handle Windows paths differently
      const isWindows = platform() === 'win32';
      const pathName =
        isWindows && url.pathname[0] === '/'
          ? url.pathname.slice(1)
          : url.pathname;

      return decodeURIComponent(pathName);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      console.error(`Failed to decode path: ${errorMessage}`);
      throw new Error(`Invalid URL: ${errorMessage}`);
    }
  }
}
