import { ComponentType } from '@angular/cdk/portal';
import { HttpParams } from '@angular/common/http';
import { Component, ContentChildren, EventEmitter, Input, OnInit, Output, QueryList } from '@angular/core';
import { DateRange } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { merge, Observable, ReplaySubject, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MythicHero } from '../../../features/hero/hero.interface';
import { RichColumnDirective, RichRowDirective, SimpleListComponentDataSource } from '../simple-list/simple-list.component';

export function purifyDateRange(x: null | undefined | DateRange<Date>): undefined | DateRange<Date> {
  function purifyDate(x: undefined | Date | string | null): Date | null {
    if (x == null) return null;
    const att = new Date(x);
    if (isNaN(att.getTime())) return null;
    return att;
  }
  if (x == null || x == undefined) return undefined;
  const d1 = purifyDate(x.start);
  const d2 = purifyDate(x.end);
  if (d1 == null && d2 == null) return undefined;
  return new DateRange<Date>(d1, d2);
}
export function purifyDateAt(
  filterChoices: {
    [key: string]: undefined | FilterChoices[keyof FilterChoices];
  },
  key: string,
  strict: boolean
): void {
  if (typeof filterChoices[key] === 'object') {
    const ob = filterChoices[key] as unknown as {
      range: DateRange<Date>;
    };
    const tempres = purifyDateRange(ob.range);
    if ((strict && (tempres?.start == null || tempres?.end == null)) || tempres == undefined) filterChoices[key] = undefined;
    else ob.range = tempres;
  }
}

export type FilterChoices = {
  dropdown: string;
  text: string;
  relativedate: {
    option: string;
    range: DateRange<Date> | null;
  };
};

export interface FilterChoice<TYPE extends keyof FilterChoices> {
  name: string;
  key: string;
  type: TYPE;
  options?: { [key: string]: string };
  disabled: () => boolean;
  notifyUpdate?: (sel?: FilterChoices[TYPE]) => boolean | undefined;
  applyFilter: (sel: FilterChoices[TYPE], params: HttpParams) => HttpParams;
}

export abstract class FilterableListComponentDataSource<
  ObjectType extends MythicHero,
  ColumnType extends {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    [key: string]: string | Observable<string> | Observable<number> | { type: 'rich'; data: any };
  },
  ModalData = unknown
> extends SimpleListComponentDataSource<ObjectType, ColumnType> {
  abstract appropriateModal?: ComponentType<unknown>;
  updateFilterOptions$ = new ReplaySubject<Array<FilterChoice<keyof FilterChoices>>>();
  updateFilterOptions<TYPE extends keyof FilterChoices>(arr: Array<FilterChoice<TYPE>>): void {
    this.updateFilterOptions$.next(arr as unknown as FilterChoice<keyof FilterChoices>[]);
  }
  getModalData(): ModalData | undefined {
    return undefined;
  }
}

@Component({
  selector: 'mrlonis-filterable-list',
  templateUrl: './filterable-list.component.html',
  styleUrls: ['./filterable-list.component.scss'],
})
export class FilterableListComponent<
  ObjectType extends MythicHero,
  ColumnType extends {
    [key: string]: string | Observable<string> | Observable<number> | { type: 'rich'; data: any };
  }
> implements OnInit
{
  @Input() pageTitle!: string;
  @Input() addModalText!: string;
  @Input() modalWidth?: string;
  @Input() filterStyle: 'explicit' | 'casual' = 'explicit';

  @Input() data!: FilterableListComponentDataSource<ObjectType, ColumnType>;

  filtering = false;
  consumedQueryFilters = false;
  filterChoices: {
    [key: string]: undefined | FilterChoices[keyof FilterChoices];
  } = {};
  filters?: Array<FilterChoice<keyof FilterChoices>>;

  searchSub$ = new Subject<string>();
  searchSubUrgent$ = new Subject<string>();

  @Input() additionalRows = 0;
  @Output() contentRefresh = new EventEmitter();

  @ContentChildren(RichColumnDirective)
  richColumnQuery!: QueryList<RichColumnDirective>;
  @ContentChildren(RichRowDirective)
  richRowQuery!: QueryList<RichRowDirective>;
  constructor(private router: Router, public route: ActivatedRoute, public dialog: MatDialog) {}

  openDialog(): void {
    if (this.data.appropriateModal == undefined) return;
    const dialogRef = this.dialog.open(this.data.appropriateModal, {
      width: this.modalWidth,
      data: {
        route: this.route,
        data: this.data.getModalData(),
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.data.refreshData();
    });
  }
  setfiltering(val: boolean): void {
    this.filtering = val;
    if (val == false) {
      this.filterChoices = {};
      if (this.filters?.some((x) => x.notifyUpdate?.())) {
        return;
      }
      this.refreshFilters();
    }
  }
  ngOnInit(): void {
    merge(this.searchSub$.pipe(debounceTime(400)), this.searchSubUrgent$)
      .pipe(distinctUntilChanged())
      .subscribe((query) => {
        this.data.updateSearch(query);
      });
    this.data.updateFilterOptions$.subscribe((x) => {
      this.filters = x;
      this.refreshFilters();
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
    this.refreshFilters();
  }
  refreshFilters(): void {
    if (!this.consumedQueryFilters) {
      this.consumedQueryFilters = true;
      let foundFilter = false;
      const defaults = <{ [key: string]: string }>this.route.snapshot.queryParams;
      this.filters?.forEach((filter) => {
        if (defaults[filter.key] != undefined) {
          this.filterChoices[filter.key] = defaults[filter.key];
          foundFilter = true;
        }
      });
      if (foundFilter) {
        if (this.filterStyle == 'explicit') {
          this.filtering = true;
        }
        if (this.filters?.some((x) => x.notifyUpdate?.(this.filterChoices[x.key]))) {
          return;
        }
      }
    }
    //this.route.snapshot.queryParams
    this.data.updateFilters(
      this.filters?.some((x) => this.filterChoices[x.key])
        ? (params) => {
            this.filters?.forEach((x) => {
              const choice = this.filterChoices[x.key];
              if (choice != undefined) {
                params = x.applyFilter(choice, params);
              }
            });
            return params;
          }
        : undefined
    );
  }

  searchEntries(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.searchSub$.next(searchTerm);
  }

  searchEntriesUrgent(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.searchSubUrgent$.next(searchTerm);
  }
}
