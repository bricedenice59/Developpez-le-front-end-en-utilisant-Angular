import {Participation} from "./Participation";

export type Country = {
  id: number;
  country: string;
  participations: Participation[];
};


export type OlympicData = Country[];
