const searchInput = document.querySelector('#searchInput');
const searchBtn = document.querySelector('.search-btn');
const resultsDiv = document.querySelector('.results');

const modal = document.querySelector(".modal");
const modalTitle = document.querySelector(".modal-title");
const modalPlot = document.querySelector(".modal-plot");
const closeModalBtn = document.querySelector(".close-modal");

// Funzione per aprire il modal
function openModal(book) {
    modalTitle.textContent = book.title;
    modalPlot.textContent = book.plot;
    modal.classList.remove("hidden");
}

// Chiudi modal al click sulla X o fuori dal contenuto
closeModalBtn.addEventListener("click", () => modal.classList.add("hidden"));
modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.add("hidden");
});

// Event listener sul bottone di ricerca
searchBtn.addEventListener("click", async () => {
    const query = searchInput.value.toLowerCase().trim();
    if (!query) return;

    const url = `https://openlibrary.org/subjects/${query}.json`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // svuota risultati precedenti
        resultsDiv.innerHTML = "";

        // controlla se ci sono libri
        if (!data.works || data.works.length === 0) {
            resultsDiv.innerHTML = "<p>Nessun libro trovato per questa categoria.</p>";
            return;
        }

        // crea le card dei libri
        data.works.forEach(book => {
            const bookDiv = document.createElement("div");
            bookDiv.classList.add("book-card");

            // copertina
            const coverUrl = book.cover_id 
                ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`
                : 'dist/media/img/default_cover.jpg'; // copertina di default se non disponibile

            // autori
            const authors = book.authors ? book.authors.map(a => a.name).join(', ') : 'Autore sconosciuto';

            bookDiv.innerHTML = `
                <img src="${coverUrl}" alt="${book.title}">
                <h3>${book.title}</h3>
                <p>${authors}</p>
                <button class="popup-btn">Trama</button>
            `;

            resultsDiv.appendChild(bookDiv);

            // aggiungi popup con fetch della descrizione
            const popupBtn = bookDiv.querySelector(".popup-btn");
            popupBtn.addEventListener("click", async () => {
                try {
                    const detailRes = await fetch(`https://openlibrary.org${book.key}.json`);
                    const detail = await detailRes.json();

                    let plot = "Descrizione non disponibile";
                    if (detail.description) {
                        plot = typeof detail.description === 'string' 
                            ? detail.description 
                            : detail.description.value;
                    }

                    openModal({
                        title: book.title,
                        plot: plot
                    });

                } catch(err) {
                    console.error(err);
                    openModal({
                        title: book.title,
                        plot: "Descrizione non disponibile"
                    });
                }
            });
        });

        // scroll ai risultati
        resultsDiv.scrollIntoView({ behavior: "smooth", block: "start" });

    } catch (err) {
        console.error(err);
        resultsDiv.innerHTML = "<p>Errore nel recupero dei libri. Riprova.</p>";
    }
});
