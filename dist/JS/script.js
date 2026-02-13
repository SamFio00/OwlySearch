const searchInput = document.querySelector('#searchInput');
const form = document.querySelector('.search-wrapper');
const resultsDiv = document.querySelector('.results');
const loadingDiv = document.querySelector('.loading');

const modal = document.querySelector(".modal");
const modalTitle = document.querySelector(".modal-title");
const modalPlot = document.querySelector(".modal-plot");
const closeModalBtn = document.querySelector(".close-modal");

// Pagination state variables
let allBooks = [];
let booksShown = 0;
const booksPerPage = 12;

// Open modal with book details
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

// Render books based on current pagination state
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
            const originalText = popupBtn.textContent; 
            popupBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i>`; 

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
            } finally {
                popupBtn.textContent = originalText; 
            }
        });

    });

    booksShown += nextBooks.length;

    addLoadMoreButton();
}

// Create and append the "Load More" button if needed
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

// Handle form submission and fetch books by subject
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const query = encodeURIComponent(searchInput.value
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "_"));
    if (!query) return;

    // Show loading indicator before starting the request
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
        // Hide loading indicator once the request completes
        loadingDiv.classList.add("hidden");
    }
});



// Get the scroll button element
const scrollBtn = document.getElementById("scrollTopBtn");
const searchWrapper = document.querySelector(".container");

// Show the button when scrolling down 200px
window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
        scrollBtn.classList.add("show");
    } else {
        scrollBtn.classList.remove("show");
    }
});

// Scroll smoothly to the search input when button clicked
scrollBtn.addEventListener("click", () => {
    searchWrapper.scrollIntoView({ behavior: "smooth", block: "start" });
});
