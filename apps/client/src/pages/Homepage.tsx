import LoggedInLayout from "../components/LoggedInLayout/index.js";
import useLocalStorage from "../hooks/useLocalStorage/index.js";

function Homepage() {
  const localStorage = useLocalStorage();

  return (
    <LoggedInLayout localStorage={localStorage}>
      This is the container!!
    </LoggedInLayout>
  );
}

export default Homepage;
