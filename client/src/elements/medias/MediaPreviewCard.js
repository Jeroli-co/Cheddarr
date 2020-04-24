import styled from "styled-components";

const MediaPreviewCardStyle = styled.div`
  position: relative;
  min-width: 10vw;
  max-width: 10vw;
  height: auto;
  transition: 0.3s ease;
  border: 5px solid transparent;
  border-radius: 12px;

  &:hover {
    border: 2px solid ${(props) => props.theme.primary};
    margin-left: 0.5em;
    margin-right: 0.5em;

    .movie-title {
      visibility: visible;
    }
  }

  .movie-image {
    display: block;
    width: 100%;
    height: 100%;
    opacity: 1;
    transition: opacity 0.6s ease;
    border-radius: 12px;
  }

  .movie-title {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    transition: opacity 0.6s ease;
    visibility: hidden;
    color: white;
    border-radius: 12px;
  }

  &:hover .movie-title {
    background: rgba(0, 0, 0, 0.5);
  }
`;

export { MediaPreviewCardStyle };
