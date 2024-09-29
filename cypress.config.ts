import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) { },
    env: {
      SERVER_URL: "http://localhost:3001",
    }
  },
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
})