export function addLoadMoreButton(resultsDiv, booksShown, allBooks, renderBooks) {
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
