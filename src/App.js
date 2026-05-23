import { useEffect, useState } from "react";
import Stars from "./stars";

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
const KEY = "5f96d9ca";

export default function App() {
  const [movies, setMovies] = useState();
  const [watched, setWatched] = useState(tempWatchedData);
  const [isloading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("don");
  const [selectedID, setSelectedID] = useState(null);

  function handleAppWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleSelectMovie(id) {
    setSelectedID(id);
  }
  function handleBack() {
    setSelectedID(null);
  }
  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal },
          );
          if (!res.ok) throw new Error("movie not found");
          const data = await res.json();
          setMovies(data.Search || []);
        } catch (err) {
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setLoading(false);
        }
      }
      fetchMovies();
      return function () {
        controller.abort();
      };
    },
    [query],
  );

  return (
    <>
      <Nav>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </Nav>
      <Main>
        <Listbox>
          {isloading && <Loader />}
          {!isloading && !error && (
            <Movieslist movies={movies} handleSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Listbox>
        <Listbox>
          {selectedID ? (
            <SelectedMovie
              selectedID={selectedID}
              handleBack={handleBack}
              handleAdd={handleAppWatched}
            />
          ) : (
            <>
              <Watchedbox watched={watched} />
              <Watchedlist watched={watched} selectedID={selectedID} />
            </>
          )}
        </Listbox>
      </Main>
    </>
  );
}
function ErrorMessage({ message }) {
  return <p className="error">{message}</p>;
}
function Loader() {
  return <p className="loader">loading...</p>;
}
function Nav({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies?.length || 0}</strong> results
    </p>
  );
}
function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
function Movieslist({ movies, handleSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <li key={movie.imdbID} onClick={() => handleSelectMovie(movie.imdbID)}>
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>🗓</span>
              <span>{movie.Year}</span>
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
function Listbox({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}
function Watchedbox({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}
function Watchedlist({ watched, selectedID }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <li key={movie.imdbID}>
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>⭐️</span>
              <span>{movie.imdbRating}</span>
            </p>
            <p>
              <span>🌟</span>
              <span>{movie.userRating}</span>
            </p>
            <p>
              <span>⏳</span>
              <span>{movie.runtime} min</span>
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
function SelectedMovie({ selectedID, handleBack, handleAdd }) {
  const [movie, setMovie] = useState({});
  const [userRating, setUserRating] = useState(0);
  const {
    Title,
    Poster,
    Plot,
    Director,
    Actors,
    Genre,
    imdbRating,
    Runtime,
    Released,
  } = movie;
  function handleAppWatched(movie) {
    const newWatchedMovie = {
      imdbID: movie.imdbID,
      Title: movie.Title,
      Poster: movie.Poster,
      imdbRating: parseFloat(movie.imdbRating),
      userRating: userRating,
      runtime: parseInt(movie.Runtime),
    };
    handleAdd(newWatchedMovie);
    handleBack();
  }
  useEffect(
    function () {
      if (!Title) return;
      document.title = `🍿${Title}`;
      return function () {
        document.title = "usepopcorn";
      };
    },
    [Title],
  );
  useEffect(
    function () {
      function handleKeyDown(e) {
        if (e.code === "Escape") {
          handleBack();
        }
      }
      document.addEventListener("keydown", handleKeyDown);
      return function () {
        document.removeEventListener("keydown", handleKeyDown);
      };
    },
    [handleBack],
  );
  useEffect(
    function () {
      async function selectMovie() {
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedID}`,
        );
        const Movie = await res.json();
        setMovie(Movie);
        setUserRating(0);
      }
      selectMovie();
    },
    [selectedID],
  );
  return (
    <div className="details">
      <header>
        <button className="btn-back" onClick={handleBack}>
          &larr;
        </button>
        <img src={Poster} alt={`Poster of ${Title}`} />
        <div className="details-overview">
          <h2>{Title}</h2>
          <p>
            {Released} · {Runtime}
          </p>
          <p>{Genre}</p>
          <p>⭐ {imdbRating} IMDb rating</p>
        </div>
      </header>
      <section>
        <p>
          <em>{Plot}</em>
        </p>
        <p>Starring: {Actors}</p>
        <p>Directed by: {Director}</p>
      </section>
      <div className="rating">
        <Stars
          maxrating={10}
          color="gold"
          size={24}
          defRating={userRating}
          onSetRating={setUserRating}
        />
      </div>
      {userRating > 0 && (
        <button
          className="btn-add"
          onClick={() => {
            handleAppWatched(movie);
          }}
        >
          <span>+</span>
          <span>Add to list</span>
        </button>
      )}
    </div>
  );
}
function Main({ children }) {
  return <main className="main">{children}</main>;
}
