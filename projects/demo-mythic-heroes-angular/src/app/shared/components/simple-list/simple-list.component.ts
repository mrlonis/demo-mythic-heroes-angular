import { HttpParams } from '@angular/common/http';
import {
  AfterContentInit,
  Component,
  ContentChildren,
  Directive,
  EventEmitter,
  Injectable,
  Input,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
} from '@angular/core';
import { MatMenu, MatMenuPanel } from '@angular/material/menu';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, merge, Observable, ReplaySubject, Subject, timer } from 'rxjs';
import { distinctUntilChanged, mapTo, mergeMap, share, startWith, takeUntil, tap, throttleTime } from 'rxjs/operators';
import { MythicHero } from '../../hero.interface';
import { SpringDataRestResponse } from '../../spring-data-rest-response.interface';

@Directive({
  selector: '[mrlonisListMenu]',
})
export class ListMenuDirective implements OnInit {
  @Input() mrlonisListMenu!: string;
  constructor(private matmenu: MatMenu, private linker: ListMenuLinker) {}
  ngOnInit(): void {
    this.linker.data[this.mrlonisListMenu] = this.matmenu as MatMenuPanel<unknown>;
  }
}
@Injectable()
class ListMenuLinker {
  data: { [name: string]: MatMenuPanel<unknown> } = {};
}
@Directive({
  selector: '[mrlonisMenuProvider]',
  exportAs: 'mrlonisMenuProvider',
  providers: [ListMenuLinker],
})
export class ListMenuProviderDirective {
  constructor(public linker: ListMenuLinker) {}
}

@Directive({
  selector: '[mrlonisListRichColumn]',
})
export class RichColumnDirective {
  @Input() mrlonisListRichColumnName!: string;
  constructor(public templateRef: TemplateRef<unknown>) {}
}
@Directive({
  selector: '[mrlonisListRichRow]',
})
export class RichRowDirective {
  @Input() mrlonisListRichRowName!: string;
  constructor(public templateRef: TemplateRef<unknown>) {}
}

export type MenuBlock<ColumnType> = Array<{
  name: string;
  action: MenuBlock<ColumnType> | ((col: ColumnType & { id: string }) => void);
}>;
type SerializedMenu<ColumnType> = {
  name: string;
  options: Array<{
    name: string;
    action:
      | {
          submenu: string;
          func: never;
        }
      | {
          submenu: never;
          func: (col: ColumnType & { id: string }) => void;
        };
  }>;
};

export abstract class SimpleListComponentDataSource<
  ObjectType extends MythicHero,
  ColumnType extends {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    [key: string]: string | Observable<string> | Observable<number> | { type: 'rich'; data: any };
  }
> {
  clickable = true;
  refreshSubject$ = new Subject();
  markRowCustom$ = new Subject<string>();
  setMenuEnding$ = new ReplaySubject<MenuBlock<ColumnType>>(1);
  updateSearch$ = new ReplaySubject<string>();
  updateFilters$ = new ReplaySubject<(params: HttpParams) => HttpParams>();
  canInformCache = true;
  abstract displayedColumns: Array<keyof ColumnType & string>;
  abstract columnInfo: {
    [K in keyof ColumnType]: {
      name: string;
      sortable?: boolean;
      width?: string;
    };
  };
  hidePaginator = false;
  rowEndings: 'none' | 'arrow' | 'menu' = 'menu';
  selectedIds: { [id: string]: boolean } = {};
  total?: number;
  constructor(
    private informCache?: (
      observable: Observable<SpringDataRestResponse<ObjectType>>
    ) => Observable<SpringDataRestResponse<ObjectType>>
  ) {}
  abstract mapEntry(x: ObjectType): ColumnType;
  abstract getCollection(index?: number, size?: number, params?: HttpParams): Observable<SpringDataRestResponse<ObjectType>>;
  informCacheOnResponse(
    observable: Observable<SpringDataRestResponse<ObjectType>>
  ): Observable<SpringDataRestResponse<ObjectType>> {
    return this.canInformCache && this.informCache != undefined ? this.informCache(observable) : observable;
  }
  click(router: Router, route: ActivatedRoute, id: string): void {
    void router.navigate([id], { relativeTo: route });
  }
  refreshData(): void {
    this.refreshSubject$.next();
  }
  markRowCustom(id: string): void {
    this.markRowCustom$.next(id);
  }
  setMenuEnding(menu?: MenuBlock<ColumnType>): void {
    this.setMenuEnding$.next(menu);
  }
  updateSearch(query: string): void {
    this.updateSearch$.next(query);
  }
  updateFilters(filter?: (params: HttpParams) => HttpParams): void {
    this.updateFilters$.next(filter);
  }
}
@Component({
  selector: 'mrlonis-simple-list',
  templateUrl: './simple-list.component.html',
  styleUrls: ['./simple-list.component.scss'],
})
export class SimpleListComponent<
  ObjectType extends MythicHero,
  ColumnType extends {
    [key: string]: string | Observable<string> | Observable<number> | { type: 'rich'; data: any };
  }
> implements OnInit, AfterContentInit
{
  @Input() data!: SimpleListComponentDataSource<ObjectType, ColumnType>;

  bundle?: SpringDataRestResponse<ObjectType>;
  dataSource: MatTableDataSource<{ customRow: false; item: ColumnType & { id: string } } | { customRow: true }> =
    new MatTableDataSource();

  isLoadingResults = false;

  _additionalRows = 0;

  pageSize = 10;
  pageIndex$ = new ReplaySubject<number>();
  pageSize$ = new ReplaySubject<number>();
  sortScheme$ = new ReplaySubject<string>();

  @Output() contentRefresh = new EventEmitter();

  @ContentChildren(RichColumnDirective)
  richColumnQuery!: QueryList<RichColumnDirective>;
  @Input() richColumnList: Array<RichColumnDirective> = [];
  richColumns: { [key: string]: RichColumnDirective } = {};
  @ContentChildren(RichRowDirective)
  richRowQuery!: QueryList<RichRowDirective>;
  @Input() richRowList: Array<RichRowDirective> = [];
  richRows: { [key: string]: RichRowDirective } = {};

  serializedMenu: Array<SerializedMenu<ColumnType>> = [];
  serializedMenus = 0;
  constructor(public router: Router, public route: ActivatedRoute) {
    this.pageIndex$.next(1);
    this.pageSize$.next(10);
  }
  @Input() set additionalRows(additionalRows: number) {
    this._additionalRows = additionalRows;
    this.addCustomRows();
  }

  sortChanged(event: Sort): void {
    this.pageIndex$.next(1);
    this.sortScheme$.next(event.direction ? (event.direction === 'desc' ? '-' : '') + event.active : '');
  }
  pageChanged(event: { pageSize: number; pageIndex: number }): void {
    this.pageIndex$.next(event.pageIndex);
    this.pageSize$.next(event.pageSize);
  }

  ngOnInit(): void {
    if (this.data.hidePaginator) this.pageSize$.next(1);
    this.data.markRowCustom$.subscribe((id) => {
      this.markCustomRow(id);
    });

    this.data.setMenuEnding$.subscribe((menu) => {
      this.serializedMenu = [];
      this.serializedMenus = 0;
      if (menu) this.serializeMenu(menu, 'menu');
    });
    combineLatest([
      combineLatest([
        this.pageIndex$.pipe(distinctUntilChanged()),
        this.pageSize$.pipe(
          distinctUntilChanged(),
          tap((x) => {
            this.pageSize = x;
          })
        ),
        this.sortScheme$.pipe(startWith(''), distinctUntilChanged()),
        this.data.updateFilters$.pipe(
          startWith(undefined),
          tap(() => {
            this.pageIndex$.next(1);
          }),
          distinctUntilChanged()
        ),
        this.data.updateSearch$.pipe(
          startWith(''),
          tap(() => {
            this.pageIndex$.next(1);
          }),
          distinctUntilChanged()
        ),
      ]).pipe(throttleTime(40, undefined, { trailing: true }), distinctUntilChanged()),
      this.data.refreshSubject$.pipe(startWith(undefined)),
    ])
      .pipe(
        mergeMap(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ([[pageIndex, pageSize, sortScheme, filter, searchText], _]) => {
            let params: HttpParams = new HttpParams();
            if (sortScheme) params = params.set('_sort', sortScheme);
            if (searchText.length) params = params.set('name:in', searchText);
            if (filter) params = filter(params);
            if (!searchText.length && filter == undefined) {
              this.data
                .informCacheOnResponse(
                  this.data.getCollection(pageIndex, pageSize, params.set('_total', 'accurate').set('_summary', 'count'))
                )
                .subscribe((response) => {
                  this.data.total = response.page.totalElements;
                });

              return this.showLoading(
                this.data.informCacheOnResponse(this.data.getCollection(pageIndex, pageSize, params.delete('_total')))
              );
            } else {
              this.data
                .getCollection(pageIndex, pageSize, params.set('_total', 'accurate').set('_summary', 'count'))
                .subscribe((response) => {
                  this.data.total = response.page.totalElements;
                });

              return this.showLoading(this.data.getCollection(pageIndex, pageSize, params.delete('_total')));
            }
          }
        )
      )
      .subscribe((response) => {
        this.contentRefresh.emit();
        this.bundle = response;
        const locations = response._embedded.data.map((entry) => {
          const ret: ColumnType & { id?: string } = this.data.mapEntry(entry);
          ret.id = entry.id;
          return {
            customRow: false,
            item: ret,
          } as {
            customRow: false;
            item: ColumnType & { id: string };
          };
        });
        this.dataSource.data = locations;
        this.addCustomRows();
      });
  }

  showLoading(
    collectionRequest: Observable<SpringDataRestResponse<ObjectType>>
  ): Observable<SpringDataRestResponse<ObjectType>> {
    const listResult$ = collectionRequest.pipe(share());

    const showLoadingIndicator$ = merge(
      timer(1000).pipe(mapTo(true), takeUntil(listResult$)),
      combineLatest([listResult$, timer(2000)]).pipe(mapTo(false))
    ).pipe(startWith(false), distinctUntilChanged());

    showLoadingIndicator$.subscribe((isLoading) => {
      this.isLoadingResults = isLoading;
    });

    return listResult$;
  }

  serializeMenu(menu: MenuBlock<ColumnType>, name: string): void {
    this.serializedMenus++;
    this.serializedMenu.push({
      name: name,
      options: menu.map((item) => {
        if (typeof item.action === 'function') {
          return {
            name: item.name,
            action: { func: item.action } as {
              submenu: never;
              func: (id: ColumnType & { id: string }) => void;
            },
          };
        } else {
          const uniquename = `submenu${this.serializedMenus}`;
          this.serializeMenu(item.action, uniquename);
          return {
            name: item.name,
            action: { submenu: uniquename } as { submenu: string; func: never },
          };
        }
      }),
    });
  }

  ngAfterContentInit(): void {
    this.richColumnQuery
      .toArray()
      .concat(this.richColumnList)
      .forEach((x) => {
        this.richColumns[x.mrlonisListRichColumnName] = x;
      });
    this.richRowQuery
      .toArray()
      .concat(this.richRowList)
      .forEach((x) => {
        this.richRows[x.mrlonisListRichRowName] = x;
      });
  }
  addCustomRows(): void {
    this.dataSource.data = this.dataSource.data
      .filter((x) => !x.customRow)
      .concat(new Array(this._additionalRows).fill({ customRow: true }));
  }
  markCustomRow(id: string): void {
    this.dataSource.data = this.dataSource.data.map((record) => {
      if (!record.customRow && record.item.id == id) {
        record = { customRow: true };
      }
      return record;
    });
  }
  isString(value: string | Observable<string> | Observable<number> | { type: 'rich' }): value is string {
    return typeof value == 'string' || value instanceof String;
  }
  isRich(value: string | Observable<string> | Observable<number> | { type: 'rich' }): boolean {
    return !this.isString(value) && 'type' in value && value.type == 'rich';
  }
  getDisplayedColumns(): Array<string> {
    if (this.data.rowEndings == 'none') {
      return this.data.displayedColumns;
    }
    return this.data.displayedColumns.concat(['end-symbol']);
  }
  silence(event: MouseEvent): void {
    event.stopPropagation();
  }
}
