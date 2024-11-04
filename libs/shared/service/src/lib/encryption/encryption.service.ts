import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EncryptionService {
  private readonly algorithm = 'AES-GCM';
  private readonly keyConfig = {
    name: this.algorithm,
    length: 256,
  };
  private readonly ivLength = 12; // 96 bits for AES-GCM
  private encryptionKey!: CryptoKey;

  constructor() {
    this.initializeEncryptionKey();
  }

  private async initializeEncryptionKey(): Promise<void> {
    try {
      // Try to load existing key from secure storage
      const savedKey = sessionStorage.getItem('encryption_key');
      if (savedKey) {
        const keyBuffer = this.base64ToArrayBuffer(savedKey);
        this.encryptionKey = await crypto.subtle.importKey(
          'raw',
          keyBuffer,
          this.algorithm,
          false,
          ['encrypt', 'decrypt']
        );
      } else {
        // Generate new key if none exists
        this.encryptionKey = await crypto.subtle.generateKey(
          this.keyConfig,
          true,
          ['encrypt', 'decrypt']
        );
        // Save the key securely
        const exportedKey = await crypto.subtle.exportKey(
          'raw',
          this.encryptionKey
        );
        const keyBase64 = this.arrayBufferToBase64(exportedKey);
        sessionStorage.setItem('encryption_key', keyBase64);
      }
    } catch (error) {
      console.error('Failed to initialize encryption key:', error);
      throw new Error('Encryption initialization failed');
    }
  }

  /**
   * Encrypts data with AES-GCM
   */
  public encrypt<T>(data: T): Observable<string> {
    return from(this.encryptData(data)).pipe(
      catchError((error) =>
        throwError(() => new Error(`Encryption failed: ${error.message}`))
      )
    );
  }

  /**
   * Decrypts AES-GCM encrypted data
   */
  public decrypt(encryptedData: string): Observable<unknown> {
    return from(this.decryptData(encryptedData)).pipe(
      catchError((error) =>
        throwError(() => new Error(`Decryption failed: ${error.message}`))
      )
    );
  }

  private async encryptData<T>(data: T): Promise<string> {
    if (!this.encryptionKey) {
      await this.initializeEncryptionKey();
    }

    // Generate random IV
    const iv = crypto.getRandomValues(new Uint8Array(this.ivLength));
    const encodedData = new TextEncoder().encode(JSON.stringify(data));

    try {
      const encryptedBuffer = await crypto.subtle.encrypt(
        {
          name: this.algorithm,
          iv,
        },
        this.encryptionKey,
        encodedData
      );

      // Combine IV and encrypted data
      const combinedArray = new Uint8Array(
        iv.length + encryptedBuffer.byteLength
      );
      combinedArray.set(iv);
      combinedArray.set(new Uint8Array(encryptedBuffer), iv.length);

      return this.arrayBufferToBase64(combinedArray);
    } catch (error) {
      throw new Error(`Encryption operation failed: ${error}`);
    }
  }

  private async decryptData<T>(encryptedData: string): Promise<T> {
    if (!this.encryptionKey) {
      await this.initializeEncryptionKey();
    }

    try {
      const encryptedArray = this.base64ToArrayBuffer(encryptedData);

      // Extract IV and encrypted content
      const iv = encryptedArray.slice(0, this.ivLength);
      const encryptedContent = encryptedArray.slice(this.ivLength);

      const decryptedBuffer = await crypto.subtle.decrypt(
        {
          name: this.algorithm,
          iv,
        },
        this.encryptionKey,
        encryptedContent
      );

      const decryptedText = new TextDecoder().decode(decryptedBuffer);
      return JSON.parse(decryptedText);
    } catch (error) {
      throw new Error(`Decryption operation failed: ${error}`);
    }
  }

  private arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private base64ToArrayBuffer(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }
}
