import { Injectable } from '@angular/core';
import { Faction, MythicHero, Rarity, Type } from '../../types';
import { ApiService } from './base';

@Injectable({
  providedIn: 'root',
})
export class MythicHeroesApiService extends ApiService<{
  mythicHero: MythicHero;
  faction: Faction;
  rarity: Rarity;
  type: Type;
}> {}
