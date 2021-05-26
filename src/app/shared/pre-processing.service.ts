import { Injectable } from '@angular/core';
import { GoogleAnalyticsService } from './google-analytics.service';
import { MessageDataService } from './message-data.service';
import { Message, Thread } from './models/thread.interface';

@Injectable({
  providedIn: 'root'
})
export class PreProcessingService {
  // private messagesRegEx = new RegExp('messages/.*message.*\.json');
  private messagesRegEx = new RegExp('.*message.*\.json');
  private count_init = 0;
  private count_end = 0;

  constructor(
    private googleAnalyticsService: GoogleAnalyticsService,
    private messageService: MessageDataService) { }

  public readFiles(files: Array<any>) {
    // explanationModal.style.display = "none"
    // exploreModal.style.display = "none"
    // processingModal.style.display = "block"

    this.googleAnalyticsService.gtag('event', 'Load', {'event_category': 'Load','event_label': 'Custom'});

    for (var i = 0; i < files.length; i++) {
      let file = files[i];

      if (this.isValidMessagesJson(file.webkitRelativePath)) {

        this.count_init += 1
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
              'length': this.getLength(message),
              'reactions': this.getReactions(message)
            }
            let messageAndThread = Object.assign({}, message_info, thread_info)
            this.messageService.addMessage(messageAndThread);
          }

          this.count_end += 1

          if (this.count_init == this.count_end) {
            console.log('All messages loaded!');
            // main()
          }
        }

        reader.readAsText(file)
      }
    }

    console.log('Done!');
  }

  // TODO: Make typing nicer. Something like: <File | { webkitRelativePath }>
  private isValidMessagesJson(file: any): boolean {
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

  private getLength(message: Message): number {
    try {
      return decodeURIComponent(escape(message['content'])).length;
    } catch (err) {
      return 0;
    }
  }

  // TODO: Fix this apparently
  private getReactions(message: Message): number {
    // if (message['reactions'].length == undefined) {
    //     message_info['reactions'] = 0
    // } else {
    //     return 0
    // }
    return 0;
  }
}
