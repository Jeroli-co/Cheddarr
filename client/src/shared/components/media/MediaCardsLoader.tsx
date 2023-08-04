import React from 'react'
import styled, { keyframes } from 'styled-components'
import { MediaPreviewCardContainer } from './MediaPreviewCard'

const Shine = () => {
  return keyframes`
  0% {
    filter: brightness(100%);
  }
  100% {
    filter: brightness(200%);
  }`
}

const MediaLoadingCardContainer = styled(MediaPreviewCardContainer)<{
  index: number
  n: number
}>`
  background: ${(props) => props.theme.primary};
  animation: 1s ease infinite running;
  padding: 0;
  margin: 4px;

  &:nth-last-child(-n + ${(props) => props.n}) {
    animation: ${Shine} 0.5s alternate infinite linear;
    animation-delay: ${(props) => props.index / props.n}s;
  }

  &:nth-child(-n + ${(props) => props.n}) {
    animation: ${Shine} 0.5s alternate infinite linear;
    animation-delay: ${(props) => props.index / props.n}s;
  }
`

type MediaCardsLoaderProps = {
  n: number
  refIndex?: number
}

export const MediaCardsLoader = React.forwardRef<HTMLDivElement, MediaCardsLoaderProps>((props, ref) => {
  return (
    <>
      {[...Array(props.n)].map((_, index) => (
        <MediaLoadingCardContainer className="max-w-[200px]" ref={ref} key={index} index={index} n={props.n}>
          <svg viewBox="0 0 2 3" />
        </MediaLoadingCardContainer>
      ))}
    </>
  )
})
