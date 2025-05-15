import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";

export function TestComponentWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MemoryRouter>
      <QueryClientProvider client={new QueryClient()}>
        {children}
      </QueryClientProvider>
    </MemoryRouter>
  );
}
