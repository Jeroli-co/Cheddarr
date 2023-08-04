import type { Meta, StoryObj } from '@storybook/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from './Button'
import { faArrowLeft, faArrowRight, faStar } from '@fortawesome/free-solid-svg-icons'

const meta: Meta<typeof Button> = {
  component: Button,
  title: 'Design system/elements/Button',
  parameters: {
    docs: {
      description: {
        component: 'Button enables users to take actions, and make choices, with a single tap.',
      },
    },
  },
  argTypes: {
    color: {
      description: 'Hue of the button.',
      options: ['primary'],
      control: { type: 'select' },
      defaultValue: 'primary',
      table: {
        category: 'Styles',
      },
    },
    size: {
      description: 'Size of the button',
      options: ['sm', 'md', 'lg'],
      control: { type: 'select' },
      defaultValue: 'md',
      table: {
        category: 'Styles',
      },
    },
    variant: {
      description: 'Variant of the button.',
      options: ['contained', 'outlined', 'text', 'link'],
      control: { type: 'select' },
      defaultValue: 'contained',
      table: {
        category: 'Styles',
      },
    },
    loading: {
      description: 'Loading state of the button',
      control: { type: 'boolean' },
      table: {
        category: 'States',
      },
    },
    disabled: {
      description: 'Disabled state of the button',
      control: { type: 'boolean' },
      table: {
        category: 'States',
      },
    },
  },
}
export default meta

type Story = StoryObj<typeof Button>

export const Base: Story = {
  parameters: {
    docs: {
      description: {
        story: 'This is a button without any props set.',
      },
    },
  },
  render: (args) => <Button {...args}>Click</Button>,
}

export const WithIcons: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Icons can be added to both sides of the button.',
      },
    },
  },
  render: (args) => (
    <div className="flex items-center gap-3">
      <Button {...args}>
        <FontAwesomeIcon icon={faArrowLeft} />
        Click
      </Button>
      <Button {...args}>
        Click
        <FontAwesomeIcon icon={faArrowRight} />
      </Button>
      <Button {...args}>
        <FontAwesomeIcon icon={faStar} />
      </Button>
    </div>
  ),
}

export const Loading: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The loading state can be activated to give feedback to the user while asynchronous actions are being performed.',
      },
    },
  },
  render: (args) => (
    <Button {...args} loading>
      Click
    </Button>
  ),
}

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The disabled state can be activated to prevent the user from interacting with the button.',
      },
    },
  },
  render: (args) => (
    <Button {...args} disabled>
      Click
    </Button>
  ),
}

export const AsChild: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Use the `asChild` prop to apply the logic of the button on another element.',
      },
    },
  },
  render: (args) => (
    <Button {...args} asChild>
      <a href="/login">Login</a>
    </Button>
  ),
}
