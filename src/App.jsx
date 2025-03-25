import { useState, useCallback } from "react";
import "./App.css";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState([]);

  // สร้างฟังก์ชันสำหรับเรียก API
  const fetchBooks = async (query) => {
    if (!query.trim()) return;
    
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${query}`
      );
      const data = await response.json();
      setBooks(data.items || []);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  // สร้าง debounced version ของฟังก์ชัน fetchBooks
  const debouncedFetch = useCallback((callback, delay) => {
    let timeoutId;
    
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        callback(...args);
      }, delay);
    };
  }, []);

  // สร้าง debounced search handler
  const debouncedSearch = useCallback(
    debouncedFetch((query) => fetchBooks(query), 500),
    []
  );

  // อัพเดต handler สำหรับการเปลี่ยนแปลงใน input
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  return (
    <div className="App">
      <h1>Find a Book</h1>
      <div className="search-container">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          className="search-input"
          placeholder="Start typing to search books..."
        />
      </div>

      {books.length > 0 && (
        <ul className="books-list">
          {books.map((book) => (
            <li key={book.id}>
              {book.volumeInfo.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
