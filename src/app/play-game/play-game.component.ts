import { Decision } from './../types/decision';
import { PlayerService } from './../service/player.service';
import { GameConnectionService } from './../service/game-connection.service';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Player } from '../types/player';
import { ActivatedRoute } from '@angular/router';
import { Game } from '../types/game';

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

  nbTurns = 10;

  player : Player = {
    id : 0,
    score : 0,
    currentDecision : null
  }

  constructor(private gameConnectionService : GameConnectionService,
    private playerService : PlayerService, private route:ActivatedRoute) { }

  ngOnInit(): void {
  }

  getRoute() {
    this.route.snapshot.params['gameId'];
  }

  playRound() {
    //player 1 plays
    //player 2 plays
    //update the score of the players

    this.round++;
    if (this.round === this.nbTurns) {
      this.gameIsFinished = true;
    }
  }

  async readGameFromUrl() : Promise<Game | null> {
    return await this.playerService.readGame(this.route.snapshot.params['gameId']);
  }

  async readPlayerFromUrl() : Promise<Player | null> {
    let idGame = await this.readGameFromUrl().then(g => {
      return g?.id
    });
    return await this.playerService.read(this.route.snapshot.params['playerId'], idGame as number);
  }

 /* async readPlayerFromGame(game : Game) {
    let playerId = await this.getPlayerId(game);
    this.readPlayer(playerId, game.id)
  }
*/
  readPlayer(idPlayer : number, idGame : number) {
    this.playerService.read(idPlayer, idGame);
    this.getRoute();
  }

  updatePlayer(idPlayer : number, idGame : number) {
    this.playerService.update(idPlayer, idGame);
  }

  clickAction(idPlayer : number, decision : Decision) {
    this.decision = decision;
    this.waitPlayer(idPlayer);
    this.clicked = true;
  }

  waitPlayer(idPlayer : number) {

  }

}
