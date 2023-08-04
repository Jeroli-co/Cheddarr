import type { Preview } from '@storybook/react'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import '../src/theme.css'

const preview: Preview = {
  parameters: {
    layout: 'centered',
    viewport: {
      viewports: INITIAL_VIEWPORTS,
    },
    backgrounds: {
      default: 'Default',
      values: [
        {
          name: 'Default',
          value: 'hsl(214, 24%, 100%)',
        },
        {
          name: 'White',
          value: 'hsl(214, 24%, 100%)',
        },
        {
          name: 'Primary lighter',
          value: 'hsl(244, 32%, 95%)',
        },
        {
          name: 'Primary light',
          value: 'hsl(244, 32%, 75%)',
        },
        {
          name: 'Primary',
          value: 'hsl(244, 32%, 50%)',
        },
        {
          name: 'Primary dark',
          value: 'hsl(244, 32%, 25%)',
        },
        {
          name: 'Primary darker',
          value: 'hsl(244, 32%, 5%)',
        },
        {
          name: 'Black',
          value: 'hsl(214, 24%, 0%)',
        },
      ],
    },
    options: {
      storySort: {
        method: 'alphabetical',
      },
    },
  },
}

export default preview
