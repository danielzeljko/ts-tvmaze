
export interface ShowInterface {
  score: number;
  show: {
    id: number;
    name: string;
    summary: string;
    image: {medium: string} | null;
  };
}
// dont bother with structure of image value

export interface EpisodesInterface {
  id: number;
  name: string;
  season: string;
  number: string;
}
