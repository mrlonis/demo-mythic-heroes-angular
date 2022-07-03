import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { componentWrapperDecorator, Meta, moduleMetadata, Story } from '@storybook/angular';
import { ApiConfigProvider, API_CONFIG_TOKEN } from '../../../services';
import { BaseResource } from '../../../types';
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
      imports: [BaseResourceDisplayComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        {
          provide: API_CONFIG_TOKEN,
          useValue: {
            apiUrl: 'http://localhost:9001/api',
          } as ApiConfigProvider,
        },
      ],
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
  name: 'Lucifer',
  imageUrl: 'mythicHeroes/Lucifer.png',

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
