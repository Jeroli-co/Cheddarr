import { IMedia } from "../shared/models/IMedia";
import { Slider } from "../elements/Slider";
import { MediaPreviewCard } from "../shared/components/media/MediaPreviewCard";
import { Title } from "../elements/Title";
import { useAPI } from "../shared/hooks/useAPI";
import { useQuery } from "react-query";
import hoursToMilliseconds from "date-fns/hoursToMilliseconds";
import { IPaginated } from "../shared/models/IPaginated";

const useData = (url: string) => {
  const { get } = useAPI();

  const fetchData = () => {
    return get<IPaginated<IMedia>>(url + "?page=1").then((res) => {
      if (res.status === 200 && res.data) {
        return res.data;
      } else {
        return undefined;
      }
    });
  };

  const { data, isLoading } = useQuery<IPaginated<IMedia>>([url], fetchData, {
    staleTime: hoursToMilliseconds(24),
  });

  return {
    data,
    isLoading,
  };
};

type MediaSliderProps = {
  title: string;
  url: string;
  hasToGetFullMedia?: boolean;
};

export const MediaSlider = ({ title, url }: MediaSliderProps) => {
  const { data } = useData(url);

  if (!data?.results) return undefined;

  return (
    <Slider
      headerElement={<Title as="h2">{title}</Title>}
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
      {data?.results.map((m, index) => (
        <MediaPreviewCard key={index} media={m} />
      ))}
    </Slider>
  );
};
