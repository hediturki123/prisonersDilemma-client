import { Strategy } from './../types/strategy';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Game } from '../types/game';


@Injectable({
  providedIn: 'root'
})

export class GameConnectionService {

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

  async read(id: string): Promise<Game | null> {
    var game : Game | null = null;
    await fetch(`${this.baseURL}game/${id}` , {
      method : 'GET'
    }).then((r) => {
      return r.json()
    }).then( (r : Game) => {
      game = r;
      //console.log(game)
    });
    return game;
  }


  async update(idGame : string): Promise<boolean> {
    let ok = false;
    var game : Game | null = null;

    await this.read(idGame).then(resp => {
      game = resp;
    });

    if(game !== null){
      var game2 : Game = game;
      var data = new FormData();
      data.append( "json", JSON.stringify( game2 ) );
      await fetch(`${this.baseURL}game/${game2.id}` ,{
        method : 'PUT',
        body : data
      }).then((r) => {
        ok = true;
        return r.json();
      }).then(rep => {
        console.log(rep);
      });
    }


    return ok;
  }

  async delete(id: string): Promise<boolean> {
    let ok = false;
        try {
            const resp = await this.http
                .delete(`${this.baseURL}${id}`, {observe: 'response', responseType: 'json'})
                .toPromise();
            ok = resp.status === 200;
        } catch (httpError) {
            console.error("error in suppression of the game");
        }
        return ok;
  }

}
