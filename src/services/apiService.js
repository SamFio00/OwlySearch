import axios from "axios";

const api = axios.create({
  baseURL: "https://openlibrary.org",
  timeout: 15000
});

// search books by category
export async function fetchBooksByCategory(category) {
  const { data } = await api.get(`/subjects/${category}.json`, {
    params: { limit: 100 }
  });

  return data.works || [];
}

// books details by key
export async function fetchBookDetails(bookKey) {
  const { data } = await api.get(`${bookKey}.json`);
  return data;
}
