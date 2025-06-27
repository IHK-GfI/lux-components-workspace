import { StorybookConfig } from '@analogjs/storybook-angular';
import { mergeConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const config: StorybookConfig = {
  'stories': [
    '../projects/demo/**/*.mdx',
    '../projects/demo/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../projects/lux-components-lib/**/*.mdx',
    '../projects/lux-components-lib/**/*.stories.@(js|jsx|mjs|ts|tsx)'
  ],
  addons: ['@storybook/addon-docs', '@storybook/addon-controls', '@storybook/addon-a11y', '@storybook/addon-designs'],

  'framework': {
    'name': '@analogjs/storybook-angular',
    options: {}
  },
  staticDirs: [
    {
      from: '../dist/theme/prebuilt-themes/',
      to: 'assets/themes'
    },
    {
      from: '../node_modules/@ihk-gfi/lux-components-icons-and-fonts/assets/icons',
      to: 'assets/icons'
    },
    {
      from: '../node_modules/@ihk-gfi/lux-components-icons-and-fonts/assets/fonts',
      to: 'assets/fonts'
    }
  ],
  async viteFinal(config) {
    return mergeConfig(config, {
      plugins: [tsconfigPaths()]
    });
  }


};
export default config;
