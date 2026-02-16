// ==============================
// DOM Elements
// ==============================

const searchInput = document.querySelector('#searchInput');
const form = document.querySelector('.search-wrapper');
const resultsDiv = document.querySelector('.results');
const loadingDiv = document.querySelector('.loading');

const modal = document.querySelector(".modal");
const modalTitle = document.querySelector(".modal-title");
const modalPlot = document.querySelector(".modal-plot");
const closeModalBtn = document.querySelector(".close-modal");

const scrollBtn = document.getElementById("scrollTopBtn");
const searchWrapper = document.querySelector(".container");


// ==============================
// Axios Instance (Professional Setup)
// ==============================

const api = axios.create({
    baseURL: "https://openlibrary.org",
    timeout: 5000
});


// ==============================
// Pagination State
// ==============================

let allBooks = [];
let booksShown = 0;
const booksPerPage = 12;


// ==============================
// Modal Logic
// ==============================

// Open modal with book details
function openModal(book) {
    modalTitle.textContent = book.title;
    modalPlot.textContent = book.plot;
    modal.classList.remove("hidden");
}

// Close modal button
closeModalBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
});

// Close modal clicking outside
modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.add("hidden");
    }
});


// ==============================
// Render Books
// ==============================

function renderBooks() {

    const nextBooks = allBooks.slice(booksShown, booksShown + booksPerPage);

    nextBooks.forEach(book => {

        const bookDiv = document.createElement("div");
        bookDiv.classList.add("book-card");

        const coverUrl = book.cover_id
            ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`
            : 'dist/media/img/default_cover.jpg';

        const authors = book.authors
            ? book.authors.map(a => a.name).join(', ')
            : 'Unknown author';

        bookDiv.innerHTML = `
            <img src="${coverUrl}" alt="${book.title}">
            <h3>${book.title}</h3>
            <p>${authors}</p>
            <button class="popup-btn">Read summary</button>
        `;

        resultsDiv.appendChild(bookDiv);

        const popupBtn = bookDiv.querySelector(".popup-btn");

        // ==============================
        // Fetch Book Details (Axios)
        // ==============================

        popupBtn.addEventListener("click", async () => {

            const originalText = popupBtn.textContent;
            popupBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i>`;

            try {

                const { data: detail } = await api.get(`${book.key}.json`);

                let plot = "Description not available.";

                if (detail.description) {
                    plot = typeof detail.description === "string"
                        ? detail.description
                        : detail.description.value;
                }

                openModal({
                    title: book.title,
                    plot: plot
                });

            } catch (error) {

                openModal({
                    title: book.title,
                    plot: "Unable to load description."
                });

                console.error("Error fetching book details:", error);

            } finally {
                popupBtn.textContent = originalText;
            }

        });

    });

    booksShown += nextBooks.length;

    addLoadMoreButton();
}


// ==============================
// Load More Button
// ==============================

function addLoadMoreButton() {

    const existingBtn = document.querySelector(".load-more");
    if (existingBtn) existingBtn.remove();

    if (booksShown < allBooks.length) {

        const loadMoreBtn = document.createElement("button");
        loadMoreBtn.textContent = "Load more";
        loadMoreBtn.classList.add("load-more");

        loadMoreBtn.addEventListener("click", renderBooks);

        resultsDiv.appendChild(loadMoreBtn);
    }
}


// ==============================
// Search Form Submission
// ==============================

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const query = encodeURIComponent(
        searchInput.value
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "_")
    );

    if (!query) return;

    loadingDiv.classList.remove("hidden");

    try {

        const { data } = await api.get(`/subjects/${query}.json`, {
            params: { limit: 100 }
        });

        resultsDiv.innerHTML = "";
        booksShown = 0;
        allBooks = data.works || [];

        if (allBooks.length === 0) {
            resultsDiv.innerHTML = "<p>No books found for this category.</p>";
            return;
        }

        renderBooks();

        resultsDiv.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    } catch (error) {

        resultsDiv.innerHTML = "<p>Error fetching books. Please try again.</p>";
        console.error("Error fetching books:", error);

    } finally {

        loadingDiv.classList.add("hidden");

    }

});


// ==============================
// Scroll To Top Button
// ==============================

// Show button after scrolling 400px
window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
        scrollBtn.classList.add("show");
    } else {
        scrollBtn.classList.remove("show");
    }
});

// Smooth scroll to search section
scrollBtn.addEventListener("click", () => {
    searchWrapper.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});
