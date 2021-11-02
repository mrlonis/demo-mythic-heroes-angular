import { ComponentType } from '@angular/cdk/portal';
import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AlwaysFilteredListComponentDataSource, FilterChoice, FilterChoices } from '../../../shared/components';
import { MythicHero } from '../../../shared/hero.interface';
import { SpringDataRestResponse } from '../../../shared/spring-data-rest-response.interface';
import { HeroService } from '../hero.service';

export type MythicHeroDisplay = {
  name: string;
  faction: string;
  rarity: string;
  type: string;
};

export class QueueDataSource extends AlwaysFilteredListComponentDataSource<MythicHero, MythicHeroDisplay> {
  appropriateModal?: ComponentType<unknown> = undefined;
  displayedColumns: Array<keyof MythicHeroDisplay> = ['name', 'faction', 'rarity', 'type'];
  columnInfo = {
    name: { name: 'Name' },
    faction: { name: 'Faction' },
    rarity: { name: 'Rarity' },
    type: { name: 'Type' },
  };
  filterChoices: {
    [key: string]: undefined | FilterChoices[keyof FilterChoices];
  } = {};
  rowEndings: 'none' | 'arrow' | 'menu' = 'arrow';
  storageKey = 'mythic-heroes';

  // Data
  queueName = 'Mythic Heroes';

  heroes: Array<MythicHero> = [];

  // Filters
  nameFilter?: FilterChoice<'dropdown'>;
  factionFilter?: FilterChoice<'dropdown'>;
  rarityFilter?: FilterChoice<'dropdown'>;
  typeFilter?: FilterChoice<'dropdown'>;

  constructor(private heroService: HeroService, public route: ActivatedRoute) {
    super();
    route.params.subscribe((params) => {
      if (params['queueType'] != undefined) {
        const queue_type = <string>params['queueType'];
        this.queueName = queue_type
          ? {
              'manual-coding': 'Manual Coding',
              'manual-coding-qa': 'Manual Coding QA',
              'coding-escalation': 'Manual Coding Escalations',
              'auto-coding-qa': 'Auto-Coding QA',
              'coding-exception': 'Coding Exceptions',
              rfi: 'Coding RFI',
              'auto-coding': 'Auto-Coding',
            }[queue_type] ?? 'Mythic Heroes'
          : 'Coding Queue';
      }
    });
    this.heroService.getHeroes().subscribe((heroes) => {
      this.heroes = heroes._embedded.data;

      const update = (): boolean => {
        this.nameFilter = {
          name: 'Filter by Name',
          key: 'name',
          type: 'dropdown',
          options: resource_to_dictionary(this.heroes),
          disabled: () => {
            return false;
          },
          notifyUpdate: (sel?: string) => {
            this.filterChoices['name'] = sel;
            return false;
          },
          applyFilter: (sel: string, params: HttpParams) => {
            return params.set('name', sel);
          },
        };
        this.factionFilter = {
          name: 'Filter by Faction',
          key: 'faction',
          type: 'dropdown',
          options: resource_to_dictionary(this.heroes),
          disabled: () => {
            if (this.heroes == undefined || this.heroes.length == 0) {
              return true;
            } else {
              return false;
            }
          },
          notifyUpdate: (sel?: string) => {
            this.filterChoices['faction'] = sel;
            return false;
          },
          applyFilter: (sel: string, params: HttpParams) => {
            return params.set('faction', sel);
          },
        };
        this.rarityFilter = {
          name: 'Rarity',
          key: 'rarity',
          type: 'dropdown',
          options: resource_to_dictionary(this.heroes),
          disabled: () => {
            return false;
          },
          notifyUpdate: (sel?: string) => {
            this.filterChoices['rarity'] = sel;
            return false;
          },
          applyFilter: (sel: string, params: HttpParams) => {
            return params.set('rarity', sel);
          },
        };
        this.typeFilter = {
          name: 'Type',
          key: 'type',
          type: 'dropdown',
          disabled: () => {
            return false;
          },
          notifyUpdate: (sel?: string) => {
            this.filterChoices['type'] = sel;
            return false;
          },
          applyFilter: (sel: string, params: HttpParams) => {
            return params.set('type', sel);
          },
        };
        this.updateFilterOptions([
          [this.nameFilter, this.factionFilter],
          [this.rarityFilter, this.typeFilter],
        ] as Array<Array<FilterChoice<keyof FilterChoices>>>);
        return true;
      };
      update();
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getCollection(index?: number, size?: number, params?: HttpParams): Observable<SpringDataRestResponse<MythicHero>> {
    return this.heroService.getHeroes();
  }

  mapEntry(hero: MythicHero): MythicHeroDisplay {
    return {
      name: hero.name,
      faction: hero.faction.name,
      rarity: hero.rarity.name,
      type: hero.type.name,
    };
  }
}

@Component({
  selector: 'mrlonis-hero-list',
  templateUrl: './hero-list.component.html',
  styleUrls: ['./hero-list.component.scss'],
})
export class HeroListComponent {
  dat: QueueDataSource;
  constructor(heroService: HeroService, route: ActivatedRoute) {
    this.dat = new QueueDataSource(heroService, route);
  }
}

export function resource_to_dictionary(resources: Array<MythicHero>): {
  [key: string]: string;
} {
  const choices: { [key: string]: string } = {};
  resources.forEach((x) => {
    if (x.id != undefined && x.name != undefined) {
      choices[x.name] = x.id;
    }
  });
  return choices;
}
