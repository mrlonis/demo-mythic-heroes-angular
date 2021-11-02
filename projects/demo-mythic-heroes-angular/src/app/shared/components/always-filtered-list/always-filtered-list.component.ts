import { Component, ContentChildren, EventEmitter, Input, OnInit, Output, QueryList } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs';
import { MythicHero } from '../../../features/hero/hero.interface';
import { LocalStorageService } from '../../services';
import { FilterChoice, FilterChoices, purifyDateAt } from '../filterable-list/filterable-list.component';
import { RichColumnDirective, RichRowDirective, SimpleListComponentDataSource } from '../simple-list/simple-list.component';

export abstract class AlwaysFilteredListComponentDataSource<
  ObjectType extends MythicHero,
  ColumnType extends {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    [key: string]: string | Observable<string> | Observable<number> | { type: 'rich'; data: any };
  }
> extends SimpleListComponentDataSource<ObjectType, ColumnType> {
  storageKey?: string = undefined;
  updateFilterOptions$ = new ReplaySubject<Array<Array<FilterChoice<keyof FilterChoices>>>>();
  updateFilterOptions<TYPE extends keyof FilterChoices>(arr: Array<Array<FilterChoice<TYPE>>>): void {
    this.updateFilterOptions$.next(arr as unknown as FilterChoice<keyof FilterChoices>[][]);
  }
}

@Component({
  selector: 'mrlonis-always-filtered-list',
  templateUrl: './always-filtered-list.component.html',
  styleUrls: ['./always-filtered-list.component.scss'],
})
export class AlwaysFilteredListComponent<
  ObjectType extends MythicHero,
  ColumnType extends {
    [key: string]: string | Observable<string> | Observable<number> | { type: 'rich'; data: any };
  }
> implements OnInit
{
  @Input() data!: AlwaysFilteredListComponentDataSource<ObjectType, ColumnType>;

  consumedQueryFilters = false;
  filterChoices: {
    [key: string]: undefined | FilterChoices[keyof FilterChoices];
  } = {};
  filters?: Array<Array<FilterChoice<keyof FilterChoices>>>;

  @Input() pageTitle!: string;

  @Input() additionalRows = 0;
  @Output() contentRefresh = new EventEmitter();

  @ContentChildren(RichColumnDirective)
  richColumnQuery!: QueryList<RichColumnDirective>;
  @ContentChildren(RichRowDirective)
  richRowQuery!: QueryList<RichRowDirective>;
  constructor(
    private router: Router,
    public route: ActivatedRoute,
    public dialog: MatDialog,
    private storage: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.data.updateFilterOptions$.subscribe((x) => {
      this.filters = x;
      this.applyFilters();
    });
  }
  getstring(key: string): string {
    return this.filterChoices[key] as string;
  }
  getreldate(key: string): undefined | FilterChoices['relativedate'] {
    return this.filterChoices[key] as FilterChoices['relativedate'];
  }
  setfilter<TYPE extends keyof FilterChoices>(
    filter: FilterChoice<TYPE>,
    choiceW?: FilterChoices[keyof FilterChoices]
  ): void {
    let choice = choiceW as undefined | FilterChoices[TYPE];
    if (choice == '') choice = undefined;
    this.filterChoices[filter.key] = choice;
    purifyDateAt(this.filterChoices, filter.key, false);
    if (filter.notifyUpdate?.(this.filterChoices[filter.key] as undefined | FilterChoices[TYPE])) return;
  }
  clearFilters(): void {
    this.filterChoices = {};
    this.filters?.forEach((x) => x.forEach((y) => y.notifyUpdate?.()));
    this.applyFilters();
  }
  applyFilters(): void {
    if (!this.consumedQueryFilters) {
      this.consumedQueryFilters = true;
      if (this.data.storageKey != undefined) {
        this.filterChoices = this.storage.get(this.data.storageKey + '-filters', this.filterChoices) ?? this.filterChoices;
        Object.keys(this.filterChoices).forEach((key) => {
          purifyDateAt(this.filterChoices, key, true);
        });
      }
      const defaultsQuery = <{ [key: string]: string }>this.route.snapshot.queryParams;
      const defaults = <{ [key: string]: string }>this.route.snapshot.params;
      this.filters?.forEach((filters) => {
        filters.forEach((filter) => {
          if (defaults[filter.key] != undefined) {
            this.filterChoices[filter.key] = defaults[filter.key];
          } else if (defaultsQuery[filter.key] != undefined) {
            this.filterChoices[filter.key] = defaultsQuery[filter.key];
          }
        });
      });
      this.filters?.forEach((x) => x.forEach((y) => y.notifyUpdate?.(this.filterChoices[y.key])));
    }
    if (this.data.storageKey != undefined) {
      this.storage.set(this.data.storageKey + '-filters', this.filterChoices);
    }
    //this.route.snapshot.queryParams
    this.data.updateFilters(
      this.filters?.some((x) => x.some((y) => this.filterChoices[y.key]))
        ? (params) => {
            this.filters?.forEach((x) => {
              x.forEach((y) => {
                const choice = this.filterChoices[y.key];
                if (choice != undefined) {
                  params = y.applyFilter(choice, params);
                }
              });
            });
            return params;
          }
        : undefined
    );
  }
}
