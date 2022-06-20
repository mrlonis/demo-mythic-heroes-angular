import { HttpParams } from '@angular/common/http';
import type { AfterViewInit, OnInit } from '@angular/core';
import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import type { PageEvent } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import type { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import type { Observable } from 'rxjs';
import { forkJoin, of } from 'rxjs';
import { mergeMap, startWith } from 'rxjs/operators';
import { BaseResource, Faction, MythicHero, MythicHeroesAggressiveCache, Rarity, Type } from '../../../shared';

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

  nameParam = '';
  factionNameParam = '';
  rarityNameParam = '';
  typeNameParam = '';
  heroSortParam?: string;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  heroNameFilterControl = new FormControl('');
  filteredOptions: Observable<MythicHero[]> | Observable<never[]> = of([]);

  constructor(route: ActivatedRoute, private cache: MythicHeroesAggressiveCache) {}

  ngOnInit() {
    this.updateData();

    this.filteredOptions = this.heroNameFilterControl.valueChanges.pipe(
      startWith(''),
      mergeMap((value) => {
        this.nameParam = value != null ? value : '';
        this.updateData();
        return this.cache.collectBy('mythicHero', this.getHttpParams());
      })
    );
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
        this.heroSortParam = 'name,asc';
      } else if (sort.direction == 'desc') {
        this.heroSortParam = 'name,desc';
      } else {
        this.heroSortParam = undefined;
      }

      this.updateData();
    }
  }

  updateData() {
    this.isLoadingResults = true;
    forkJoin({
      heroes: this.cache.collectBy('mythicHero', this.getHttpParams()),
      factions: this.cache.getAll('faction'),
      rarities: this.cache.getAll('rarity'),
      types: this.cache.getAll('type'),
    }).subscribe((x) => {
      this.dataSource = new MatTableDataSource<MythicHeroesTableDataSource>(this.createDataSource(x));
      this.dataSource.paginator = this.paginator;
      this.isLoadingResults = false;
    });
  }

  heroAutocompleteDisplay(hero: MythicHero): string {
    return hero.name;
  }

  getHttpParams(): HttpParams {
    let params = new HttpParams()
      .set('name', this.nameParam)
      .set('factionName', this.factionNameParam)
      .set('rarityName', this.rarityNameParam)
      .set('typeName', this.typeNameParam);
    if (this.heroSortParam !== undefined) {
      params = params.set('sort', this.heroSortParam);
    }
    return params;
  }
}

export interface MythicHeroesTableDataSource {
  hero: MythicHero;
  faction: Observable<Faction>;
  rarity: Observable<Rarity>;
  type: Observable<Type>;
}
