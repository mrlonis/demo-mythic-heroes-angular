import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import ButtonComponent from './button.component';
import HeaderComponent from './header.component';
import PageComponent from './page.component';

@NgModule({
  declarations: [ButtonComponent, HeaderComponent, PageComponent],
  imports: [CommonModule],
})
export class StorybookmoduleModule {}
