import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageDataService {

  private messageArray: Array<any> = [];

  constructor() { }

  public addMessage(message: any): void {
    this.messageArray.push(message)
  }
}
