import { Decision } from './../types/decision';
import { PlayerService } from './../service/player.service';
import { GameConnectionService } from './../service/game-connection.service';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Player } from '../types/player';
import { ActivatedRoute } from '@angular/router';
import { Game } from '../types/game';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-play-game',
  templateUrl: './play-game.component.html',
  styleUrls: ['./play-game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayGameComponent implements OnInit {

  round = 1;

  clickedPlayer1 = false;
  clickedPlayer2 = false;

  gameIsFinished = false;

  score = 0;

  nbTurns = 10;

  behaviourSubject : BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);

  constructor(private gameConnectionService : GameConnectionService,
    private playerService : PlayerService, private route:ActivatedRoute) { }

  ngOnInit(): void {
  }

  playerIdUrl () {
    //let playerId = await this.readPlayerFromUrl().then(p => {return p?.id;});
    this.readPlayerFromUrl().then(p => {
      this.behaviourSubject.next(p?.id as number);
    });
  }

  get obsBehaviourSubject() {
    return this.behaviourSubject.asObservable();
  }

  getGameId() {
    return this.route.snapshot.params['gameId'];
  }

  getPlayerId() {
    return this.route.snapshot.params['playerId'];
  }

  async playRound() {
    let game = await this.readGameFromUrl().then(g => {
      return g as Game;
    });
    if (game.player1?.havePlayed === true && game.player2?.havePlayed === false){
      console.log("a");
    }
    if (game.player1?.havePlayed === false && game.player2?.havePlayed === true) {
      console.log("b");
    }
    if (game.player1?.havePlayed === false && game.player2?.havePlayed === false) {
      console.log("c");
      this.clickedPlayer1 = true;
    }

    if (game.player1?.havePlayed === true && game.player2?.havePlayed === true) {
      game.player1.havePlayed = false;
      game.player2.havePlayed = false;
      this.clickedPlayer1 = false;
      this.clickedPlayer2 = false;
      this.playerService.updatePlayer(game.player1, game);
      this.playerService.updatePlayer(game.player2, game);
      this.gameConnectionService.updateGame(game);
    }
    this.round++;
    if (this.round === game.nbTurns) {
      this.gameIsFinished = true;
    }
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

  readPlayerPromise(idPlayer : number, idGame : number) {
    return this.playerService.read(idPlayer, idGame);
  }

  readPlayer(idPlayer : number, idGame : number) {
    return this.playerService.read(idPlayer, idGame);
  }

  updatePlayer(idPlayer : number, idGame : number) {
    this.playerService.update(idPlayer, idGame);
  }

  readGame(idGame : string) {
    return this.gameConnectionService.read(idGame);
  }

  async clickAction(idPlayer : number, decision : Decision) {
    let game = await this.readGameFromUrl().then(g => {
      return g as Game;
    });
    let player = await this.readPlayer(idPlayer, game.id).then(p => {
      return p as Player;
    });
    player.currentDecision = decision;
    player.havePlayed = true;
    if (game.player1?.havePlayed) {
      this.clickedPlayer1 = true;
    } else if (game.player2?.havePlayed) {
      this.clickedPlayer2 = true;
    }
    this.playerService.updatePlayer(player, game);
    this.playRound();
  }

}
