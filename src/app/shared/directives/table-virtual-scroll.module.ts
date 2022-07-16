import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgModule } from '@angular/core';
import { TableItemSizeDirective } from './table-item-size.directive';

@NgModule({
  declarations: [TableItemSizeDirective],
  imports: [ScrollingModule],
  exports: [ScrollingModule, TableItemSizeDirective],
})
export class TableVirtualScrollModule {}
