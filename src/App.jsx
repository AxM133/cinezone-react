import { useEffect, useState } from "react"
import './App.css'
import MovieInfo from "./MovieInfo";

const API_KEY = import.meta.env.VITE_API_KEY;

function App() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isFavoritesView, setIsFavoritesView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("cinezone_favs");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cinezone_favs", JSON.stringify(favorites));
  }, [favorites]);

  // функция удаления и добавления
  const handleFavorite = (movie) => {
    const isAlreadyAdded = favorites.some(fav => fav.imdbID === movie.imdbID);

    if (isAlreadyAdded) {
      const newFavorites = favorites.filter(fav => fav.imdbID !== movie.imdbID);
      setFavorites(newFavorites);
    } else {
      const newFavorites = [...favorites, movie];
      setFavorites(newFavorites);
    }
  }


  const searchMovies = async (title) => {

    setIsLoading(true);

    try {
      const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${title}`);
      const data = await response.json();
      setMovies(data.Search);
    } catch (error) {
      console.log("Ошибка:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const onMovieSelect = async (id) => {
    const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`);
    const data = await response.json();

    setSelectedMovie(data);
    console.log("Выбранный фильм: ", data);
  }

  const movieList = isFavoritesView ? favorites : movies;

  return (
    <div>
      <div className={`mini-header ${isScrolled ? 'visible' : ''}`}>

        <div className="mini-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          CZ
        </div>

        {!isFavoritesView && (
          <div className="mini-search">
            <input
              placeholder="Поиск..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') searchMovies(searchTerm);
              }}
            />
            <button onClick={() => searchMovies(searchTerm)}>Найти</button>
          </div>
        )}

        <button
          className="mini-fav-btn"
          onClick={() => {
            setIsFavoritesView(!isFavoritesView);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          {isFavoritesView ? "🏠 Домой" : "❤️ Избранное"}
        </button>
      </div>

      <header className="header">
        <h1>CineZone</h1>
        <div className="tabs">
          <button
            className={!isFavoritesView ? "tab active" : "tab"}
            onClick={() => setIsFavoritesView(false)}
          >
            🔍 Поиск
          </button>
          <button
            className={isFavoritesView ? "tab active" : "tab"}
            onClick={() => setIsFavoritesView(true)}
          >
            ❤️ Избранное
          </button>
        </div>

        {!isFavoritesView && (
          <div className="search">
            <input
              placeholder="Название фильма"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  searchMovies(searchTerm);
                }
              }}
            />
            <button onClick={() => searchMovies(searchTerm)}>Найти</button>
          </div>
        )}
      </header>

      {
        isLoading ? (
          <div className="loader"></div>
        ) : (
          <>
            {movieList?.length > 0 ? (
              <div className="container">
                {movieList.map((movie, index) => (
                  <div
                    className="movie-card"
                    key={movie.imdbID + index}
                    onClick={() => onMovieSelect(movie.imdbID)}
                  >
                    <img src={movie.Poster} alt={movie.Title} />
                    <h3>{movie.Title}</h3>
                    <p>{movie.Year}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty">
                <h2>{isFavoritesView ? "Список избранного пуст" : "Фильмы не найдены"}</h2>
              </div>
            )}
          </>
        )
      }
      {
        selectedMovie && (
          <MovieInfo
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
            isFavorite={favorites.some(fav => fav.imdbID === selectedMovie.imdbID)}
            onToggle={handleFavorite}
          />
        )
      }
    </div >
  )
}

export default App
