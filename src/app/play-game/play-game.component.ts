import { Strategy } from './../types/strategy';
import { BehaviorSubject, Observable } from 'rxjs';
import { SseService } from './../service/sse-service.service';
import { Decision } from './../types/decision';
import { PlayerService } from './../service/player.service';
import { GameConnectionService } from './../service/game-connection.service';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Player } from '../types/player';
import { ActivatedRoute, Router } from '@angular/router';
import { Game } from '../types/game';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-play-game',
  templateUrl: './play-game.component.html',
  styleUrls: ['./play-game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayGameComponent implements OnInit, OnDestroy {

  currentRound = 1;
  clickedGiveUp = false;
  playersHavePlayed = false;
  nbTurns = 0;
  strategyList: Strategy[] = ["", "GIVE_GIVE", "GIVE_GIVERANDOM", "RANDOM"];
  selectedStrategy : Strategy = "";

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
          return game?.player2 as Player;
        }
      })
      );
      this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.game$.complete();
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
      this.nbTurns = rep?.nbTurns as number;
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

  async newClickAction(decision : Decision) {
    let game = await this.readGameFromUrl().then(g => {
      return g as Game;
    });
    let player = await this.readPlayer(this.getPlayerId(), game.id).then(p => {
      return p as Player;
    });

    player.currentDecision = decision;
    player.havePlayed = true;
    this.playerService.updatePlayer(player, game);
  }

  selectChangeHandler(event : any) {
    this.selectedStrategy = event.target.value;
  }

  async playStrategy() {
    let game = await this.readGameFromUrl().then(g => {
      return g as Game;
    });
    let player = await this.readPlayer(this.getPlayerId(), game.id).then(p => {
      return p as Player;
    });

    if (this.selectedStrategy === "GIVE_GIVE") {
      player.strategy = 1;
    } else if (this.selectedStrategy === "GIVE_GIVERANDOM") {
      player.strategy = 2;
    } else if (this.selectedStrategy === "RANDOM") {
      player.strategy = 3;
    }
    player.currentDecision = 'GIVEUP';
    console.log("player strategy : " + player.strategy);
    player.havePlayed = true;
    this.playerService.updatePlayer(player, game);
    console.log("player : ")
    console.log(player);

  }

}


