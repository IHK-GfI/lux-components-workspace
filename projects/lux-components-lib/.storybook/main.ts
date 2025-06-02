import type { StorybookConfig } from '@storybook/angular';
import { StorybookConfigVite } from '@storybook/builder-vite';
import { UserConfig } from 'vite';

const isDevMode = process.env['NODE_ENV'] === 'development';

const config: StorybookConfig & StorybookConfigVite = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-controls', '@storybook/addon-a11y', '@storybook/addon-designs'],
  framework: {
    name: '@storybook/angular',
    options: {}
  },
  core: {
    builder: {
      name: '@storybook/builder-vite',
      options: {
        viteConfigPath: undefined
      }
    }
  },
  staticDirs: [
    {
      from: '../../../dist/theme/prebuilt-themes/',
      to: 'assets/themes'
    },
    {
      from: '../../../node_modules/@ihk-gfi/lux-components-icons-and-fonts',
      to: 'assets/icons'
    },
    '../../../node_modules/@ihk-gfi/lux-components-icons-and-fonts'],
  async viteFinal(config: UserConfig, { configType }) {
    const { mergeConfig } = await import('vite');
    const { default: angular } = await import('@analogjs/vite-plugin-angular');

    return mergeConfig(config, {
      // Add dependencies to pre-optimization
      optimizeDeps: {
        include: ['@storybook/angular', '@angular/compiler', '@storybook/blocks', 'tslib', 'zone.js']
      },
      define: {
        'process.env': {},
        'process.env.NODE_ENV': JSON.stringify(configType === 'PRODUCTION' ? 'production' : 'development'),
        STORYBOOK_ANGULAR_OPTIONS: JSON.stringify({ experimentalZoneless: false })
      },
      plugins: [angular({ jit: !isDevMode, liveReload: isDevMode, tsconfig: './.storybook/tsconfig.json' })]
    } satisfies UserConfig);
  }
};
export default config;
