import { Hero } from './hero.interface';

export interface SpringDataRestResponse {
  _embedded: DataResponse;
}

export interface DataResponse {
  mythicHeroes: Hero[];
}
