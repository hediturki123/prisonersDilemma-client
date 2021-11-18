import { Decision } from './../types/decision';
import { PlayerService } from './../service/player.service';
import { GameConnectionService } from './../service/game-connection.service';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-play-game',
  templateUrl: './play-game.component.html',
  styleUrls: ['./play-game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayGameComponent implements OnInit {

  round = 1;

  clicked = false;

  gameIsFinished = false;

  decision : Decision = null;

  score = 0;

  constructor(private gameConnectionService : GameConnectionService, private playerService : PlayerService) { }

  ngOnInit(): void {
  }

  playRound() {

  }

  readPlayer(idPlayer : number, idGame : number) {
    this.playerService.read(idPlayer, idGame);
  }

  updatePlayer(idPlayer : number, idGame : number) {
    this.playerService.update(idPlayer, idGame);
  }

  clickAction(decision : Decision) {
    this.decision = decision;
    this.clicked = true;
  }

}
