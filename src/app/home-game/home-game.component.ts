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

  readGame(idGame : string) {
    this.gameConnectionService.read(idGame);
  }

  joinGame(idGame : string) {
    this.gameConnectionService.update(idGame).then(rep => {
      if(rep){
        this.openPlayPage(idGame);
      }
    });
  }

  openPlayPage(idGame : string) {
    this.routeur.navigate([`/home/play/${idGame}`]);
  }

}
