import React from 'react'
import styled from 'styled-components'
import { getColorRating, getRatingPercentage } from '../../../utils/media-utils'
import { IMedia } from '../../models/IMedia'

const Container = styled.div<{ backgroundColor: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  background-color: ${(props) => props.backgroundColor};
`

const RatingValue = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  background-color: ${(props) => props.theme.primary};
`

type MediaRatingProps = {
  data?: IMedia
}

const MediaRating = ({ data }: MediaRatingProps) => {
  if (!data?.rating) return undefined

  return (
    <Container
      data-tooltip="MediaRating"
      style={{ cursor: 'default' }}
      backgroundColor={getColorRating(getRatingPercentage(data.rating))}
    >
      <RatingValue className="">{getRatingPercentage(data.rating) + '%'}</RatingValue>
    </Container>
  )
}

export { MediaRating }
