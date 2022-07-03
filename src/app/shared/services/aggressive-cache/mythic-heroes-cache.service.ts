import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Faction, MythicHero, Rarity, Type } from '../../types';
import { FactionService, HeroService, RarityService, TypeService } from '../api';
import { AggressiveCache, AggressiveCacheInvalidator } from './base';

@Injectable({
  providedIn: 'root',
})
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
          service: (params) => {
            return heroService.getCollection(params);
          },
          getAll: true,
          getBy: {
            match: (entity: MythicHero) => {
              if (entity.id == undefined) {
                return [];
              }
              return [new HttpParams().set('id', entity.id)];
            },
            directRequest: (httpParams: HttpParams) => heroService.getSingle(httpParams),
          },
          collectBy: {
            directRequest: (httpParams: HttpParams) =>
              heroService.getCollection(httpParams.set('page', 0).set('size', 300)).pipe(
                map((response) => {
                  return response._embedded.data;
                })
              ),
          },
        },
        faction: {
          service: (params) => {
            return factionService.getCollection(params);
          },
          getAll: true,
          getBy: {
            match: (entity: Faction) => {
              if (entity.id == undefined) {
                return [];
              }
              return [new HttpParams().set('id', entity.id)];
            },
            directRequest: (httpParams: HttpParams) => factionService.getSingle(httpParams),
          },
        },
        type: {
          service: (params) => {
            return typeService.getCollection(params);
          },
          getAll: true,
          getBy: {
            match: (entity: Type) => {
              if (entity.id == undefined) {
                return [];
              }
              return [new HttpParams().set('id', entity.id)];
            },
            directRequest: (httpParams: HttpParams) => typeService.getSingle(httpParams),
          },
        },
        rarity: {
          service: (params) => {
            return rarityService.getCollection(params);
          },
          getAll: true,
          getBy: {
            match: (entity: Rarity) => {
              if (entity.id == undefined) {
                return [];
              }
              return [new HttpParams().set('id', entity.id)];
            },
            directRequest: (httpParams: HttpParams) => rarityService.getSingle(httpParams),
          },
        },
      },
      invalidator
    );
  }
}
