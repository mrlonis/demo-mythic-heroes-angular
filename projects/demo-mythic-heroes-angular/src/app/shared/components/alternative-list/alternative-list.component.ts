import { ComponentType } from '@angular/cdk/portal';
import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { MythicHero } from '../../hero.interface';
import { FilterChoice, FilterChoices, purifyDateAt } from '../filterable-list/filterable-list.component';

export abstract class AlternativeListComponentDataSource<
  ObjectType extends MythicHero,
  ColumnType extends {
    [key: string]: string | Observable<string> | Observable<number>;
  },
  ModalData = unknown
> {
  appropriateModal?: ComponentType<unknown>;
  refreshSubject$ = new Subject();
  updateFilterOptions$ = new ReplaySubject<Array<FilterChoice<keyof FilterChoices>>>();
  canInformCache = true;
  abstract displayedColumns: Array<keyof ColumnType & string>;
  abstract columnInfo: {
    [K in keyof ColumnType]: {
      name: string;
    };
  };
  abstract mapEntry(x: ObjectType): ColumnType & { name: string };
  abstract getCollection(params?: HttpParams): Observable<Array<ObjectType>>;
  click(router: Router, route: ActivatedRoute, id: string): void {
    void router.navigate([id], { relativeTo: route });
  }
  refreshData(): void {
    this.refreshSubject$.next();
  }
  updateFilterOptions<TYPE extends keyof FilterChoices>(arr: Array<FilterChoice<TYPE>>): void {
    this.updateFilterOptions$.next(arr as unknown as FilterChoice<keyof FilterChoices>[]);
  }
  getModalData(): ModalData | undefined {
    return undefined;
  }
}
@Component({
  selector: 'mrlonis-alternative-list',
  templateUrl: './alternative-list.component.html',
  styleUrls: ['./alternative-list.component.scss'],
})
export class AlternativeListComponent<
  ObjectType extends MythicHero,
  ColumnType extends {
    [key: string]: string | Observable<string> | Observable<number>;
  }
> implements OnInit
{
  @Input() pageTitle!: string;
  @Input() pagedesc!: string;
  @Input() addModalText = '';
  @Input() imageUrl!: string;
  @Input() backtext = '';
  @Input() pagesubtitle = ' ';
  @Input() modalWidth?: string;

  @Input() data!: AlternativeListComponentDataSource<ObjectType, ColumnType>;

  filterChoices: {
    [key: string]: undefined | FilterChoices[keyof FilterChoices];
  } = {};
  filters?: Array<FilterChoice<keyof FilterChoices>>;

  dataSource: Array<ColumnType & { name: string; id: string }> = [];

  isLoadingResults = true;
  filter?: (params: HttpParams) => HttpParams;

  @Output() contentRefresh = new EventEmitter();

  constructor(public router: Router, public route: ActivatedRoute, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.data.refreshSubject$.subscribe(() => {
      this.refreshData();
    });
    this.data.updateFilterOptions$.subscribe((x) => {
      this.filters = x;
      this.refreshFilters();
    });
    this.refreshData();
  }

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
    this.filter = this.filters?.some((x) => this.filterChoices[x.key])
      ? (params) => {
          this.filters?.forEach((x) => {
            const choice = this.filterChoices[x.key];
            if (choice != undefined) {
              params = x.applyFilter(choice, params);
            }
          });
          return params;
        }
      : undefined;
    this.refreshData();
  }

  refreshData(): void {
    this.isLoadingResults = true;
    let params: HttpParams = new HttpParams().set('_total', 'accurate');
    if (this.filter) {
      params = this.filter(params);
    }
    this.data.getCollection(params).subscribe((response) => {
      this.contentRefresh.emit();
      this.isLoadingResults = false;
      const locations = response.map((entry) => {
        const ret: ColumnType & { name: string; id?: string } = this.data.mapEntry(entry);
        ret.id = entry.id;
        return ret as ColumnType & { name: string; id: string };
      });
      this.dataSource = locations;
    });
  }
  isString(value: string | Observable<string> | Observable<number>): value is string {
    return typeof value == 'string' || value instanceof String;
  }
  toObservable(value: string | Observable<string> | Observable<number>): Observable<string> {
    return value as Observable<string>;
  }
}
