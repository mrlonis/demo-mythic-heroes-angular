import { RouterTestingModule } from '@angular/router/testing';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { NavigationComponentComponent } from './navigation.component';

export default {
  title: 'mrlonis/NavigationComponentComponent',
  component: NavigationComponentComponent,
  decorators: [
    moduleMetadata({
      imports: [NavigationComponentComponent, RouterTestingModule],
    }),
  ],
} as Meta;

const Template: Story<NavigationComponentComponent> = (args: NavigationComponentComponent) => ({
  props: args,
});

export const Default = Template.bind({});
Default.args = {};
