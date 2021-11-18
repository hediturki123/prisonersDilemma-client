import { GameConnectionService } from './service/game-connection.service';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  constructor (private gameConnectionService : GameConnectionService) {}


  createGame(nbTurns : string) {
    this.gameConnectionService.create(+nbTurns);
  }

  readGame(idGame : string) {
    this.gameConnectionService.read(idGame);
  }

  joinGame(idGame : string) {
    this.gameConnectionService.update(idGame);
  }

}
