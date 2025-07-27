import { Link } from "react-router-dom";

function BigLogo() {
  return (
    <Link to={"/boards"}>
      <p
        className="text-2xl font-bold text-black dark:text-white"
        data-testid="logo"
      >
        Boardly
      </p>
    </Link>
  );
}

export default BigLogo;
