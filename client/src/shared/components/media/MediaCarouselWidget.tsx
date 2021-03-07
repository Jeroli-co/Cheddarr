import React, { useEffect, useState } from "react";
import { Spinner } from "../Spinner";
import styled from "styled-components";
import { useAPI } from "../../hooks/useAPI";
import { DefaultAsyncCall, IAsyncCall } from "../../models/IAsyncCall";
import { SwitchErrors } from "../errors/SwitchErrors";
import { faCaretDown, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "../Icon";
import { H2 } from "../Titles";
import { ComponentSizes } from "../../enums/ComponentSizes";
import { CenteredContent } from "../layout/CenteredContent";
import { IMedia } from "../../models/IMedia";
import { MediaCarousel } from "./MediaCarousel";
import { IPaginated } from "../../models/IPaginated";

const Container = styled(H2)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  color: ${(props) => props.theme.color};
  white-space: nowrap;
`;

type MediaCarouselWidgetProps = {
  title: string;
  url: string;
};

export const MediaCarouselWidget = (props: MediaCarouselWidgetProps) => {
  const [media, setMedia] = useState<IAsyncCall<IPaginated<IMedia> | null>>(
    DefaultAsyncCall
  );
  const { get } = useAPI();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    get<IPaginated<IMedia>>(props.url).then((res) => {
      setMedia(res);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (media.isLoading) {
    return (
      <CenteredContent height="280px">
        <Spinner size={ComponentSizes.LARGE} />
      </CenteredContent>
    );
  }

  if (media.status >= 400) {
    return <SwitchErrors status={media.status} />;
  }

  return (
    <div>
      <Container onClick={() => setHidden(!hidden)}>
        {props.title}
        {hidden && <Icon icon={faCaretRight} />}
        {!hidden && <Icon icon={faCaretDown} />}
      </Container>

      <br />

      {media.data && !hidden && (
        <MediaCarousel mediaList={media.data.results} />
      )}
    </div>
  );
};
