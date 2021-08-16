import {Injectable} from '@angular/core';
import {ThreadMap} from '../models/thread.interface';
import {MEDIA_TYPE, Message} from '../models/message.interface';
import {MessageDataService} from './message-data.service';
import {DemoData, DemoMessage} from '../models/demo-data.interface';
import {HttpClient} from '@angular/common/http';

const DATA_TIMEZONE_OFFSET = 12* 60 * 60 * 1000;

@Injectable({
  providedIn: 'root'
})
export class DemoDataService {
  private threadMap: ThreadMap = {};

  constructor(
    private messageService: MessageDataService,
    private http: HttpClient
  ) {}

  public getDemoData(): void {
    this.http.get('assets/messages/demo_messages.json', { responseType: 'json' })
      .subscribe((data) => this.loadDemoData((data as DemoData)));
  }

  public loadDemoData(data: DemoData): void {
    for (const message of data.messages_array) {
      this.addThreadInfo(message);
      this.messageService.addMessage(this.parseMessage(message));
    }
    this.messageService.addThreads(Object.values(this.threadMap));
    this.messageService.messagesLoaded();
    console.log('Demo Data Loaded');
  }

  private addThreadInfo(message: DemoMessage): void {
    if (!this.threadMap[message.thread]) {
      const thread = {
        is_still_participant: message.is_still_participant,
        title: message.thread,
        id: message.thread,
        thread_type: message.thread_type,
        nb_participants: message.nb_participants,
        participants: [],
        nb_messages: message.nb_participants,
        first_message: new Date(message.timestamp * 1000),
        last_message: new Date(message.timestamp * 1000)
      };
      this.threadMap[message.thread] = thread;
    } else {
      const thread = this.threadMap[message.thread];
      const messageTime = new Date(message.timestamp * 1000);
      thread.nb_messages = thread.nb_messages + 1;
      thread.first_message = thread.first_message < messageTime ? thread.first_message : messageTime;
      thread.last_message = thread.last_message > messageTime ? thread.last_message : messageTime;
      this.threadMap[message.thread] = thread;
    }
  }

  private parseMessage(message: DemoMessage): Message {
    return {
      sender_name: message.sender_name,
      type: message.type,
      is_unsent: message.sent,
      thread_id: message.thread,
      timestamp: message.timestamp,
      media: (MEDIA_TYPE as any)[message.media],
      media_files: [],
      message: message.message,
      length: message.length,
      // TODO: Fix demo data time / date
      date: new Date(message.date),
      timeSeconds: this.getTimeSeconds(message),
      reactions: [],
    };
  }

  private getTimeSeconds(message: DemoMessage): Date {
    const date = new Date((message.timestamp * 1000) + DATA_TIMEZONE_OFFSET);
    const day = new Date(2000, 0, 1);
    day.setHours(date.getHours());
    day.setMinutes(date.getMinutes());
    day.setSeconds(date.getSeconds());
    return day;
  }
}
