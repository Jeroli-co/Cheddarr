import styled from 'styled-components'
import { cn } from '../../utils/strings'

export const Divider = styled.div`
  width: 100%;
  height: 0;
  margin-top: 20px;
  margin-bottom: 20px;
  border-top: 1px solid ${(props) => props.theme.color};
`

export const PrimaryDivider = styled(Divider)`
  border-top: 1px solid ${(props) => props.theme.primary};
`

export const PrimaryLightDivider = styled(Divider)`
  border-top: 1px solid ${(props) => props.theme.primaryLight};
`

export const NewDivider = ({ className }: { className?: string }) => (
  <div className={cn('w-full h-[1px] bg-primary-lighter rounded-full', className)} />
)
