import type { OnInit } from '@angular/core';
import { Component, Input } from '@angular/core';
import { BaseResource, HeroService } from '../../../services';

@Component({
  selector: 'mrlonis-base-resource-display',
  styleUrls: ['base-resource-display.component.scss'],
  templateUrl: 'base-resource-display.component.html',
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
