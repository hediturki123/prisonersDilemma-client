import { Decision } from "./decision";
import { Strategy } from "./strategy";

export type Player = {
  id : number;
  score : number;
  currentDecision : Decision | null;
}




