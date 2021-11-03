import { HttpParams } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { BaseResource } from '../../services/api/interfaces';
import { AlternativeListComponent, AlternativeListComponentDataSource } from './alternative-list.component';

class ExampleAlternativeListDataSource extends AlternativeListComponentDataSource<BaseResource, { a: string; b: string }> {
  displayedColumns: Array<'a' | 'b'> = ['a', 'b'];
  columnInfo = { a: { name: 'A' }, b: { name: 'B' } };
  /* eslint-disable @typescript-eslint/no-unused-vars */
  mapEntry(_x: BaseResource): { a: string; b: string; name: string } {
    return { a: 'a', b: 'b', name: 'example' };
  }
  getCollection(_params?: HttpParams): Observable<BaseResource[]> {
    const a: BaseResource[] = [
      { id: 'id', name: 'name', imageUrl: 'imageUrl', _links: { self: { href: '' }, item: { href: '' } } },
    ];
    return of(a).pipe(delay(200));
  }
}

describe('AlternativeListComponent', () => {
  let component: AlternativeListComponent<BaseResource, { a: string; b: string }>;
  let fixture: ComponentFixture<AlternativeListComponent<BaseResource, { a: string; b: string }>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, RouterTestingModule],
      declarations: [AlternativeListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlternativeListComponent) as unknown as ComponentFixture<
      AlternativeListComponent<BaseResource, { a: string; b: string }>
    >;
    fixture.componentInstance.data = new ExampleAlternativeListDataSource();
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
