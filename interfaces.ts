
export interface ShowInterface {
  id: number;
  name: string;
  summary: string;
  image: {medium: string} | null;
}

export interface EpisodesInterface {
  id: number;
  name: string;
  season: string;
  number: string;
}
