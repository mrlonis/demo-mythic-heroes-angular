import type { OnInit } from '@angular/core';
import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { BaseResource, HeroService } from '../../../services';

@Component({
  standalone: true,
  selector: 'mrlonis-base-resource-display',
  styleUrls: ['base-resource-display.component.scss'],
  templateUrl: 'base-resource-display.component.html',
  imports: [MatProgressSpinnerModule, RouterModule],
})
export class BaseResourceDisplayComponent implements OnInit {
  @Input() data: BaseResource | null;

  imageUrl = '';
  name = '';
  id = '';

  constructor(private heroService: HeroService) {
    this.data = null;
  }

  ngOnInit() {
    if (this.data != null) {
      this.imageUrl = this.data.imageUrl;
      this.name = this.data.name;
      this.id = this.data.id;
    }
  }

  getImageUrl(): string {
    return this.heroService.getImageUrl(this.imageUrl);
  }
}
