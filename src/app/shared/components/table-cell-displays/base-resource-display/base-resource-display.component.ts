import { Component, Input, OnInit } from '@angular/core';
import { BaseResource } from '../../../services/api/interfaces';

@Component({
  selector: 'mrlonis-base-resource-display',
  styleUrls: ['base-resource-display.component.scss'],
  templateUrl: 'base-resource-display.component.html',
})
export class BaseResourceDisplayComponent implements OnInit {
  @Input() data!: BaseResource | null | undefined;

  imageUrl = '';
  name = '';
  id = '';

  ngOnInit() {
    console.log(this.data);
    this.imageUrl = this.data?.imageUrl ?? '';
    this.name = this.data?.name ?? '--';
    this.id = this.data?.id ?? '';
  }
}
