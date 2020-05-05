import styled from "styled-components";
import { Carousel } from "../../../elements/Carousel";
import { getActorInitial } from "../../../utils/media-utils";
import React from "react";

const ActorsStyle = styled.div`
  width: 100%;
  margin-top: 1em;
`;

const Actor = styled.div`
  margin: 1em;
`;

const ActorPicture = styled.img`
  min-width: 120px;
  max-width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  object-position: 50% 50%;
`;

const ActorInitials = styled.div`
  min-width: 120px;
  max-width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.transparentDark};
  color: ${(props) => props.theme.dark};
  font-size: 2em;
`;

const Actors = ({ actors }) => {
  return (
    <ActorsStyle>
      <p className="is-size-6">Actors</p>
      <Carousel>
        {actors.map((actor, index) => (
          <Actor key={index}>
            {actor.thumbUrl ? (
              <ActorPicture src={actor.thumbUrl} alt="" />
            ) : (
              <ActorInitials>
                <p>{getActorInitial(actor.name)}</p>
              </ActorInitials>
            )}
            <div className="content has-text-centered">
              <p className="is-size-7">{actor.name}</p>
              <p className="is-size-7 has-text-weight-light">{actor.role}</p>
            </div>
          </Actor>
        ))}
      </Carousel>
    </ActorsStyle>
  );
};

export { Actors };
