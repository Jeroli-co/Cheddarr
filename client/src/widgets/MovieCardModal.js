import React from "react";

const MovieCardModal = ({ movie, onClose}) => {



  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose} />
      <div className="modal-card">
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
      </div>
    </div>
  );
}

export {
  MovieCardModal
}