import {Participation} from "./Participation";

export type Country = {
  id: number;
  country: string;
  participations: Participation[];
};

/**
 * Country object schema extracted from existing mock json file at assets/mock/olympic.json
 */
export type OlympicData = Country[];
