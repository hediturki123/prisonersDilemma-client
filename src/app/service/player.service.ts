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

  async readGame(idPlayer : number, idGame: number): Promise<Game | null> {
    let game : Game | null = null;
    console.log("read : " + idPlayer + " ," + idGame);
    await fetch(`${this.baseURL}game/${idGame}/player/${idPlayer}` , {
      method : 'GET'
    }).then((r) => {
      return r.json()
    }).then( (r : Game) => {
      game = r;
      console.log(game.id)
    });
    return game;
  }


  async update(idPlayer : number, idGame : number): Promise<boolean> {
    let ok = false;
    let player = await this.read(idPlayer, idGame);
    let game = await this.readGame(idPlayer, idGame);

    if(game !== null && player !== null){
      console.log("update : " + this.baseURL + "game/" + game.id  + "/player/" + idPlayer);
      await fetch(`${this.baseURL}game/${idGame}/player/${idPlayer}` ,{
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


  async updatePlayer(player : Player, game : Game): Promise<boolean> {
    let ok = false;
    if(game !== null && player !== null){
      //console.log("updatePlayer : " + this.baseURL + "game/" + game.id + "/player/" + player.id);
      await fetch(`${this.baseURL}game/${game.id}/player/${player.id}` ,{
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
