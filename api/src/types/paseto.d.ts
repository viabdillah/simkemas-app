// api/src/types/paseto.d.ts
declare module 'paseto' {
  import { KeyObject } from 'node:crypto';

  export namespace V4 {
    // Definisi fungsi encrypt
    export function encrypt(
      payload: any,
      key: KeyObject,
      options?: { expiresIn?: string; [key: string]: any }
    ): Promise<string>;

    // Definisi fungsi decrypt
    export function decrypt(
      token: string,
      key: KeyObject,
      options?: { [key: string]: any }
    ): Promise<any>;
  }
}