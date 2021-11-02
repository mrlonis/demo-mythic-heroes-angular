import { HttpParams } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AlwaysFilteredListComponent, AlwaysFilteredListComponentDataSource } from './always-filtered-list.component';

class ExampleAlwaysFilteredListDataSource extends AlwaysFilteredListComponentDataSource<
  MythicHero,
  { a: string; b: string }
> {
  displayedColumns: Array<'a' | 'b'> = ['a', 'b'];
  columnInfo = { a: { name: 'A' }, b: { name: 'B' } };
  /* eslint-disable @typescript-eslint/no-unused-vars */
  mapEntry(_x: MythicHero): { a: string; b: string; name: string } {
    return { a: 'a', b: 'b', name: 'example' };
  }
  getCollection(_index: number, _size: number, _params?: HttpParams): Observable<SpringDataRestResponse<MythicHero>> {
    const a: SpringDataRestResponse<MythicHero> = {
      resourceType: 'Bundle',
      type: 'collection',
      entry: [{ resource: { resourceType: 'fake' } }],
    };
    return of(a).pipe(delay(200));
  }
}

describe('AlwaysFilteredListComponent', () => {
  let component: AlwaysFilteredListComponent<MythicHero, { a: string; b: string }>;
  let fixture: ComponentFixture<AlwaysFilteredListComponent<MythicHero, { a: string; b: string }>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, RouterTestingModule],
      declarations: [AlwaysFilteredListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlwaysFilteredListComponent) as unknown as ComponentFixture<
      AlwaysFilteredListComponent<MythicHero, { a: string; b: string }>
    >;
    fixture.componentInstance.data = new ExampleAlwaysFilteredListDataSource();
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
