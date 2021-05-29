import { Injectable } from '@angular/core';
import { GoogleAnalyticsService } from './google-analytics.service';
import { MessageDataService } from './message-data.service';
import { Message, Reaction, Thread } from './models/thread.interface';

@Injectable({
  providedIn: 'root'
})
export class PreProcessingService {
  // private messagesRegEx = new RegExp('messages/.*message.*\.json');
  private messagesRegEx = new RegExp('.*message.*\.json');
  private filesToRead = 0;
  private filesRead = 0;

  constructor(
    private googleAnalyticsService: GoogleAnalyticsService,
    private messageService: MessageDataService) { }

  public readFiles(files: Array<any>) {

    this.googleAnalyticsService.gtag('event', 'Load', {'event_category': 'Load','event_label': 'Custom'});

    for (let file of files) {
      if (this.hasValidFileName(file.webkitRelativePath)) {
        this.filesToRead += 1

        var reader = new FileReader()

        reader.onloadend = () => {

          let thread: Thread = JSON.parse(<string> reader.result)
          let thread_info: any = {
            'is_still_participant': thread['is_still_participant'],
            'thread_type': thread['thread_type'],
            'thread': decodeURIComponent(escape(thread['title'])),
            'nb_participants': thread['participants'] ? thread['participants'].length : 0
          }

          let thread_messages: any[] = thread['messages']
          for (let message of thread_messages) {
            let message_info: any = {
              'sender_name': decodeURIComponent(escape(message['sender_name'])),
              'timestamp': message['timestamp'] || (message['timestamp_ms'] / 1000),
              'type': message['type'],
              'media': this.getMediaType(message),
              'message': this.getMessage(message),
              'length': this.getMessage(message).length,
              'reactions': this.getReactions(message)
            }
            let messageAndThread = Object.assign({}, message_info, thread_info)
            this.messageService.addMessage(messageAndThread);
          }

          this.filesRead += 1

          if (this.filesToRead == this.filesRead) {
            console.log('All messages loaded!');
            // main()
          }
        }

        reader.readAsText(file)
      }
    }

    console.log(`Done! Read ${this.filesRead} of ${this.filesToRead} files`);
  }

  // TODO: Make typing nicer. Something like: <File | { webkitRelativePath }>
  private hasValidFileName(file: any): boolean {
    return this.messagesRegEx.test(file)
  }

  private getMediaType(message: Message): string {
    if (message['photos'] != undefined) {
      return "Photo";
    } else if (message['videos'] != undefined) {
      return "Video";
    } else if (message['files'] != undefined) {
      return "File";
    } else {
      return "None";
    }
  }

  private getMessage(message: Message): string {
    try {
      return decodeURIComponent(escape(message['content']));
    } catch (err) {
      return "";
    }
  }

  private getReactions(message: Message): Array<Reaction> {
    if (message['reactions'] != undefined) {
        return message['reactions']
    } else {
        return []
    }
  }
}
