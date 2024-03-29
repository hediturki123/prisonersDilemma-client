import { Player } from "./player";
import { Round } from "./round";



export type Game = {
  id : number;
  history : Round[];
  currentRound : number;
  player1 : Player | null;
  player2 : Player | null;
  nbTurns : number;
}


