import { GameConnectionService } from './service/game-connection.service';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OSM_TILE_LAYER_URL } from '@yaga/leaflet-ng2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  constructor (private gameConnectionService : GameConnectionService) {}
}
