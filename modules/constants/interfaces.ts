export interface IPlayer {
  id: string;
  first_name: string;
  last_name: string;
  teams_played: string;
}

export interface IComparePlayers {
  player1: IPlayer | null;
  player2: IPlayer | null;
  playerToSet: string | null;
}
