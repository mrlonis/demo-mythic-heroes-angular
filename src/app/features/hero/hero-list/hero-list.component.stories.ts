import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { HeroListComponent } from './hero-list.component';

export default {
  title: 'mrlonis/HeroListComponent',
  component: HeroListComponent,
  decorators: [
    moduleMetadata({
      imports: [HeroListComponent, HttpClientTestingModule],
    }),
  ],
} as Meta;

const Template: Story<HeroListComponent> = (args: HeroListComponent) => ({
  props: args,
});

export const Default = Template.bind({});
Default.args = {};
