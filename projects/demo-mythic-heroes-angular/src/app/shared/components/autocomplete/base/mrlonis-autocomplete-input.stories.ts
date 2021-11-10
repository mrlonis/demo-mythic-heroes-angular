import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCommonModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { MythicHero } from '../../../services/api/interfaces';
import {
  MrlonisAutocompleteInputComponent,
  MrlonisAutocompleteInputDataSource,
} from './mrlonis-autocomplete-input.component';

export default {
  title: 'NgxShared/ZotecAutocompleteInput',
  component: MrlonisAutocompleteInputComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        BrowserModule,
        FormsModule,
        MatButtonModule,
        MatSelectModule,
        MatTooltipModule,
        MatCommonModule,
        ReactiveFormsModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule,
      ],
    }),
  ],
} as Meta;

class StoryDataSource extends MrlonisAutocompleteInputDataSource<MythicHero> {
  loading = false;
  data: MythicHero[] = [
    {
      id: '1',
      name: 'Hello',
      imageUrl: '',
      factionId: '',
      rarityId: '',
      typeId: '',
      _links: {
        self: {
          href: '',
        },
        item: {
          href: '',
        },
        type: {
          href: '',
        },
        faction: {
          href: '',
        },
        rarity: {
          href: '',
        },
      },
    },
  ];

  getOptionText(option: MythicHero | string | null): string {
    if (option === null) {
      return '';
    }
    if (typeof option === 'string') {
      return option;
    }

    return (<MythicHero>option).name;
  }

  filter(value: string | MythicHero | null): MythicHero[] {
    let filterValue = '';

    if (value === null) {
      filterValue = '';
    } else if (typeof value === 'string') {
      filterValue = value;
    } else {
      filterValue = value.name;
    }

    return this.data.filter((option) => {
      return option.name.toLowerCase().includes(filterValue.toLowerCase());
    });
  }
}

const Template: Story<MrlonisAutocompleteInputComponent<MythicHero>> = (
  args: MrlonisAutocompleteInputComponent<MythicHero>
) => ({
  props: args,
  styles: ['@import "../../../../../../../../node_modules/@angular/material/prebuilt-themes/deeppurple-amber.css";'],
});

export const Primary = Template.bind({});
Primary.args = {
  data: new StoryDataSource(),
};

export const HasInput = Template.bind({});
HasInput.args = {
  data: new StoryDataSource(),
  startWith: 'Hello',
};
