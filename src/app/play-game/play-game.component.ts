import { Decision } from './../types/decision';
import { PlayerService } from './../service/player.service';
import { GameConnectionService } from './../service/game-connection.service';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Player } from '../types/player';
import { ActivatedRoute, Router } from '@angular/router';
import { Game } from '../types/game';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-play-game',
  templateUrl: './play-game.component.html',
  styleUrls: ['./play-game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayGameComponent implements OnInit {

  currentRound = 1;
  clicked = false;
  clickedGiveUp = false;
  gameIsFinished = false;
  score = 0;

  constructor(private gameConnectionService : GameConnectionService,
    private playerService : PlayerService, private route : ActivatedRoute, private routeur : Router) { }

  ngOnInit(): void {
  }

  getGameId() {
    return this.route.snapshot.params['gameId'];
  }

  getPlayerId() {
    return this.route.snapshot.params['playerId'];
  }

  async readGameFromUrl() : Promise<Game | null> {
    return await this.gameConnectionService.read(this.route.snapshot.params['gameId']);
  }

  async readPlayerFromUrl() : Promise<Player | null> {
    let idGame = await this.readGameFromUrl().then(g => {
      return g?.id
    });
    return await this.playerService.read(this.route.snapshot.params['playerId'], idGame as number);
  }

  readPlayer(idPlayer : number, idGame : number) {
    return this.playerService.read(idPlayer, idGame);
  }

  updatePlayer(idPlayer : number, idGame : number) {
    this.playerService.update(idPlayer, idGame);
  }

  giveUp() {
    this.clickedGiveUp = true;
    this.routeur.navigate([`/home`]);
  }

  async clickAction(decision : Decision) {
    this.clicked = true;
    let game = await this.readGameFromUrl().then(g => {
      return g as Game;
    });
    let player = await this.readPlayer(this.getPlayerId(), game.id).then(p => {
      return p as Player;
    });
    player.currentDecision = decision;
    player.havePlayed = true;

    this.playerService.updatePlayer(player, game);
    this.gameConnectionService.updateGame(game);
    if (this.currentRound === game.nbTurns) {
      this.gameIsFinished = true;
    } else {
      this.currentRound++;
    }


  }

}
