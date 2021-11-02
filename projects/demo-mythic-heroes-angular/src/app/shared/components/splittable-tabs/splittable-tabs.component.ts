/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AfterContentInit,
  Component,
  ContentChildren,
  Directive,
  EventEmitter,
  Input,
  Output,
  QueryList,
  TemplateRef,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Directive({
  selector: '[mrlonisSplitTabGroup]',
})
export class SplitTabGroupDirective {
  @Input() tabName!: string;
  @Input() visible = true;
  @Input() toggleable = false;
  @Input() closeable = false;
  @Input() side: 'left' | 'right' = 'left';
  @Output() closed = new EventEmitter<unknown>();
  constructor(public templateRef: TemplateRef<any>) {}
}

@Component({
  selector: 'mrlonis-splittable-tabs',
  templateUrl: './splittable-tabs.component.html',
  styleUrls: ['./splittable-tabs.component.scss'],
})
export class SplittableTabsComponent implements AfterContentInit {
  @ContentChildren(SplitTabGroupDirective)
  sectionDirs!: QueryList<SplitTabGroupDirective>;
  sections!: SplitTabGroupDirective[];
  @Input() disabled = false;

  constructor(public dialog: MatDialog) {}

  ngAfterContentInit(): void {
    const ab = this.sectionDirs.toArray();
    this.sections = ab;
  }

  slots(): Array<string> {
    let leftFound = false;
    let rightFound = false;

    this.sections.forEach((x) => {
      if (x.visible) {
        if (x.side == 'left') {
          leftFound = true;
        } else if (x.side == 'right') {
          rightFound = true;
        }
      }
    });

    if (leftFound && rightFound) {
      return ['left', 'right'];
    }

    if (leftFound) {
      return ['left'];
    }

    if (rightFound) {
      return ['right'];
    }

    return [];
  }
}
