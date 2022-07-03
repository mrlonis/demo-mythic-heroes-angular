import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { MythicHeroesApiService } from '../../../shared';
import { HeroListComponent } from './hero-list.component';

class StorybookHeroService {}

const api = null;

export default {
  title: 'mrlonis/HeroListComponent',
  component: HeroListComponent,
  decorators: [
    moduleMetadata({
      imports: [HeroListComponent],
      providers: [{ provide: MythicHeroesApiService, useValue: api }],
    }),
  ],
} as Meta;

const Template: Story<HeroListComponent> = (args: HeroListComponent) => ({
  props: args,
});

export const Default = Template.bind({});
Default.args = {};
