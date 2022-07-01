// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { ApiConfigProvider, API_CONFIG_TOKEN } from '../../../shared';
import { HeroDetailComponent } from './hero-detail.component';

export default {
  title: 'mrlonis/HeroDetailComponent',
  component: HeroDetailComponent,
  decorators: [
    moduleMetadata({
      imports: [HeroDetailComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        {
          provide: API_CONFIG_TOKEN,
          useValue: {
            apiUrl: 'http://localhost:9001/api',
          } as ApiConfigProvider,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '1' }),
            },
          },
        },
      ],
    }),
  ],
} as Meta;

const Template: Story<HeroDetailComponent> = (args: HeroDetailComponent) => ({
  props: args,
});

export const Default = Template.bind({});
Default.args = {};
