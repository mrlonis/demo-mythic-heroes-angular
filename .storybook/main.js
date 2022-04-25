module.exports = {
  stories: ['../stories/**/*.stories.@(mdx|js|jsx|ts|tsx)', '../src/**/*.stories.@(mdx|js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions'],
  framework: '@storybook/angular',
  core: {
    builder: '@storybook/builder-webpack5',
  },
  features: {
    babelModeV7: true,
  },
};
