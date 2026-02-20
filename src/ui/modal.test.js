import { describe, test, expect, beforeEach, vi } from "vitest";

describe("modal", () => {

  beforeEach(() => {
    document.body.innerHTML = `
      <div class="modal hidden">
        <div class="modal-content">
          <button class="close-modal">X</button>
          <h2 class="modal-title"></h2>
          <p class="modal-plot"></p>
        </div>
      </div>
    `;

    vi.resetModules();
    vi.clearAllMocks();
  });

  test("openModal displays modal with correct title and plot", async () => {
    const { openModal } = await import("./modal.js");

    openModal({ title: "Test Book", plot: "Test description" });

    const modal = document.querySelector(".modal");
    const title = document.querySelector(".modal-title");
    const plot = document.querySelector(".modal-plot");

    expect(modal.classList.contains("hidden")).toBe(false);
    expect(title.textContent).toBe("Test Book");
    expect(plot.textContent).toBe("Test description");
  });

  test("clicking close button hides modal", async () => {
    const { openModal, initModal } = await import("./modal.js");

    initModal();
    openModal({ title: "Book", plot: "Plot" });

    const closeBtn = document.querySelector(".close-modal");
    closeBtn.click();

    const modal = document.querySelector(".modal");
    expect(modal.classList.contains("hidden")).toBe(true);
  });

  test("clicking outside modal content hides modal", async () => {
    const { openModal, initModal } = await import("./modal.js");

    initModal();
    openModal({ title: "Book", plot: "Plot" });

    const modal = document.querySelector(".modal");
    
    modal.click(); // simulate click on overlay

    expect(modal.classList.contains("hidden")).toBe(true);
  });

});