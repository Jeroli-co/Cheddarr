import React, { MouseEvent } from "react";
import { Modal } from "../layout/Modal";
import { IMedia, ISeries } from "../../models/IMedia";
import { H2 } from "../Titles";
import { Row } from "../layout/Row";
import { MediaTag } from "../Tag";
import { MediaTypes } from "../../enums/MediaTypes";
import { RequestSeriesCard } from "./RequestSeriesCard";
import { Buttons } from "../layout/Buttons";
import { Button, PrimaryButton } from "../Button";
import { useRequestMedia } from "../../hooks/useRequestMedia";
import { useSeriesRequestOptionsContext } from "../../contexts/SeriesRequestOptionsContext";

type RequestMediaModalProps = {
  media: IMedia;
  closeModal: () => void;
};

export const RequestMediaModal = (props: RequestMediaModalProps) => {
  const { requestMovie, requestSeries } = useRequestMedia();
  const { options } = useSeriesRequestOptionsContext();

  const onRequestMedia = (e: MouseEvent<HTMLButtonElement>) => {
    if (props.media.mediaType === MediaTypes.MOVIES) {
      requestMovie({
        tmdbId: props.media.tmdbId,
      }).then((res) => {
        if (res.status === 201) {
          props.closeModal();
        }
      });
    } else if (props.media.mediaType === MediaTypes.SERIES) {
      requestSeries({
        tmdbId: props.media.tmdbId,
        seasons: options.seasons,
      }).then((res) => {
        if (res.status === 201) {
          props.closeModal();
        }
      });
    }
    e.stopPropagation();
  };

  return (
    <Modal close={() => props.closeModal()}>
      <header>
        <Row justifyContent="space-between" alignItems="center">
          <H2>{props.media.title}</H2>
          <MediaTag media={props.media} />
        </Row>
      </header>
      <section>
        {props.media.mediaType === MediaTypes.SERIES && (
          <RequestSeriesCard series={props.media as ISeries} />
        )}
      </section>
      <footer>
        <Buttons>
          <PrimaryButton type="button" onClick={onRequestMedia}>
            Request
          </PrimaryButton>
          <Button type="button" onClick={() => props.closeModal()}>
            Cancel
          </Button>
        </Buttons>
      </footer>
    </Modal>
  );
};
