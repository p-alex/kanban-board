import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

const client = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      enabled: false,
    },
    mutations: {
      retry: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={client}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </QueryClientProvider>
);
