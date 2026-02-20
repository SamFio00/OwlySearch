// Modal elements
const modal = document.querySelector(".modal");
const modalTitle = document.querySelector(".modal-title");
const modalPlot = document.querySelector(".modal-plot");
const closeModalBtn = document.querySelector(".close-modal");

// Open modal
export function openModal({ title, plot }) {
  modalTitle.textContent = title;
  modalPlot.textContent = plot;
  modal.classList.remove("hidden");
}

// Init modal events
export function initModal() {
  closeModalBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  });
}
