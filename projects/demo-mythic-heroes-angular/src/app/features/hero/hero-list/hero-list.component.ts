import { HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
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
  dataSource = new MatTableDataSource<MythicHeroesTableDataSource>([]);
  data: MythicHeroesTableDataSource[] = [];
  isLoadingResults = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(route: ActivatedRoute, private cache: MythicHeroesAggressiveCache) {}

  ngOnInit() {
    this.updateData(new HttpParams());
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  createDataSource(forkJoinResult: {
    heroes: MythicHero[];
    factions: Faction[];
    rarities: Rarity[];
    types: Type[];
  }): MythicHeroesTableDataSource[] {
    const data: MythicHeroesTableDataSource[] = [];
    forkJoinResult.heroes.forEach((hero) => {
      data.push({
        hero: hero,
        faction: this.cache.getBy('faction', new HttpParams().set('id', hero.factionId)),
        rarity: this.cache.getBy('rarity', new HttpParams().set('id', hero.rarityId)),
        type: this.cache.getBy('type', new HttpParams().set('id', hero.typeId)),
      });
    });
    return data;
  }

  findById(data: BaseResource[], id: string): BaseResource {
    for (let i = 0; i < data.length; i++) {
      if (data[i].id == id) {
        return data[i];
      }
    }
    return { name: '--', imageUrl: '', id: '', _links: { self: { href: '' }, item: { href: '' } } };
  }

  pageEventHandler(event: PageEvent) {
    console.log(event);
  }

  sortData(sort: Sort) {
    console.log(sort);
    if (sort.active == 'hero') {
      if (sort.direction == 'asc') {
        console.log('sort asc');
        this.updateData(new HttpParams().append('sort', 'name,asc'));
      } else if (sort.direction == 'desc') {
        console.log('sort desc');
        this.updateData(new HttpParams().append('sort', 'name,desc'));
      } else {
        console.log('sort default');
        this.updateData(new HttpParams());
      }
    }
  }

  updateData(sortParams: HttpParams) {
    this.isLoadingResults = true;
    forkJoin({
      heroes: this.cache.collectBy('mythicHero', sortParams),
      factions: this.cache.getAll('faction'),
      rarities: this.cache.getAll('rarity'),
      types: this.cache.getAll('type'),
    }).subscribe((x) => {
      console.log(x.heroes);
      this.dataSource = new MatTableDataSource<MythicHeroesTableDataSource>(this.createDataSource(x));
      this.dataSource.paginator = this.paginator;
      this.isLoadingResults = false;
    });
  }
}

export interface MythicHeroesTableDataSource {
  hero: MythicHero;
  faction: Observable<Faction>;
  rarity: Observable<Rarity>;
  type: Observable<Type>;
}
