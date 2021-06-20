import React from "react";
import styled from "styled-components";
import { Carousel } from "../layout/Carousel";
import { getActorInitial } from "../../../utils/media-utils";
import { IPerson } from "../../models/IMedia";

const Container = styled.div`
  width: 100%;
  margin-top: 1em;
`;

const Person = styled.div`
  margin: 1em;
`;

const PersonPicture = styled.img`
  min-width: 120px;
  max-width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  object-position: 50% 50%;
`;

const PersonInitials = styled.div`
  min-width: 120px;
  max-width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(146, 146, 146, 0.5);
  font-size: 2em;
`;

type MediaPersonCarouselProps = {
  personList: IPerson[];
};

const MediaPersonCarousel = ({ personList }: MediaPersonCarouselProps) => {
  return (
    <Container>
      <Carousel>
        {personList.map((person, index) => (
          <Person key={index}>
            {person.pictureUrl ? (
              <PersonPicture src={person.pictureUrl} alt="" />
            ) : (
              <PersonInitials>
                <p>{getActorInitial(person.name)}</p>
              </PersonInitials>
            )}
            <div className="content has-text-centered">
              <p className="is-size-7">{person.name}</p>
              <p className="is-size-7 has-text-weight-light">{person.role}</p>
            </div>
          </Person>
        ))}
      </Carousel>
    </Container>
  );
};

export { MediaPersonCarousel };
