import { GameConnectionService } from './service/game-connection.service';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  constructor (private gameConnectionService : GameConnectionService) {}


  createGame(nbTurns : string) {
    this.gameConnectionService.create(+nbTurns);
  }

  readGame() {

  }

  joinGame(idGame : string) {
    //this.gameConnectionService.read(+idGame);
  }

}
