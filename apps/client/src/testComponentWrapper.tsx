import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function TestComponentWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={new QueryClient()}>
      {children}
    </QueryClientProvider>
  );
}
