import React from "react";

const MovieInfo = (props) => {
    const { movie, onClose, isFavorite, onToggle } = props;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>❌</button>

                <div className="modal-header">
                    <img
                        src={movie.Poster !== 'N/A' ? movie.Poster.replace('http://', 'https://') : 'https://via.placeholder.com/300x450?text=No+Poster'}
                        alt={movie.Title}
                    />

                    <div className="modal-info">
                        <h2>{movie.Title}</h2>
                        <span className="badge-yellow">{movie.imdbRating} IMDB</span>
                        <span className="badge-gray">{movie.Year}</span>
                        <span className="badge-gray">{movie.Runtime}</span>

                        <p><b>Жанр:</b> {movie.Genre}</p>
                        <p><b>Актеры:</b> {movie.Actors}</p>
                        <p className="plot">{movie.Plot}</p>
                        <button
                            className={isFavorite ? "fav-btn remove-btn" : "fav-btn"}
                            onClick={() => onToggle(movie)}
                        >
                            {isFavorite ? "💔 Удалить из избранного" : "❤️ В избранное"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieInfo;