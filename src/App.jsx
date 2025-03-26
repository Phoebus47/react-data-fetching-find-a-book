import "./App.css";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";

function App() {
  const [books, setBooks] = useState([]);

  const findBooks = async (query) => {
    try {
      if (!query) return;
      const result = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${query}`
      );
      console.log(result.data.items);

      setBooks(result.data.items || []);
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]);
    }
  };

  useEffect(() => {
    findBooks("");
  }, []);

  const debounce = (func) => {
    let timer;
    return function (...args) {
      const context = this;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        func.apply(context, args);
      }, 500);
    };
  };

  const optimizedFn = useCallback(debounce(findBooks), []);

  const handleSearch = (e) => {
    optimizedFn(e.target.value);
  };

  return (
    <div className="App">
      <h2>Find a book</h2>
      <div className="search">
        <input type="text" onChange={handleSearch} />
      </div>
      <ul>
        {books.map((book) => (
          <li key={book.id}>{book.volumeInfo.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
