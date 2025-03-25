import axios from "axios";
import React, { useEffect, useState } from "react";

function FindBook() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");

  const getBooks = async () => {
    try {
      const result = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${search}`);
      console.log(result.data);
      setBooks(result.data.items || []); // ตั้งค่าหนังสือจาก API
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    if (search.trim() !== "") {
      getBooks();
    }
  }, [search]); // เรียก getBooks เมื่อ search เปลี่ยนแปลง

  const handleSearch = (e) => {
    setSearch(e.target.value); // อัปเดตค่าการค้นหา
  };

  return (
    <div>
      <h1>Find Book</h1>
      <input type="text" value={search} onChange={handleSearch} />
      <div>
        {books.length > 0 ? (
          books.map((book) => (
            <div key={book.id}>
              <li>{book.volumeInfo.title}</li>
              
            </div>
          ))
        ) : (
          <p>No books found</p>
        )}
      </div>
    </div>
  );
}

export default FindBook;