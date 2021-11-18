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

  async create(nbTurns : number): Promise<boolean> {
    let ok = false;
    var data = new FormData();
    data.append( "json", JSON.stringify( nbTurns ) );
    await fetch(`${this.baseURL}${nbTurns}` ,{
      method : 'POST',
      body : data
    }).then((r) => {
      ok = true;
      return r.json();
    }).then(rep => {
      console.log(rep);
    });
    return ok;
  }

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

  async update(idPlayer : number, idGame : number): Promise<boolean> {
    let ok = false;
    var game : Game | null = null;
    var player : Player | null = null;

    await this.read(idPlayer, idGame).then(resp => {
      player = resp;
    });

    if(game !== null){
      var game2 : Game = game;
      var data = new FormData();
      data.append( "json", JSON.stringify( player ) );
      await fetch(`${this.baseURL}game/${game2.id}/player/${idPlayer}` ,{
        method : 'PUT',
        body : player
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
