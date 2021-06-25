import { Injectable } from '@angular/core';
import { ParsedMessage, ParsedThread, Reaction, Thread, ThreadMap, Message, MEDIA_TYPE, Media } from '../models/thread.interface';
import { GoogleAnalyticsService } from './google-analytics.service';
import { MessageDataService } from './message-data.service';
import * as d3 from 'd3';
import * as deepEqual from 'fast-deep-equal';
import * as assert from 'assert';

type WebkitFile = File & { webkitRelativePath: string };

@Injectable({
  providedIn: 'root'
})
export class PreProcessingService {
  private messagesRegEx = new RegExp('.*message.*.json'); // new RegExp('messages/.*message.*\.json');
  private threads: Array<Thread> = [];
  private filesToRead = 0;
  private filesRead = 0;

  constructor(
    private googleAnalyticsService: GoogleAnalyticsService,
    private messageService: MessageDataService
  ) {}

  public readFiles(files: Array<WebkitFile>): void {
    this.googleAnalyticsService.gtag('event', 'Load', { event_category: 'Load', event_label: 'Custom' });

    for (const file of files) {
      if (this.hasValidFileName(file)) {
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
          }
        };
        reader.readAsText(file);
      }
    }
  }


  private addThread(thread: Thread): void {
    this.threads.push(thread);
  }


  private parseThread(parsedThread: ParsedThread): Thread {
    return {
      is_still_participant: parsedThread.is_still_participant ?? false,
      title: parsedThread.title ? decodeURIComponent(escape(parsedThread.title)) : '',
      id: decodeURIComponent(escape(parsedThread.thread_path)),
      thread_type: parsedThread.thread_type ?? "Unknown",
      nb_participants: parsedThread.participants ? parsedThread.participants.length : 0,
      participants: parsedThread.participants ?? [],
      nb_messsages: parsedThread.messages ? parsedThread.messages.length : 0
    }
  }


  private parseMessage(message: ParsedMessage, threadId: string): Message {
    const messageText = this.getMessage(message);
    const media = this.getMedia(message);
    return {
      sender_name: decodeURIComponent(escape(message.sender_name)),
      type: message.type,
      is_unsent: message.is_unsent,
      thread_id: threadId,
      timestamp: this.getTimestamp(message),
      media: media.type,
      media_files: media.uris,
      message: messageText,
      length: messageText.length,
      date: this.getDate(message),
      timeSeconds: this.getTimeSeconds(message),
      reactions: this.getReactions(message),
    };
  }


  private getTimestamp(message: ParsedMessage): number {
    if (message.timestamp) {
      return message.timestamp
    } else if (message.timestamp_ms) {
      return message.timestamp_ms / 1000
    } else {
      console.error(`Error parsing timestamp in messgae from ${message.sender_name}`);
      return 0
    }
  }


  private getDate(message: ParsedMessage): Date {
    const date = new Date(this.getTimestamp(message) * 1000)
    const dateString = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    const parsedDate = d3.timeParse("%Y-%m-%d")(dateString)
    assert(parsedDate, `Message from ${message.sender_name} date parse failed: ${parsedDate}`);
    return parsedDate ? parsedDate : new Date(2000, 0, 1);
  }


  private getTimeSeconds(message: ParsedMessage): Date {
    const date = new Date(this.getTimestamp(message) * 1000)
    const day = new Date(2000, 0, 1);
    day.setHours(date.getHours());
    day.setMinutes(date.getMinutes());
    day.setSeconds(date.getSeconds());
    return day;
  }


  private getMedia(message: ParsedMessage): Media {
    const media: Media = { type: MEDIA_TYPE.NONE, uris: [] }
    if (message.photos !== undefined) {
      media.type = MEDIA_TYPE.PHOTO;
      message.photos.forEach(photo => media.uris.push(photo))
      return media;
    } else if (message.videos !== undefined) {
      media.type = MEDIA_TYPE.VIDEO;
      message.videos.forEach(video => media.uris.push(video))
      return media;
    } else if (message.files !== undefined) {
      media.type = MEDIA_TYPE.FILE;
      message.files.forEach(file => media.uris.push(file))
      return media;
    } else if (message.audio_files !== undefined) {
      media.type = MEDIA_TYPE.AUDIO;
      message.audio_files.forEach(file => media.uris.push(file))
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


  private hasValidFileName(file: WebkitFile): boolean {
    return this.messagesRegEx.test(file.webkitRelativePath);
  }
}
