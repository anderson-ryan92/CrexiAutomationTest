declare module 'uploadcare/upload-client' {
    export function uploadFile(
      file: string | File | Blob,
      options: {
        publicKey?: string;  // Make publicKey optional
        store?: 'auto' | '0' | '1';
        metadata?: Record<string, string>;
        [key: string]: any;
      }
    ): Promise<{
      originalUrl: string;
      cdnUrl: string;
      name: string;
      size: number;
      isImage: boolean;
      isStored: boolean;
      uuid: string;
      [key: string]: any;
    }>;
  
    // Add other functions or types from uploadcare as needed
  }