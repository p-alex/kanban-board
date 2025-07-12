import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function RedirectTo({ to }: { to: string }) {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(to, { replace: true });
  }, []);

  return null;
}

export default RedirectTo;
