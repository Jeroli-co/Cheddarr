import styled from "styled-components";
import { getActorInitial } from "../../../utils/media-utils";
import { IPerson } from "../../models/IMedia";
import { Slider } from "../../../elements/Slider";
import { Title } from "../../../elements/Title";

const PersonPicture = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  object-position: 50% 50%;
`;

const PersonInitials = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(146, 146, 146, 0.5);
  font-size: 2em;
`;

type MediaPersonCarouselProps = {
  title: string;
  personList: IPerson[];
};

const MediaPersonCarousel = ({
  personList,
  title,
}: MediaPersonCarouselProps) => {
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
          slidesPerView: 5.4,
        },
        1024: {
          slidesPerView: 6.4,
        },
        1201: {
          slidesPerView: 7.4,
        },
        1401: {
          slidesPerView: 8.4,
        },
        1601: {
          slidesPerView: 9.4,
        },
        1801: {
          slidesPerView: 10.4,
        },
        2001: {
          slidesPerView: 11.4,
        },
        2201: {
          slidesPerView: 12.4,
        },
        2401: {
          slidesPerView: 13.4,
        },
        2601: {
          slidesPerView: 14.4,
        },
      }}
    >
      {personList.map((person, index) => (
        <div key={index} className="flex flex-col items-center gap-1">
          {person.pictureUrl ? (
            <PersonPicture src={person.pictureUrl} alt="" />
          ) : (
            <PersonInitials>
              <p>{getActorInitial(person.name)}</p>
            </PersonInitials>
          )}
          <div className="text-center">
            <p className="text-sm">{person.name}</p>
            <p className="text-xs italic">{person.role}</p>
          </div>
        </div>
      ))}
    </Slider>
  );
};

export { MediaPersonCarousel };
