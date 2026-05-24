import { useEffect, useState } from "react";
export function useMovies(query) {
  const [movies, setMovies] = useState();
  const [isloading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const KEY = "5f96d9ca";
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
  return { movies, isloading, error };
}
