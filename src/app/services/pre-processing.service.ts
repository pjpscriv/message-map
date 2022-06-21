import { Injectable } from '@angular/core';
import { KeyThreadDates, ParsedThread, Thread } from '../types/thread.interface';
import { GoogleAnalyticsService } from './google-analytics.service';
import { MessageDataService } from './message-data.service';
import * as d3 from 'd3';
// import * as assert from 'assert';
import { Media, MEDIA_TYPE, Message, ParsedMessage, Reaction, WebkitFile } from '../types/message.interface';

@Injectable({
  providedIn: 'root'
})
export class PreProcessingService {
  private messagesRegEx = new RegExp('.*message.*.json'); // new RegExp('messages/.*message.*\.json');
  private imagesRegEx = new RegExp('.*.(jpg|png|webp)');
  private gifRegEx = new RegExp('.*.(gif)');
  private videoRegEx = new RegExp('.*.(mp4)');
  private audioRegEx = new RegExp('.*.(aac|mp3|wav)');
  private threads: Array<Thread> = [];
  private filesToRead = 0;
  private filesRead = 0;
  private totalFileSize = 0;
  private totalFileCount = 0;
  private loadedFileSize = 0;
  private loadedFileCount = 0;

  private filetypes: { [thing: string]: number } = {};

  constructor(
    private googleAnalyticsService: GoogleAnalyticsService,
    private messageService: MessageDataService
  ) {}

  public readFiles(files: Array<WebkitFile>): void {
    this.googleAnalyticsService.gtag('event', 'Load', { event_category: 'Load', event_label: 'Custom' });
    this.messageService.resetProgress();
    this.threads = [];

    for (const file of files) {
      if (this.isMessagesFile(file)) {
        this.filesToRead += 1;

        const reader = new FileReader();
        reader.onload = (event) => {

          const parsedThread: ParsedThread = JSON.parse(event.target?.result as string);
          if (parsedThread != null) {
            this.addThread(this.parseThread(parsedThread));

            for (const message of parsedThread.messages ?? []) {
              this.messageService.addMessage(this.parseMessage(message, parsedThread.thread_path));
            }
          } else {
            throw Error(`Thread was null for ${file?.webkitRelativePath}`);
          }
          this.filesRead += 1;
          this.messageService.setProgress(this.filesRead, this.filesToRead);

          if (this.filesToRead === this.filesRead) {
            console.log('All messages loaded!');
            this.messageService.addThreads(this.threads);
            this.messageService.messagesLoaded();
            console.log(this.filetypes);
            console.log(`Total files: ${this.totalFileCount}`);
            console.log(`Total files size: ${this.totalFileSize}`);
            console.log(`Total files loaded: ${this.loadedFileCount}`);
            console.log(`Total loaded files size: ${this.loadedFileSize}`);
          }
        };
        reader.readAsText(file);

      } else {
        if (this.isImageFile(file)) {
          this.messageService.addFile(file);
          this.loadedFileCount += 1;
          this.loadedFileSize += file.size;
        }

        const extn: string = file.name.split('.').pop() ?? 'undefined';
        this.filetypes[extn] = this.filetypes[extn] ? this.filetypes[extn] + 1 : 1;
        this.totalFileCount += 1;
        this.totalFileSize += file.size;
      }
    }
  }


  private addThread(thread: Thread): void {
    this.threads.push(thread);
  }


  private getKeyThreadDates(messages: Array<ParsedMessage>): KeyThreadDates {
    const dates = {
      firstMessage: Number.MAX_SAFE_INTEGER,
      lastMessage: 0
    };
    for (const message of messages) {
      const timestamp = this.getTimestamp(message);
      dates.firstMessage = Math.min(timestamp, dates.firstMessage);
      dates.lastMessage = Math.max(timestamp, dates.lastMessage);
    }
    return dates;
  }


  private parseThread(parsedThread: ParsedThread): Thread {
    const keyDates = this.getKeyThreadDates(parsedThread.messages as Array<ParsedMessage>);
    return {
      is_still_participant: parsedThread.is_still_participant ?? false,
      title: parsedThread.title ? decodeURIComponent(escape(parsedThread.title)) : '',
      id: decodeURIComponent(escape(parsedThread.thread_path)),
      thread_type: parsedThread.thread_type ?? 'Unknown',
      nb_participants: parsedThread.participants ? parsedThread.participants.length : 0,
      participants: parsedThread.participants ?? [],
      nb_messages: parsedThread.messages ? parsedThread.messages.length : 0,
      first_message: new Date(keyDates.firstMessage * 1000),
      last_message: new Date(keyDates.lastMessage * 1000)
    };
  }


  private parseMessage(message: ParsedMessage, threadId: string): Message {
    const messageText = this.getMessage(message);
    const media = this.getMedia(message);
    return {
      sender_name: decodeURIComponent(escape(message.sender_name)),
      type: message.type,
      is_unsent: message.is_unsent,
      thread_id: threadId,
      is_user: false, // TODO: Can this be calculated as we load?
      timestamp: this.getTimestamp(message),
      media: media.type,
      media_files: media.uris,
      message: messageText,
      length: messageText.length,
      date: this.getTimeDate(message),
      timeSeconds: this.getTimeSeconds(message),
      reactions: this.getReactions(message),
    };
  }


  private getTimestamp(message: ParsedMessage): number {
    if (message.timestamp) {
      return message.timestamp;
    } else if (message.timestamp_ms) {
      return message.timestamp_ms / 1000;
    } else {
      console.error(`Error parsing timestamp in message from ${message.sender_name}`);
      return 0;
    }
  }


  private getTimeDate(message: ParsedMessage): Date {
    const date = new Date(this.getTimestamp(message) * 1000);
    const dateString = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    const parsedDate = d3.timeParse('%Y-%m-%d')(dateString);
    // TODO: figure out how to get assert to play nice with Angular 12
    // assert(parsedDate, `Message from ${message.sender_name} date parse failed: ${parsedDate}`);
    return parsedDate ? parsedDate : new Date(2000, 0, 1);
  }


  private getTimeSeconds(message: ParsedMessage): Date {
    const date = new Date(this.getTimestamp(message) * 1000);
    const day = new Date(2000, 0, 1);
    day.setHours(date.getHours());
    day.setMinutes(date.getMinutes());
    day.setSeconds(date.getSeconds());
    return day;
  }


  private getMedia(message: ParsedMessage): Media {
    const media: Media = { type: MEDIA_TYPE.NONE, uris: [] };
    if (message.photos !== undefined) {
      media.type = MEDIA_TYPE.PHOTO;
      message.photos.forEach(photo => media.uris.push(photo));
      return media;
    } else if (message.videos !== undefined) {
      media.type = MEDIA_TYPE.VIDEO;
      message.videos.forEach(video => media.uris.push(video));
      return media;
    } else if (message.files !== undefined) {
      media.type = MEDIA_TYPE.FILE;
      message.files.forEach(file => media.uris.push(file));
      return media;
    } else if (message.audio_files !== undefined) {
      media.type = MEDIA_TYPE.AUDIO;
      message.audio_files.forEach(file => media.uris.push(file));
      return media;
    } else if (message.gifs !== undefined) {
      media.type = MEDIA_TYPE.GIF;
      message.gifs.forEach(file => media.uris.push({uri: file.uri, creation_timestamp: 0}));
      return media;
    } else if (message.sticker !== undefined) {
      media.type = MEDIA_TYPE.GIF;
      media.uris.push({uri: message.sticker.uri, creation_timestamp: 0});
      return media;
    } else {
      return media;
    }
  }


  private getMessage(message: ParsedMessage): string {
    try {
      return decodeURIComponent(escape(message.content as string));
    } catch (err) {
      return '';
    }
  }


  private getReactions(message: ParsedMessage): Array<Reaction> {
    return message.reactions ? message.reactions : [];
  }


  private isMessagesFile(file: WebkitFile): boolean {
    return this.messagesRegEx.test(file.webkitRelativePath);
  }

  private isImageFile(file: WebkitFile): boolean {
     return this.imagesRegEx.test(file.webkitRelativePath);
  }

  private isGifFile(file: WebkitFile): boolean {
    return this.gifRegEx.test(file.webkitRelativePath);
  }
}
