import { Injectable, NgZone } from "@angular/core";
import { Game } from "../types/game";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class SseService {
  constructor(private _zone: NgZone) {}

  getServerSentEvent(url: string): Observable<any> {
    return new Observable (observer => {
      const eventSource = this.getEventSource(url);
      eventSource.onmessage = event => {
        const msg = JSON.parse(event.data);
        console.log("AAAAAAAAAAAAAAAAAAAA");
        console.log(msg);
          observer.next(msg);
      };

      eventSource.onerror = error => {
        this._zone.run(() => {
          console.log("BBBBBBBB");
          observer.error(error);
          eventSource.close();
        });
      };
    });
  }

  private getEventSource(url: string): EventSource {
    return new EventSource(url);
  }
}
