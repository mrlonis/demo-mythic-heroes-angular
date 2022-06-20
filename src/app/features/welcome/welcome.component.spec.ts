import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { WelcomeComponent } from './welcome.component';
import { WelcomeModule } from './welcome.module';

describe('WelcomeComponent', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomeModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
