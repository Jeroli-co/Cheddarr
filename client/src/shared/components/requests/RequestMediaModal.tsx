import React from "react";
import { Modal } from "../layout/Modal";
import { IMedia, ISeries } from "../../models/IMedia";
import { H2 } from "../Titles";
import { Row } from "../layout/Row";
import { MediaTag } from "../Tag";
import { MediaTypes } from "../../enums/MediaTypes";
import { RequestMovieCard } from "./RequestMovieCard";
import { RequestSeriesCard } from "./RequestSeriesCard";
import { Buttons } from "../layout/Buttons";
import { Button, PrimaryButton } from "../Button";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {
  IMovieRequestCreate,
  ISeriesRequestCreate,
} from "../../models/IRequestCreate";
import { useRequestMedia } from "../../hooks/useRequestMedia";
import { useSeriesRequestOptionsContext } from "../../contexts/SeriesRequestOptionsContext";

type RequestMediaModalProps = {
  media: IMedia;
  closeModal: () => void;
};

export const RequestMediaModal = (props: RequestMediaModalProps) => {
  const { requestMovie, requestSeries } = useRequestMedia();
  const { options } = useSeriesRequestOptionsContext();

  const formsMethods = useForm();

  const onRequestMedia: SubmitHandler<{ requestedUsername: string }> = (data: {
    requestedUsername: string;
  }) => {
    if (props.media.mediaType === MediaTypes.MOVIES) {
      const request: IMovieRequestCreate = {
        requestedUsername: data.requestedUsername,
        tmdbId: props.media.tmdbId,
      };
      requestMovie(request).then((res) => {
        if (res.status === 201) {
          props.closeModal();
        }
      });
    } else if (props.media.mediaType === MediaTypes.SERIES) {
      const request: ISeriesRequestCreate = {
        requestedUsername: data.requestedUsername,
        tmdbId: props.media.tmdbId,
        seasons: options.seasons,
      };
      requestSeries(request).then((res) => {
        if (res.status === 200) {
          props.closeModal();
        }
      });
    }
  };

  return (
    <Modal close={() => props.closeModal()}>
      <header>
        <Row justifyContent="space-between" alignItems="center">
          <H2>{props.media.title}</H2>
          <MediaTag media={props.media} />
        </Row>
      </header>
      <FormProvider {...formsMethods}>
        <form onSubmit={formsMethods.handleSubmit(onRequestMedia)}>
          <section>
            {props.media.mediaType === MediaTypes.MOVIES && (
              <RequestMovieCard />
            )}
            {props.media.mediaType === MediaTypes.SERIES && (
              <RequestSeriesCard series={props.media as ISeries} />
            )}
          </section>
          <footer>
            <Buttons>
              <PrimaryButton type="submit">Request</PrimaryButton>
              <Button type="button" onClick={() => props.closeModal()}>
                Cancel
              </Button>
            </Buttons>
          </footer>
        </form>
      </FormProvider>
    </Modal>
  );
};
