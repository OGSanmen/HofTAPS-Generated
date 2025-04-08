/**
 * Fetch book data from Google Books API via ISBN
 * @param {string} isbn - 10 or 13-digit ISBN
 * @returns {Promise<Object|null>}
 */
export async function fetchBookFromGoogle(isbn) {
    try {
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
      const data = await res.json();
  
      if (data.totalItems === 0 || !data.items || data.items.length === 0) return null;
  
      const book = data.items[0].volumeInfo;
  
      return {
        title: book.title || '',
        authors: book.authors || [],
        categories: book.categories || [],
        description: book.description || '',
        cover: book.imageLinks?.thumbnail || '',
      };
    } catch (err) {
      console.error("Google Books API error:", err);
      return null;
    }
  }
  