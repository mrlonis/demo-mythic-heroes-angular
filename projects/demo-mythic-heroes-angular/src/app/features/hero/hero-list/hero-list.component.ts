import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MythicHeroesAggressiveCache } from '../../../shared/services';
import { BaseResource, Faction, MythicHero, Rarity, Type } from '../../../shared/services/api/interfaces';

/**
 * @title Table with pagination
 */
@Component({
  selector: 'mrlonis-table-pagination-example',
  styleUrls: ['hero-list.component.scss'],
  templateUrl: 'hero-list.component.html',
})
export class HeroListComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['hero', 'faction', 'rarity', 'type'];
  dataSource = new MatTableDataSource<MythicHeroesTableDataSource>(ELEMENT_DATA);
  data: MythicHeroesTableDataSource[] = [];
  isLoadingResults = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(route: ActivatedRoute, private cache: MythicHeroesAggressiveCache) {}

  ngOnInit() {
    forkJoin({
      heroes: this.cache.getAll('mythicHero'),
      factions: this.cache.getAll('faction'),
      rarities: this.cache.getAll('rarity'),
      types: this.cache.getAll('type'),
    }).subscribe((x) => {
      const data: MythicHeroesTableDataSource[] = [];
      x.heroes.forEach((hero) => {
        data.push({
          hero: hero,
          faction: this.findById(x.factions, hero.factionId),
          rarity: this.findById(x.rarities, hero.rarityId),
          type: this.findById(x.types, hero.typeId),
        });
      });
      this.dataSource = new MatTableDataSource<MythicHeroesTableDataSource>(data);
      this.dataSource.paginator = this.paginator;
      this.isLoadingResults = false;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  findById(data: BaseResource[], id: string): BaseResource {
    for (let i = 0; i < data.length; i++) {
      if (data[i].id == id) {
        return data[i];
      }
    }
    return { name: '--', imageUrl: '', id: '', _links: { self: { href: '' }, item: { href: '' } } };
  }
}

export interface MythicHeroesTableDataSource {
  hero: MythicHero;
  faction: Faction;
  rarity: Rarity;
  type: Type;
}

const ELEMENT_DATA: MythicHeroesTableDataSource[] = [];
