import type { StorybookConfig } from '@storybook/react-vite'
import { mergeConfig } from 'vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions',
    {
      name: '@storybook/addon-styling',
      options: {
        // Check out https://github.com/storybookjs/addon-styling/blob/main/docs/api.md
        // For more details on this addon's options.
        postCss: {
          implementation: require.resolve('postcss'),
        },
      },
    },
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: true,
    defaultName: 'Playground',
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      compilerOptions: {
        allowSyntheticDefaultImports: true,
        esModuleInterop: false,
      },
    },
  },
  staticDirs: ['../public'],
  core: {
    builder: '@storybook/builder-vite',
  },
  async viteFinal(config) {
    // Merge custom configuration into the default config
    return mergeConfig(config, {
      // Add dependencies to pre-optimization
      optimizeDeps: {
        include: ['storybook-dark-mode'],
      },
    })
  },
}

export default config
