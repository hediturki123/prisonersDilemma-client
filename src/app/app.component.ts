import { GameConnectionService } from './service/game-connection.service';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OSM_TILE_LAYER_URL } from '@yaga/leaflet-ng2';
import { Observable } from 'rxjs';

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

}
