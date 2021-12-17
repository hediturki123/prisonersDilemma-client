import { BehaviorSubject, Observable } from 'rxjs';
import { SseService } from './../service/sse-service.service';
import { Decision } from './../types/decision';
import { PlayerService } from './../service/player.service';
import { GameConnectionService } from './../service/game-connection.service';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Player } from '../types/player';
import { ActivatedRoute, Router } from '@angular/router';
import { Game } from '../types/game';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-play-game',
  templateUrl: './play-game.component.html',
  styleUrls: ['./play-game.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class PlayGameComponent implements OnInit {

  currentRound = 1;
  clicked = false;
  clickedGiveUp = false;
  gameIsFinished = false;
  score = 0;
  playersHavePlayed = false;
  grayedButton = false;

  game$ : BehaviorSubject<Game | null> = new BehaviorSubject<Game | null> ({
    id:0,
    history:[],
    currentRound:0,
    player1:null,
    player2:null,
    nbTurns:0

  });
  playerHasPlayed$ !: Observable<Player>;
  hasPlayed$ : BehaviorSubject<boolean | null> = new BehaviorSubject<boolean|null>(false);

  constructor(private gameConnectionService : GameConnectionService,
    private playerService : PlayerService, private route : ActivatedRoute, private routeur : Router,
    private sseService: SseService,
    public cdr: ChangeDetectorRef) {
      this.gameConnectionService.read(this.getGameId()).then(
        (game) => {
          this.game$.next(game);
        }
      );
     }

  ngOnInit(): void {
    this.sseService.getServerSentEvent("http://localhost:5000/home/game/waitOtherPlayer/idGame=" + this.getGameId()
    + "/idPlayer=" + this.getPlayerId())
    .subscribe(data => {
      this.game$.next(data);
      this.cdr.detectChanges();
    }
    );

    this.playerHasPlayed$ = this.game$.pipe(
      map((game) => {
        if (parseInt(this.getPlayerId()) === game?.player1?.id) {
          return game?.player1 as Player;
        } else {
          console.log("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz");
          return game?.player2 as Player;
        }
      })
      );
      this.cdr.detectChanges();
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

  readGame() {
    from(this.gameConnectionService.read(this.getGameId()).then(rep => {
      console.log(rep);
      this.currentRound = rep?.currentRound as number;
      return rep
    })).subscribe(g => {
      this.playersHavePlayed = g?.player1?.havePlayed as boolean && g?.player2?.havePlayed as boolean;
      this.game$.next(g as Game);
    });
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

  get playerHavePlayed() {
    if (parseInt(this.getPlayerId()) === this.game$.value?.player1?.id) {
      console.log(this.game$.value?.player1?.havePlayed);
      return this.game$.value?.player1?.havePlayed;
    } else {
      console.log(this.game$.value?.player2?.havePlayed);
      return this.game$.value?.player2?.havePlayed;
    }

  }

  async clickAction(decision : Decision) {
    let game = await this.readGameFromUrl().then(g => {
      return g as Game;
    });
    let player = await this.readPlayer(this.getPlayerId(), game.id).then(p => {
      return p as Player;
    });
    player.currentDecision = decision;
    player.havePlayed = true;
    if(player.id == game?.player1?.id) {
      game.player1 = player;
      game.player1.havePlayed = true;
    } else if (player.id == game?.player2?.id) {
      game.player2 = player;
      game.player2.havePlayed = true;
    }

    this.score = player.score;
    game.currentRound = this.currentRound;
    console.log("player : " + player.havePlayed + ", " + game.player1?.havePlayed);

    this.playerService.updatePlayer(player, game);
    this.gameConnectionService.updateGame(game);
    // this.sseService.getServerSentEvent("http://localhost:5000/home/game/waitPlayer/idGame=" + this.////getGameId());
    if (this.currentRound === game.nbTurns) {
      this.gameIsFinished = true;
    }
    this.currentRound = game.currentRound;
    console.log("have played : " + player.havePlayed + ", " + game.player1?.havePlayed  );
    this.readGame();
    //this.clickedButtons(game);
  }



  async newClickAction(decision : Decision) {
    let game = await this.readGameFromUrl().then(g => {
      return g as Game;
    });
    let player = await this.readPlayer(this.getPlayerId(), game.id).then(p => {
      return p as Player;
    });
    console.log("game");
    console.log(game);
    console.log(player);

    player.currentDecision = decision;
    player.havePlayed = true;
    this.playerService.updatePlayer(player, game);
    console.log("updatePlayer");
    console.log(player);
    //this.readGame();

  }

}


