// Messages
export interface ParsedMessage {
  sender_name: string;
  is_unsent: boolean;
  type: string;
  timestamp?: number;
  timestamp_ms?: number;

  content?: string;
  photos?: Array<File>;
  files?: Array<File>;
  audio_files?: Array<File>;
  videos?: Array<Video>;
  sticker?: { uri: string };
  gifs?: Array<{ uri: string }>;
  reactions?: Array<Reaction>;
}

export interface Message {
  sender_name: string;
  type: string;
  is_unsent: boolean;
  thread_id: string;
  is_user: boolean;
  // Message
  media: MEDIA_TYPE;
  media_files: Array<File>;
  message: string;
  length: number;
  // Time Info
  timestamp: number;
  date: Date;
  timeSeconds: Date;
  // Reactions
  reactions: Array<Reaction>;
}

// All the types I've found so far
export enum MESSAGE_TYPE {
  'Generic',
  'Share',
  'Call',
  'Subscribe',
  'Unsubscribe',
  'Unknown'
}

export enum MEDIA_TYPE {
  NONE = 'none',
  PHOTO = 'photo',
  GIF = 'gifs',
  VIDEO = 'video',
  FILE = 'file',
  AUDIO = 'audio',
}

export interface Reaction {
  reaction: string;
  actor: string;
}

export interface Media {
  type: MEDIA_TYPE;
  uris: Array<File>;
}

interface File {
  uri: string;
  creation_timestamp: number;
}

interface Video extends File {
  thumbnail: { uri: string };
}
