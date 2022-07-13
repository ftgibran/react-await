const path = require('path')

module.exports = {
  'stories': [
    '../**/*.stories.mdx',
    '../**/*.stories.@(js|jsx|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials'
  ],
  staticDirs: ["../public"],
  reactOptions: {
    strictMode: true,
  }
}