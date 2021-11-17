import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Game } from '../types/game';


@Injectable({
  providedIn: 'root',
})

export class GameConnectionService {

  protected readonly hostURL: string = environment.herokuHost;

  protected readonly baseURL: string = this.hostURL + 'home/';

  constructor(protected http: HttpClient) {}

  async create(nbTurns : number): Promise<boolean> {
    let ok = false;
    try {
      const resp = await this.http.post(`${this.baseURL}`, nbTurns, {observe: 'response', responseType: 'json'}).toPromise();
      ok = resp.status === 200;
    } catch(httpError) {
      console.log("baseURL : " + this.baseURL);
      console.error("error in creation of a game");
    }
    return ok;
  }

  async read(id: string): Promise<Game | null> {
    let game: Game | null = null;
        try {
            const resp = await this.http
                .get<Game>(`${this.baseURL}${id}`, {observe: 'response', responseType: 'json'})
                .toPromise();
            if (resp.status === 200) { game = resp.body; }
        } catch (httpError) {
            console.error("error in reading of the game");
        }
        return game;
  }

  async update(g: Game): Promise<boolean> {
    let ok = false;
        try {
            const resp = await this.http
                .put(`${this.baseURL}${g.id}`, g, {observe: 'response', responseType: 'json'})
                .toPromise();
            ok = resp.status === 200;
        } catch (httpError) {
            console.error("error in modification of the game");
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
