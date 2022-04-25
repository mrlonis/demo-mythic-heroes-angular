// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { RouterTestingModule } from '@angular/router/testing';
import { componentWrapperDecorator, moduleMetadata } from '@storybook/angular';
import { Meta, Story } from '@storybook/angular/types-6-0';
import { BaseResource } from '../../../services/api/interfaces';
import { BaseResourceDisplayComponent } from './base-resource-display.component';

export default {
  title: 'mrlonis/BaseResourceDisplayComponent',
  component: BaseResourceDisplayComponent,
  decorators: [
    componentWrapperDecorator((story) => {
      console.log(story);
      return `<div style="margin: 3em">${story}</div>`;
    }),
    moduleMetadata({
      declarations: [BaseResourceDisplayComponent],
      imports: [RouterTestingModule],
    }),
  ],
} as Meta;

const Template: Story<BaseResourceDisplayComponent> = (args: BaseResourceDisplayComponent) => ({
  props: args,
});

export const Default = Template.bind({});
Default.args = {
  data: null,
};

const baseResource: BaseResource = {
  id: 'fake id',
  name: 'fake name',
  imageUrl: 'https://www.mythicheroes.com/wp-content/uploads/2021/08/tinyprofile-5-120x120.png',

  _links: {
    self: {
      href: 'fake url',
    },
    item: {
      href: 'fake url',
    },
  },
};
export const ValidData = Template.bind({});
ValidData.args = {
  data: baseResource,
};
