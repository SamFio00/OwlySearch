import { describe, test, expect, beforeEach, vi } from "vitest";

describe("addLoadMoreButton", () => {

  beforeEach(() => {
    document.body.innerHTML = "";
    vi.resetModules();
    vi.clearAllMocks();
  });

  test("adds Load more button when booksShown is less than total books", async () => {
    const resultsDiv = document.createElement("div");
    document.body.appendChild(resultsDiv);

    const booksShown = 2;
    const allBooks = [1, 2, 3, 4];

    const callback = vi.fn();

    const { addLoadMoreButton } = await import("./pagination.js");

    addLoadMoreButton(resultsDiv, booksShown, allBooks, callback);

    const btn = resultsDiv.querySelector(".load-more");

    expect(btn).not.toBeNull();
    expect(btn.textContent).toBe("Load more");
  });

  test("does not add button when all books are already shown", async () => {
    const resultsDiv = document.createElement("div");
    document.body.appendChild(resultsDiv);

    const booksShown = 4;
    const allBooks = [1, 2, 3, 4];

    const callback = vi.fn();

    const { addLoadMoreButton } = await import("./pagination.js");

    addLoadMoreButton(resultsDiv, booksShown, allBooks, callback);

    const btn = resultsDiv.querySelector(".load-more");

    expect(btn).toBeNull();
  });

  test("removes existing button before adding a new one", async () => {
    const resultsDiv = document.createElement("div");
    document.body.appendChild(resultsDiv);

    // simulate existing button
    const oldBtn = document.createElement("button");
    oldBtn.classList.add("load-more");
    document.body.appendChild(oldBtn);

    const booksShown = 1;
    const allBooks = [1, 2, 3];

    const callback = vi.fn();

    const { addLoadMoreButton } = await import("./pagination.js");

    addLoadMoreButton(resultsDiv, booksShown, allBooks, callback);

    const buttons = document.querySelectorAll(".load-more");

    expect(buttons.length).toBe(1);
  });

  test("clicking the button calls the renderBooks callback", async () => {
    const resultsDiv = document.createElement("div");
    document.body.appendChild(resultsDiv);

    const booksShown = 1;
    const allBooks = [1, 2, 3];

    const callback = vi.fn();

    const { addLoadMoreButton } = await import("./pagination.js");

    addLoadMoreButton(resultsDiv, booksShown, allBooks, callback);

    const btn = resultsDiv.querySelector(".load-more");

    btn.click();

    expect(callback).toHaveBeenCalled();
  });

});