import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { GameConnectionService } from '../service/game-connection.service';

@Component({
  selector: 'app-home-game',
  templateUrl: './home-game.component.html',
  styleUrls: ['./home-game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeGameComponent implements OnInit {

  ngOnInit(): void {
  }
  constructor (private gameConnectionService : GameConnectionService,
                private routeur: Router
    ) {}


  createGame(nbTurns : string) {
    this.gameConnectionService.create(+nbTurns).then(rep => {
      if(rep){
        this.gameConnectionService.readLastGame().then(r => {
          this.openPlayPage(r?.id.toString() as string);
        })
      }
    });

  }

  joinGame(idGame : string) {
    this.gameConnectionService.update(idGame).then(rep => {
      if(rep){
        this.openJoinPage(idGame);
      }
    });
  }

  async openPlayPage(idGame : string) {
    let idPlayer : number = 0;
    await this.gameConnectionService.read(idGame).then(g => {
      idPlayer = g?.player1?.id as number;});
    this.routeur.navigate([`/home/play/${idGame}/${idPlayer}`]);
  }

  async openJoinPage(idGame : string) {
    let idPlayer : number = 0;
    await this.gameConnectionService.read(idGame).then(g => {idPlayer = g?.player2?.id as number;});
    this.routeur.navigate([`/home/play/${idGame}/${idPlayer}`]);
  }

}
