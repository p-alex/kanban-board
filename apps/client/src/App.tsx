import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoggedInLayout from "./components/LoggedInLayout/LoggedInLayout";
import { ThemeContextProvider } from "./context/ThemeContext";
import useLocalStorage from "./hooks/useLocalStorage";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function App() {
  const localStorage = useLocalStorage();

  const client = new QueryClient();

  return (
    <QueryClientProvider client={client}>
      <ThemeContextProvider localStorage={localStorage}>
        <LoggedInLayout localStorage={localStorage}>
          This is the container!!
        </LoggedInLayout>
      </ThemeContextProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
