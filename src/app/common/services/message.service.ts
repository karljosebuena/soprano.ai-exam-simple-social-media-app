import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Message } from '../interfaces/message.interface';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private subject = new Subject<Message>();

  sendMessage(message: Message) {
    this.subject.next(message);
  }

  onMessage(): Observable<any> {
    return this.subject.asObservable();
  }

  clearMessages() {
    this.subject.next();
  }

}