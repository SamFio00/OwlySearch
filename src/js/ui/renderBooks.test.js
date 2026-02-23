import { describe, test, expect, vi, beforeEach } from "vitest";

// Mock imported modules
vi.mock("../services/apiService.js", () => ({
  fetchBookDetails: vi.fn(),
}));

vi.mock("./modal.js", () => ({
  openModal: vi.fn(),
}));

vi.mock("./pagination.js", () => ({
  addLoadMoreButton: vi.fn(),
}));

describe("renderBooks", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.clearAllMocks();
    vi.resetModules();
  });

  test("renders book cards and updates booksShown", async () => {
    const resultsDiv = document.createElement("div");
    document.body.appendChild(resultsDiv);

    const state = {
      allBooks: [
        { title: "Book 1", key: "/works/OL1W", cover_id: 123, authors: [{ name: "Author 1" }] },
        { title: "Book 2", key: "/works/OL2W", authors: [{ name: "Author 2" }] },
      ],
      booksShown: { value: 0 },
      booksPerPage: 2,
    };

    const { renderBooks } = await import("./renderBooks.js");
    renderBooks(state, resultsDiv);

    const cards = resultsDiv.querySelectorAll(".book-card");
    expect(cards.length).toBe(2);

    const buttons = resultsDiv.querySelectorAll(".popup-btn");
    expect(buttons.length).toBe(2);

    expect(state.booksShown.value).toBe(2);
  });

  test("clicking Read summary fetches book details and opens modal with plot", async () => {
    const resultsDiv = document.createElement("div");
    document.body.appendChild(resultsDiv);

    const state = {
      allBooks: [{ title: "Book 1", key: "/works/OL1W", authors: [{ name: "Author 1" }] }],
      booksShown: { value: 0 },
      booksPerPage: 1,
    };

    const api = await import("../services/apiService.js");
    const modal = await import("./modal.js");

    api.fetchBookDetails.mockResolvedValue({
      description: "This is the book description",
    });

    const { renderBooks } = await import("./renderBooks.js");
    renderBooks(state, resultsDiv);

    const btn = resultsDiv.querySelector(".popup-btn");
    btn.click();

    await vi.waitFor(() => {
      expect(api.fetchBookDetails).toHaveBeenCalledWith("/works/OL1W");
      expect(modal.openModal).toHaveBeenCalledWith({
        title: "Book 1",
        plot: "This is the book description",
      });
    });

    expect(btn.textContent).toBe("Read summary");
  });

  test("if fetchBookDetails fails, openModal shows error message", async () => {
    const resultsDiv = document.createElement("div");
    document.body.appendChild(resultsDiv);

    const state = {
      allBooks: [{ title: "Book 1", key: "/works/OL1W" }],
      booksShown: { value: 0 },
      booksPerPage: 1,
    };

    const api = await import("../services/apiService.js");
    const modal = await import("./modal.js");

    api.fetchBookDetails.mockRejectedValue(new Error("Network error"));

    const { renderBooks } = await import("./renderBooks.js");
    renderBooks(state, resultsDiv);

    const btn = resultsDiv.querySelector(".popup-btn");
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    btn.click();

    await vi.waitFor(() => {
      expect(modal.openModal).toHaveBeenCalledWith({
        title: "Book 1",
        plot: "Unable to load description.",
      });
    });

    expect(btn.textContent).toBe("Read summary");
  });
});