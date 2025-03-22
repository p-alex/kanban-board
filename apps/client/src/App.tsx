import LoggedInLayout from "./components/LoggedInLayout/LoggedInLayout";
import { ThemeContextProvider } from "./context/ThemeContext";
import useLocalStorage from "./hooks/useLocalStorage";

function App() {
  const localStorage = useLocalStorage();

  return (
    <ThemeContextProvider localStorage={localStorage}>
      <LoggedInLayout></LoggedInLayout>
    </ThemeContextProvider>
  );
}

export default App;
