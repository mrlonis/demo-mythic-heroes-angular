import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { setCompodocJson } from '@storybook/addon-docs/angular';
import { moduleMetadata } from '@storybook/angular';
import { themes } from '@storybook/theming';
// import docJson from '../documentation.json';
import '../projects/zotec-ibc-interface-admin-app/src/styles/styles.scss';

// setCompodocJson(docJson);

export const parameters = {
  angularLegacyRendering: false,
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  // docs: { inlineStories: true },
  darkMode: {
    // Override the default dark theme
    dark: { ...themes.dark, appBg: 'black' },
    // Override the default light theme
    light: { ...themes.normal },
  },
  options: {
    storySort: (a, b) => (a[1].kind === b[1].kind ? 0 : a[1].id.localeCompare(b[1].id, undefined, { numeric: true })),
  },
};

export const decorators = [
  moduleMetadata({
    imports: [BrowserAnimationsModule],
  }),
];
