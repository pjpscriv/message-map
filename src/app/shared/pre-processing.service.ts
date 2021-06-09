import { Injectable } from '@angular/core';
import { GoogleAnalyticsService } from './google-analytics.service';
import { MessageDataService } from './message-data.service';
import { Message, Reaction, ParsedThread, ThreadInfo } from '../models/thread.interface';
import {Store} from '@ngrx/store';
import {AppState, MODAL_STATE} from '../store/state';
import {UpdateModalDisplayAction} from '../store/actions';

@Injectable({
  providedIn: 'root'
})
export class PreProcessingService {
  // private messagesRegEx = new RegExp('messages/.*message.*\.json');
  private messagesRegEx = new RegExp('.*message.*.json');
  private filesToRead = 0;
  private filesRead = 0;

  constructor(
    private googleAnalyticsService: GoogleAnalyticsService,
    private messageService: MessageDataService,
    private store: Store<AppState>
  ) {}

  public readFiles(files: Array<any>): void {
    this.store.dispatch(UpdateModalDisplayAction({modalDisplay: MODAL_STATE.PROGRESS }));
    this.googleAnalyticsService.gtag('event', 'Load', { event_category: 'Load', event_label: 'Custom' });
    const threads: Array<ThreadInfo> = [];

    for (const file of files) {
      if (this.hasValidFileName(file)) {
        this.filesToRead += 1;

        const reader = new FileReader();
        reader.onload = (event) => {

          const parsedThread: ParsedThread = JSON.parse(event.target?.result as string);
          if (parsedThread != null) {

            const threadInfo: ThreadInfo = {
              is_still_participant: parsedThread.is_still_participant ?? false,
              title: parsedThread.title ? decodeURIComponent(escape(parsedThread.title)) : '',
              thread_id: decodeURIComponent(escape(parsedThread.thread_path)),
              thread_type: parsedThread.thread_type ?? "Unknown",
              nb_participants: parsedThread.participants ? parsedThread.participants.length : 0,
              participants: parsedThread.participants ?? []
            };
            threads.push(threadInfo);

            const threadMessages: any[] = parsedThread.messages ?? [];
            for (const message of threadMessages) {
              const messageInfo: any = {
                sender_name: decodeURIComponent(escape(message.sender_name)),
                timestamp: message.timestamp || (message.timestamp_ms / 1000),
                type: message.type,
                media: this.getMediaType(message),
                message: this.getMessage(message),
                length: this.getMessage(message).length,
                reactions: this.getReactions(message)
              };
              const messageAndThread = Object.assign({}, messageInfo, threadInfo);
              this.messageService.addMessage(messageAndThread);
            }
          } else {
            throw Error(`Thread was null for ${file?.webkitRelativePath}`);
          }

          this.filesRead += 1;
          this.messageService.setProgress(this.filesRead, this.filesToRead);

          if (this.filesToRead === this.filesRead) {
            console.log('All messages loaded!');
            this.messageService.addThreads(threads);
            this.messageService.messagesLoaded();
          }
        };

        reader.readAsText(file);
      }
    }

    console.log(`Done! Read ${this.filesRead} of ${this.filesToRead} files`);
  }


  private hasValidFileName(file: File & { webkitRelativePath: string }): boolean {
    return this.messagesRegEx.test(file.webkitRelativePath);
  }


  private getMediaType(message: Message): string {
    if (message.photos !== undefined) {
      return 'Photo';
    } else if (message.videos !== undefined) {
      return 'Video';
    } else if (message.files !== undefined) {
      return 'File';
    } else {
      return 'None';
    }
  }


  private getMessage(message: Message): string {
    try {
      return decodeURIComponent(escape(message.content));
    } catch (err) {
      return '';
    }
  }


  private getReactions(message: Message): Array<Reaction> {
    if (message.reactions !== undefined) {
      return message.reactions;
    } else {
      return [];
    }
  }
}
