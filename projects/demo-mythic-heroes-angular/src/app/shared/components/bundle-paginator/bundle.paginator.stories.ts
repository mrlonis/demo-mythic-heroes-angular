// /* eslint-disable @typescript-eslint/no-unsafe-member-access */
// /* eslint-disable @typescript-eslint/no-unsafe-call */
// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
// import { CommonModule } from '@angular/common';
// import { MatButtonModule } from '@angular/material/button';
// import { MatCommonModule } from '@angular/material/core';
// import { MatSelectModule } from '@angular/material/select';
// import { MatTooltipModule } from '@angular/material/tooltip';
// import { Meta, moduleMetadata, Story } from '@storybook/angular';
// import { MythicHero } from '../../../features/hero/hero.interface';
// import { BundlePaginatorComponent } from './bundle-paginator.component';

// export default {
//   title: 'NgxShared/BundlePaginator',
//   component: BundlePaginatorComponent,
//   decorators: [
//     moduleMetadata({
//       imports: [CommonModule, MatButtonModule, MatSelectModule, MatTooltipModule, MatCommonModule],
//     }),
//   ],
// } as Meta;

// const Template: Story<BundlePaginatorComponent<MythicHero>> = (args: BundlePaginatorComponent<MythicHero>) => ({
//   props: args,
// });

// const first = { relation: 'first', url: '' };
// const prev = { relation: 'previous', url: '' };
// const next = { relation: 'next', url: '' };
// const last = { relation: 'last', url: '' };
// const self = {
//   relation: 'self',
//   url: 'http://localhost:8000/something?_count=10&page=2',
// };
// const allLinks = [first, prev, next, last, self];
// export const Primary = Template.bind({});

// Primary.args = {
//   bundle: {
//     link: allLinks,
//     entry: [{}, {}],
//     total: 100,
//   },
// };

// export const NoResults = Template.bind({});
// NoResults.args = {};

// export const NoTotals = Template.bind({});
// NoTotals.args = {
//   bundle: {
//     link: allLinks,
//     entry: [...(Primary.args?.bundle?.entry ?? [])],
//   },
// };

// export const Estimate = Template.bind({});
// Estimate.args = {
//   bundle: {
//     _links: [
//       first,
//       prev,
//       next,
//       {
//         ...self,
//         url: 'http://localhost:8000/something?_count=10&page=2&_total=estimate',
//       },
//     ],
//     entry: [{}, {}],
//     total: 100,
//   },
// };

// export const Disabled = Template.bind({});
// Disabled.args = {
//   ...Primary.args,
//   disabled: true,
// };
