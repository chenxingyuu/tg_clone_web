/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module '@/assets/js/srs.sdk' {
  namespace SrsSdk {
    class SrsRtcWhipWhepAsync {
      stream: MediaStream;

      play(url: string): void;

      close(): void;
    }
  }

  export = SrsSdk;
}
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_VERSION: string;
}
