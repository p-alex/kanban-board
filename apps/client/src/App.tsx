import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeContextProvider } from "./context/ThemeContext";
import useLocalStorage from "./hooks/useLocalStorage";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Route, Routes } from "react-router-dom";
import { lazy } from "react";
import AuthContextProvider from "./context/AuthContext/AuthContextProvider";
import RedirectTo from "./RedirectToRoute";
import RedirectIfLoggedIn from "./RedirectIfLoggedIn";
import ProtectedRoute from "./ProtectedRoute";
import RefreshSessionRouteWrapper from "./RefreshSessionRouteWrapper";

const HomePage = lazy(() => import("./pages/Homepage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));

function App() {
  const localStorage = useLocalStorage();

  const client = new QueryClient();

  return (
    <QueryClientProvider client={client}>
      <AuthContextProvider>
        <ThemeContextProvider localStorage={localStorage}>
          <RefreshSessionRouteWrapper>
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/login"
                element={
                  <RedirectIfLoggedIn>
                    <LoginPage />
                  </RedirectIfLoggedIn>
                }
              />
              <Route
                path="/register"
                element={
                  <RedirectIfLoggedIn>
                    <RegisterPage />
                  </RedirectIfLoggedIn>
                }
              />

              <Route path="*" element={<RedirectTo to="/" />} />
            </Routes>
          </RefreshSessionRouteWrapper>
        </ThemeContextProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </AuthContextProvider>
    </QueryClientProvider>
  );
}

export default App;
