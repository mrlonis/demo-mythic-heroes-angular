import { HttpClientModule } from '@angular/common/http';
import type { OnInit } from '@angular/core';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BaseResource, HeroService } from '../../../services';

@Component({
  standalone: true,
  selector: 'mrlonis-base-resource-display',
  styleUrls: ['base-resource-display.component.scss'],
  templateUrl: 'base-resource-display.component.html',
  imports: [HttpClientModule, RouterModule],
})
export class BaseResourceDisplayComponent implements OnInit {
  @Input() data!: BaseResource | null | undefined;

  heroService: HeroService;

  imageUrl = '';
  name = '';
  id = '';

  constructor(heroService: HeroService) {
    this.heroService = heroService;
  }

  ngOnInit() {
    console.log(this.data);
    this.imageUrl = this.data?.imageUrl ?? '';
    this.name = this.data?.name ?? '--';
    this.id = this.data?.id ?? '';
  }
}
