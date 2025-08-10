import { createContext, useContext } from 'react';
import Dexie, { Table } from 'dexie';

export interface Download {
  mid: string;
  file: {
    name: string;
    file_map: number[];
    downloaded: { id: number; binary: ArrayBuffer }[];
    encrypted_key: string;
    encrypted_iv: string;
  };
}

export interface File {
  mid: string;
  name: string;
  blob: Blob;
}

export interface ImageCache {
  path: string;
  aura: string;
  file: string;
  simple: string;
  file_blob?: Blob | null;
  simple_blob: Blob;
}

export interface MusicCache {
  song_id: number;
  file_blob: Blob;
}

export class MyDatabase extends Dexie {
  downloads!: Table<Download, string>;
  files!: Table<File, string>;
  image_cache!: Table<ImageCache, string>
  music_cache!: Table<MusicCache, string>

  constructor() {
    super('Element');
    this.version(1).stores({
      files: 'mid',
      downloads: 'mid',
      image_cache: '[path+file]',
      music_cache: 'song_id'
    });
  }
}

export const db = new MyDatabase();

const DatabaseContext = createContext<MyDatabase | null>(null);

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <DatabaseContext.Provider value={db}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = (): MyDatabase => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};

export default DatabaseContext;