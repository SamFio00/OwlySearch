import { fetchBookDetails } from "../services/apiService.js";
import { openModal } from "./modal.js";
import { addLoadMoreButton } from "./pagination.js";

export function renderBooks(state, resultsDiv) {
  const { allBooks, booksShown, booksPerPage } = state;

  const nextBooks = allBooks.slice(
    booksShown.value,
    booksShown.value + booksPerPage
  );

  nextBooks.forEach((book) => {
    const bookDiv = document.createElement("div");
    bookDiv.classList.add("book-card");

    const coverUrl = book.cover_id
      ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`
      : "/src/media/img/default_cover.jpg";

    const authors = book.authors
      ? book.authors.map((a) => a.name).join(", ")
      : "Unknown author";

    bookDiv.innerHTML = `
      <img src="${coverUrl}" alt="${book.title}">
      <h3>${book.title}</h3>
      <p>${authors}</p>
      <button class="popup-btn">Read summary</button>
    `;

    resultsDiv.appendChild(bookDiv);

    const popupBtn = bookDiv.querySelector(".popup-btn");

    popupBtn.addEventListener("click", async () => {
      const originalText = popupBtn.textContent;
      popupBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i>`;

      try {
        const detail = await fetchBookDetails(book.key);

        let plot = "Description not available.";

        if (detail.description) {
          plot =
            typeof detail.description === "string"
              ? detail.description
              : detail.description.value;
        }

        openModal({
          title: book.title,
          plot,
        });
      } catch (error) {
        openModal({
          title: book.title,
          plot: "Unable to load description.",
        });

        console.error(error);
      } finally {
        popupBtn.textContent = originalText;
      }
    });
  });

  booksShown.value += nextBooks.length;

  addLoadMoreButton(
    resultsDiv,
    booksShown.value,
    state.allBooks,
    () => renderBooks(state, resultsDiv)
  );
}
