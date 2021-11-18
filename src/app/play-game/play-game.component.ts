import { GameConnectionService } from './../service/game-connection.service';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-play-game',
  templateUrl: './play-game.component.html',
  styleUrls: ['./play-game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayGameComponent implements OnInit {

  constructor(private gameConnectionService : GameConnectionService) { }

  ngOnInit(): void {
  }

}
