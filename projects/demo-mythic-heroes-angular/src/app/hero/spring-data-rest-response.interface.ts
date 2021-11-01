import { Hero } from './hero.interface';

export interface SpringDataRestResponse {
  _embedded: {
    mythicHeroes: Hero[];
  };
  _links: {
    self: {
      href: string;
    };
    profile: {
      href: string;
    };
    search: {
      href: string;
    };
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}
