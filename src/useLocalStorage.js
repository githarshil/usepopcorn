import { useEffect, useState } from "react";
export function useLocalStorage(initialState, key) {
  const [Value, setValue] = useState(function () {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : [];
  });
  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(Value));
    },
    [Value],
  );
  return { watched: Value, setWatched: setValue };
}
