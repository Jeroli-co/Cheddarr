import { IMedia } from '../shared/models/IMedia'
import { Slider } from '../elements/Slider'
import { MediaPreviewCard } from '../shared/components/media/MediaPreviewCard'
import { Title } from '../elements/Title'
import { IPaginated } from '../shared/models/IPaginated'
import { Spinner } from '../shared/components/Spinner'
import { Divider } from '../shared/components/Divider'

type MediaSliderProps = {
  title: string
  description?: string
  data?: IPaginated<IMedia>
  isLoading?: boolean
}

export const MediaSlider = ({ title, description, data, isLoading }: MediaSliderProps) => {
  const Head = () => (
    <>
      <Title as="h2" className="mb-0">
        {title}
      </Title>
      <p className="text-xs md:text-sm">{description}</p>
    </>
  )

  return (
    <div>
      {isLoading && (
        <>
          <Head />
          <Divider className="my-3" />
          <Spinner />
        </>
      )}

      {!isLoading && (
        <Slider
          headerElement={<Head />}
          spaceBetween={0}
          slidesPerView={2.4}
          scrollbar={{ draggable: true }}
          breakpoints={{
            480: {
              slidesPerView: 3.4,
            },
            768: {
              slidesPerView: 4.4,
            },
            1024: {
              slidesPerView: 5.4,
            },
            1201: {
              slidesPerView: 6.4,
            },
            1401: {
              slidesPerView: 7.4,
            },
            1601: {
              slidesPerView: 8.4,
            },
            1801: {
              slidesPerView: 9.4,
            },
          }}
        >
          {data?.results.map((m, index) => <MediaPreviewCard key={index} media={m} />)}
        </Slider>
      )}
    </div>
  )
}
