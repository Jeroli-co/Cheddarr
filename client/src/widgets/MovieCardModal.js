import React from "react";
import styled from "styled-components";

const ModalCardStyled = styled.div`
  width: 500px;
  height: 800px;
`;

const MovieCardModal = ({ movie, onClose}) => {
  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose} />
      <ModalCardStyled className="modal-card">
      <header className="modal-card-head">
          <p className="modal-card-title has-text-primary has-text-weight-semibold">{movie.title}</p>
          <button className="delete" aria-label="close" onClick={onClose}/>
      </header>
        <section className="modal-card-body">
          <p className="image is-128x128">
            <img src={movie.poster} alt="poster"/>
          </p>
           <div className="content has-text-centered has-text-primary">
             {movie.summary}
           </div>
        </section>
      </ModalCardStyled>
    </div>
  );
}

export {
  MovieCardModal
}
