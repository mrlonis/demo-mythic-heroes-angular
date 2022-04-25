module.exports = {
  stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx)', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    {
      name: '@storybook/addon-essentials',
      options: {
        docs: false,
      },
    },
    '@storybook/addon-interactions',
  ],
  framework: '@storybook/angular',
  core: {
    builder: '@storybook/builder-webpack5',
  },
  features: {
    babelModeV7: true,
  },
};
