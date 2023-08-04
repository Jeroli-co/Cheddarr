import React, { ChangeEvent } from 'react'
import styled from 'styled-components'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import * as RadixCheckbox from '@radix-ui/react-checkbox'
import './checkbox.css'
import { ComponentSizes } from '../../shared/enums/ComponentSizes'
import { cn } from '../../utils/strings'

type ContainerProps = {
  color?: string
  size: number
}

const Container = styled.label<ContainerProps>`
  position: relative;
  display: inline-block;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size / 2}px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #ccc;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  .slider:before {
    position: absolute;
    margin: auto;
    content: '';
    height: calc(${(props) => props.size / 2}px - 8px);
    width: calc(${(props) => props.size / 2}px - 8px);
    left: 4px;
    top: 0;
    bottom: 0;
    background: ${(props) => props.theme.white};
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  input:checked + .slider {
    background: ${(props) => (props.color ? props.color : props.theme.primaryLighter)};
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #2196f3;
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(${(props) => props.size / 2}px);
    -ms-transform: translateX(${(props) => props.size / 2}px);
    transform: translateX(${(props) => props.size / 2}px);
  }

  .slider.round {
    border-radius: 34px;
  }

  .slider.round:before {
    border-radius: 50%;
  }
`

type CheckboxPropsOld = {
  round?: boolean
  color?: string
  size?: ComponentSizes
  register?: any
  name?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  checked?: boolean
}

export const CheckboxOld = (props: CheckboxPropsOld) => {
  const calcSize = () => {
    switch (props.size) {
      case ComponentSizes.SMALL:
        return 36
      case ComponentSizes.MEDIUM:
        return 48
      case ComponentSizes.LARGE:
        return 60
      case ComponentSizes.XLARGE:
        return 72
      default:
        return 48
    }
  }

  return (
    <Container color={props.color} size={calcSize()}>
      <input
        type="checkbox"
        name={props.name}
        ref={props.register}
        onChange={props.onChange}
        checked={props.checked}
      />
      <span className={classNames('slider', { round: props.round })} />
    </Container>
  )
}

type CheckboxProps = RadixCheckbox.CheckboxProps & {
  label?: string
  error?: string
}

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ className, disabled, label, error, ...props }, ref) => {
    return (
      <div>
        <div className="flex items-center gap-3">
          <RadixCheckbox.Root
            ref={ref}
            className={cn('CheckboxRoot', disabled && 'opacity-50 pointer-events-none')}
            {...props}
          >
            <RadixCheckbox.Indicator className="CheckboxIndicator">
              <FontAwesomeIcon icon={faCheck} />
            </RadixCheckbox.Indicator>
          </RadixCheckbox.Root>

          {label && <label className="Label">{label}</label>}
        </div>

        {error && <div className="text-sm text-danger-light">{error}</div>}
      </div>
    )
  }
)
