import { Decision } from "./decision";

export type Player = {
  id : number;
  score : number;
  currentDecision : Decision | null;
  havePlayed : boolean;
}




