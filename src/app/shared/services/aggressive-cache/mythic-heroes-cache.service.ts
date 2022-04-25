import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { FactionService, HeroService, RarityService, TypeService } from '..';
import { Faction, MythicHero, Rarity, Type } from '../api/interfaces';
import { AggressiveCache, AggressiveCacheInvalidator } from './base';

@Injectable({ providedIn: 'root' })
export class MythicHeroesAggressiveCache extends AggressiveCache<{
  mythicHero: MythicHero;
  faction: Faction;
  type: Type;
  rarity: Rarity;
}> {
  constructor(
    heroService: HeroService,
    factionService: FactionService,
    typeService: TypeService,
    rarityService: RarityService,
    invalidator: AggressiveCacheInvalidator
  ) {
    super(
      {
        mythicHero: {
          service: (index, page, params) => {
            return heroService.getCollection(index, page, params);
          },
          getAll: true,
          getBy: {
            match: (entity: MythicHero) => {
              if (entity.id == undefined) {
                return [];
              }
              return [new HttpParams().set('id', entity.id)];
            },
            directRequest: (httpParams: HttpParams) => heroService.getSingle(httpParams.get('id') ?? ''),
          },
          collectBy: {
            directRequest: (httpParams: HttpParams) =>
              heroService.getCollection(0, 300, httpParams).pipe(
                map((response) => {
                  return response._embedded.data;
                })
              ),
          },
        },
        faction: {
          service: (index, page, params) => {
            return factionService.getCollection(index, page, params);
          },
          getAll: true,
          getBy: {
            match: (entity: Faction) => {
              if (entity.id == undefined) {
                return [];
              }
              return [new HttpParams().set('id', entity.id)];
            },
            directRequest: (httpParams: HttpParams) => factionService.getSingle(httpParams.get('id') ?? ''),
          },
        },
        type: {
          service: (index, page, params) => {
            return typeService.getCollection(index, page, params);
          },
          getAll: true,
          getBy: {
            match: (entity: Type) => {
              if (entity.id == undefined) {
                return [];
              }
              return [new HttpParams().set('id', entity.id)];
            },
            directRequest: (httpParams: HttpParams) => typeService.getSingle(httpParams.get('id') ?? ''),
          },
        },
        rarity: {
          service: (index, page, params) => {
            return rarityService.getCollection(index, page, params);
          },
          getAll: true,
          getBy: {
            match: (entity: Rarity) => {
              if (entity.id == undefined) {
                return [];
              }
              return [new HttpParams().set('id', entity.id)];
            },
            directRequest: (httpParams: HttpParams) => rarityService.getSingle(httpParams.get('id') ?? ''),
          },
        },
      },
      invalidator
    );
  }
}
