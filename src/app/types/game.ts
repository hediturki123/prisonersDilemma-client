import { Player } from "./player";
import { Round } from "./round";



export type Game = {
  id : number;
  history : Round[];
  player1 : Player;
  player2 : Player;
  nbTurns : number;
}


