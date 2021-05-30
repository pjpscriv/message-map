import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageDataService {

  private messageArray: Array<any> = [];
  private progress = new Subject<number>();

  public addMessage(message: any): void {
    this.messageArray.push(message)
  }

  public setProgress(value: number, total: number): void {
    this.progress.next(Math.floor((value / total) * 100))
  }

  public getProgress(): Observable<number> {
    return this.progress;
  }

  public messagesLoaded(): void {
    this.progress.next(100);
  }
}
