import { Strategy } from '../types/strategy';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Game } from '../types/game';
import { Player } from '../types/player';


@Injectable({
  providedIn: 'root'
})

export class PlayerService {

  protected readonly hostURL: string = environment.herokuHost;

  protected readonly baseURL: string = this.hostURL + 'home/';

  constructor(protected http: HttpClient) {}

  async read(idPlayer: number, idGame : number): Promise<Player | null> {
    var player : Player | null = null;
    await fetch(`${this.baseURL}game/${idGame}/player/${idPlayer}` , {
      method : 'GET'
    }).then((r) => {
      return r.json()
    }).then( (r : Player) => {
      player = r;
      console.log(player)
    });
    return player;
  }

  async readGame(id: string): Promise<Game | null> {
    var game : Game | null = null;
    await fetch(`${this.baseURL}game/${id}` , {
      method : 'GET'
    }).then((r) => {
      return r.json()
    }).then( (r : Game) => {
      game = r;
    });
    return game;
  }


  async update(idPlayer : number, idGame : number): Promise<boolean> {
    let ok = false;
    let player = await this.read(idPlayer, idGame);
    let game = await this.readGame(idGame.toString());

    if(game !== null && player !== null){
      await fetch(`${this.baseURL}game/${game.id}/player/${idPlayer}` ,{
        method : 'PUT',
        body : JSON.stringify(player),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((r) => {
        ok = true;
        return r.json();
      }).then(rep => {
        console.log(rep);
      });
    }
    return ok;
  }

}
