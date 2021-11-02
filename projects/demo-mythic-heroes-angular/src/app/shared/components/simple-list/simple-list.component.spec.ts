import { HttpParams } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MythicHero } from '../../../features/hero/hero.interface';
import { SpringDataRestResponse } from '../../../features/hero/spring-data-rest-response.interface';
import { SimpleListComponent, SimpleListComponentDataSource } from './simple-list.component';

class ExampleSimpleListDataSource extends SimpleListComponentDataSource<MythicHero, { a: string; b: string }> {
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

describe('SimpleListComponent', () => {
  let component: SimpleListComponent<MythicHero, { a: string; b: string }>;
  let fixture: ComponentFixture<SimpleListComponent<MythicHero, { a: string; b: string }>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, RouterTestingModule],
      declarations: [SimpleListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleListComponent) as unknown as ComponentFixture<
      SimpleListComponent<MythicHero, { a: string; b: string }>
    >;
    fixture.componentInstance.data = new ExampleSimpleListDataSource();
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
