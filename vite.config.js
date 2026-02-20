import { defineConfig } from "vite";

export default defineConfig({
  base: "/OwlySearch/",
  test: {
    globals: true,
    environment: "jsdom",
  },
});