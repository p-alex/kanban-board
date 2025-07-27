import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeContextProvider } from "./context/ThemeContext";
import useLocalStorage from "./hooks/useLocalStorage";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Route, Routes } from "react-router-dom";
import { lazy } from "react";
import AuthContextProvider from "./context/AuthContext/AuthContextProvider";
import RefreshSessionRouteWrapper from "./routerComponents/RefreshSessionRouteWrapper";
import ProtectedRoute from "./routerComponents/ProtectedRoute";
import RedirectIfLoggedIn from "./routerComponents/RedirectIfLoggedIn";
import RedirectTo from "./routerComponents/RedirectToRoute";

const BoardsPage = lazy(() => import("./pages/BoardsPage"));
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
                path="/boards"
                element={
                  <ProtectedRoute>
                    <BoardsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/boards/:id/:title"
                element={
                  <ProtectedRoute>
                    <p>boards</p>
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

              <Route path="*" element={<RedirectTo to="/boards" />} />
            </Routes>
          </RefreshSessionRouteWrapper>
        </ThemeContextProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </AuthContextProvider>
    </QueryClientProvider>
  );
}

export default App;
