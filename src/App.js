import React, { useState, useEffect } from 'react';
import './App.css';

// Dataset stores dates as "DD/MM/YY" — parse manually, then localize.
function formatReleaseDate(raw) {
  if (!raw) return 'Unknown';
  let [day, month, year] = raw.split('/').map((p) => parseInt(p, 10));
  if (year < 100) year += 1900;
  const date = new Date(year, month - 1, day);
  return isNaN(date) ? raw : date.toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

function MovieDetail({ id, onBack }) {
  const [movie, setMovie] = useState(null);
  useEffect(() => {
    fetch(`http://localhost:3001/api/movies/${id}`).then((r) => r.json()).then((p) => setMovie(p.data));
  }, [id]);

  if (!movie) return <p>Loading…</p>;
  return (
    <div className="detail">
      <button className="back-button" onClick={onBack}>← Back to movies</button>
      <h1>{movie.title}</h1>
      {movie.tagline && <p className="detail__tagline">{movie.tagline}</p>}
      <dl className="detail__fields">
        <dt>Original title</dt><dd>{movie.original_title}</dd>
        <dt>Overview</dt><dd>{movie.overview}</dd>
        <dt>Release date</dt><dd>{formatReleaseDate(movie.release_date)}</dd>
        <dt>Runtime</dt><dd>{movie.runtime} minutes</dd>
        <dt>Status</dt><dd>{movie.status}</dd>
        <dt>Vote average</dt><dd>{movie.vote_average} / 10</dd>
        <dt>Vote count</dt><dd>{movie.vote_count}</dd>
        <dt>ID</dt><dd>{movie.id}</dd>
      </dl>
    </div>
  );
}

function App() {
  const [movies, setMovies] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/movies')
      .then((r) => r.json())
      .then((p) => setMovies(p.data));
  }, []);

  if (selectedId !== null) {
    return <MovieDetail id={selectedId} onBack={() => setSelectedId(null)} />;
  }

  return (
    <div className="App">
      <h1>🎬 Movie Browser</h1>
      <div className="movie-grid">
        {movies.map((m) => (
          <button key={m.id} className="movie-card" onClick={() => setSelectedId(m.id)}>
            <h2>{m.title}</h2>
            <p className="tagline">{m.tagline || 'No tagline'}</p>
            <div className="rating">⭐ {m.vote_average} / 10</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;