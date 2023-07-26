import * as React from "react";
import { Swiper, SwiperProps, SwiperSlide, useSwiper } from "swiper/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "./button/Button";

type SliderContainerStartProps = {
  headerElement?: React.ReactNode;
};
const SliderContainerStart = ({ headerElement }: SliderContainerStartProps) => {
  const swiper = useSwiper();
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between gap-3">
        <>{headerElement}</>
        <div className="flex items-center gap-1">
          <Button
            variant="link"
            className="p-2 aspect-square"
            onClick={() => swiper.slidePrev()}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </Button>
          <Button
            variant="link"
            className="p-2 aspect-square"
            onClick={() => swiper.slideNext()}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </Button>
        </div>
      </div>

      <div className="w-full h-0.5 rounded-full my-3 bg-primary-light" />
    </div>
  );
};

type SliderProps = React.HTMLAttributes<HTMLDivElement> &
  SwiperProps & { headerElement?: React.ReactNode };

export const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ children, headerElement, ...props }, ref) => {
    return (
      <Swiper {...props}>
        {React.Children.map(children, (c) => (
          <SwiperSlide>{c}</SwiperSlide>
        ))}
        <span slot="container-start">
          <SliderContainerStart headerElement={headerElement} />
        </span>
      </Swiper>
    );
  },
);
