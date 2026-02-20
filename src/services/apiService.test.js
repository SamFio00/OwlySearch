import axios from "axios";
import { describe, test, expect, vi, beforeEach } from "vitest";

vi.mock("axios", () => {
    return {
        default: {
            create: vi.fn()
        }
    };
});

describe("apiService", () => {
  let mockGet;

  beforeEach(() => {

    mockGet = vi.fn();


    axios.create.mockReturnValue({ get: mockGet });

    vi.resetModules();
  });

  test("fetchBooksByCategory returns data works", async () => {
    mockGet.mockResolvedValue({
      data: { works: [{ title: "Book 1" }, { title: "Book 2" }] },
    });

    const { fetchBooksByCategory } = await import("./apiService.js");
    const result = await fetchBooksByCategory("fantasy");

    expect(mockGet).toHaveBeenCalledWith("/subjects/fantasy.json", {
      params: { limit: 100 },
    });
    expect(result).toEqual([{ title: "Book 1" }, { title: "Book 2" }]);
  });

  test("fetchBooksByCategory returns [] if works is missing", async () => {
    mockGet.mockResolvedValue({ data: {} });

    const { fetchBooksByCategory } = await import("./apiService.js");
    const result = await fetchBooksByCategory("fantasy");

    expect(result).toEqual([]);
  });

  test("fetchBookDetails calls /<bookKey>.json and returns data", async () => {
    mockGet.mockResolvedValue({ data: { title: "Book Details" } });

    const { fetchBookDetails } = await import("./apiService.js");
    const result = await fetchBookDetails("/works/OL123W");

    expect(mockGet).toHaveBeenCalledWith("/works/OL123W.json");
    expect(result).toEqual({ title: "Book Details" });
  });
});
