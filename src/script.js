import "./main.scss";

import { fetchBooksByCategory } from "./services/apiService.js";
import { renderBooks } from "./ui/renderBooks.js";
import { initModal } from "./ui/modal.js";

// ======================
// DOM Elements
// ======================

const searchInput = document.querySelector("#searchInput");
const form = document.querySelector(".search-wrapper");
const resultsDiv = document.querySelector(".results");
const loadingDiv = document.querySelector(".loading");

const scrollBtn = document.getElementById("scrollTopBtn");
const searchWrapper = document.querySelector(".container");

// ======================
// App State
// ======================

const state = {
  allBooks: [],
  booksShown: { value: 0 },
  booksPerPage: 12,
};

// ======================
// Init
// ======================

initModal();

// ======================
// Search Form
// ======================

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const query = encodeURIComponent(
    searchInput.value.toLowerCase().trim().replace(/\s+/g, "_")
  );

  if (!query) return;

  loadingDiv.classList.remove("hidden");

  try {
    const books = await fetchBooksByCategory(query);

    resultsDiv.innerHTML = "";
    state.booksShown.value = 0;
    state.allBooks = books;

    if (books.length === 0) {
      resultsDiv.innerHTML = "<p>No books found for this category.</p>";
      return;
    }

    renderBooks(state, resultsDiv);

    resultsDiv.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  } catch (error) {
    resultsDiv.innerHTML = "<p>Error fetching books. Please try again.</p>";
    console.error(error);
  } finally {
    loadingDiv.classList.add("hidden");
  }
});

// ======================
// Scroll To Top
// ======================

window.addEventListener("scroll", () => {
  if (window.scrollY > 400) {
    scrollBtn.classList.add("show");
  } else {
    scrollBtn.classList.remove("show");
  }
});

scrollBtn.addEventListener("click", () => {
  searchWrapper.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
});
