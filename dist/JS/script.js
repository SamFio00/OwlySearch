const searchInput = document.querySelector('#searchInput');
const form = document.querySelector('.search-wrapper');
const resultsDiv = document.querySelector('.results');
const loadingDiv = document.querySelector('.loading'); // ✅ Loading div

const modal = document.querySelector(".modal");
const modalTitle = document.querySelector(".modal-title");
const modalPlot = document.querySelector(".modal-plot");
const closeModalBtn = document.querySelector(".close-modal");

// 🔥 Pagination variables
let allBooks = [];
let booksShown = 0;
const booksPerPage = 12;

// 🔹 Open modal
function openModal(book) {
    modalTitle.textContent = book.title;
    modalPlot.textContent = book.plot;
    modal.classList.remove("hidden");
}

closeModalBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
});

modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.add("hidden");
    }
});

// 🔥 Render books function
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

        popupBtn.addEventListener("click", async () => {
            try {
                const detailRes = await fetch(`https://openlibrary.org${book.key}.json`);
                const detail = await detailRes.json();

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

            } catch {
                openModal({
                    title: book.title,
                    plot: "Unable to load description."
                });
            }
        });
    });

    booksShown += nextBooks.length;

    addLoadMoreButton();
}

// 🔥 Add Load More button
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

// 🔥 Form submit
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const query = searchInput.value.toLowerCase().trim();
    if (!query) return;

    // ✅ Mostra loading all’inizio
    loadingDiv.classList.remove("hidden");

    try {
        const response = await fetch(`https://openlibrary.org/subjects/${query}.json?limit=100`);
        const data = await response.json();

        resultsDiv.innerHTML = "";
        booksShown = 0;
        allBooks = data.works || [];

        if (allBooks.length === 0) {
            resultsDiv.innerHTML = "<p>No books found for this category.</p>";
            return;
        }

        renderBooks();

        resultsDiv.scrollIntoView({ behavior: "smooth", block: "start" });

    } catch {
        resultsDiv.innerHTML = "<p>Error fetching books. Please try again.</p>";
    } finally {
        // ✅ Nascondi loading quando fetch finisce
        loadingDiv.classList.add("hidden");
    }
});
