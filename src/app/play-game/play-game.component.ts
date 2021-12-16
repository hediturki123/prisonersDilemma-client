import { BehaviorSubject, Observable } from 'rxjs';
import { SseService } from './../service/sse-service.service';
import { Decision } from './../types/decision';
import { PlayerService } from './../service/player.service';
import { GameConnectionService } from './../service/game-connection.service';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Player } from '../types/player';
import { ActivatedRoute, Router } from '@angular/router';
import { Game } from '../types/game';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';

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
  playersHavePlayed = false;
  grayedButton = false;

  game$ : BehaviorSubject<Game | null> = new BehaviorSubject<Game | null> (null);
  playerHasPlayed$ !: Observable<boolean>;

  constructor(private gameConnectionService : GameConnectionService,
    private playerService : PlayerService, private route : ActivatedRoute, private routeur : Router,
    private sseService: SseService
    ) { }

  ngOnInit(): void {
    this.playerHasPlayed$ = this.game$.pipe(
      map((game) => {
        if (parseInt(this.getPlayerId()) === game?.player1?.id) {
          return !!game?.player1?.havePlayed;
        } else if (parseInt(this.getPlayerId()) === game?.player2?.id){
          return !!game?.player2?.havePlayed;
        } else {
          return false;
        }
      })
    );
    this.sseService.getServerSentEvent("http://localhost:5000/home/game/waitPlayer/idGame=" + this.getGameId())
    .subscribe(data => {
      this.game$.next(data);
      console.log(data)
    }
    );
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
    from(this.gameConnectionService.read(this.getGameId())).subscribe(g => {
      this.playersHavePlayed = g?.player1?.havePlayed as boolean && g?.player2?.havePlayed as boolean;
      this.game$.next(g as Game);
    });
  }

  clickedButtons(game : Game) {
    this.playersHavePlayed = game?.player1?.havePlayed as boolean && game?.player2?.havePlayed as boolean;

    if (this.clicked === true) {
      if (game?.player1?.havePlayed) {
        this.grayedButton = true;
      } else if (game?.player2?.havePlayed) {
        this.grayedButton = true;
      } else {
        this.grayedButton = false;
      }
    } else {
      this.grayedButton = false;
    }
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
    if(player.id == game?.player1?.id) {
      game.player1.havePlayed = true;
    } else if (player.id == game?.player2?.id) {
      game.player2.havePlayed = true;
    }

    this.score = player.score;
    game.currentRound = this.currentRound;

    this.playerService.updatePlayer(player, game);
    this.gameConnectionService.updateGame(game);
    if (this.currentRound === game.nbTurns) {
      this.gameIsFinished = true;
    } else {
      this.currentRound++;
    }
    console.log("have played : " + player.havePlayed + ", " + game.player1?.havePlayed  );
    this.readGame();
    //this.clickedButtons(game);
  }

}


