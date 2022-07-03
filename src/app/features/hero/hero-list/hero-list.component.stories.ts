import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { HeroService } from 'src/app/shared';
import { HeroListComponent } from './hero-list.component';

class StorybookHeroService {}

const heroService = null;

export default {
  title: 'mrlonis/HeroListComponent',
  component: HeroListComponent,
  decorators: [
    moduleMetadata({
      imports: [HeroListComponent],
      providers: [{ provide: HeroService, useValue: heroService }],
    }),
  ],
} as Meta;

const Template: Story<HeroListComponent> = (args: HeroListComponent) => ({
  props: args,
});

export const Default = Template.bind({});
Default.args = {};
