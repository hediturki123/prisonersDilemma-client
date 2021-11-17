import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Game } from '../types/game';


@Injectable({
  providedIn: 'root',
})

export class GameConnectionService {

  protected readonly hostURL: string = environment.herokuHost;

  protected readonly baseURL: string = this.hostURL + '/home';

  constructor(protected http: HttpClient) {}

  async create(c: Game): Promise<boolean> {
    return false;
  }

}
