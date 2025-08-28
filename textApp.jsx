import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./queryClient.js";

// ROUTES
import { publicRoutes, protectedRoutes } from "./appRoute.js";

// LAYOUT
import Layout_Auth from "./layout/Layout_Auth";

// COMMON
// import NotFoundPage from "./components/common/NotFoundPage";

// MIDDLEWARE
// import TokenValidator from "./components/auth/TokenValidator";
// import AuthGuard from "./middleware/AuthGuard";
import ProtectedRoute from "./middleware/ProtectedRoute";

const App = () => {
  useEffect(() => {
    // enableSecurityFeatures();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <TokenValidator>
          <Routes>
            {/* Root redirect */}
            <Route path="/" element={<Navigate to="/auth/login" replace />} />

            {/* Auth Layout */}
            <Route path="/auth" element={<Layout_Auth />}>
              {publicRoutes.map((route, index) => (
                <Route
                  key={index}
                  path={route.path.replace("/auth", "").replace(/^\//, "")} // ví dụ: "login" / "register"
                  element={
                    route.path.includes("login") ? (
                      <AuthGuard>
                        <route.component />
                      </AuthGuard>
                    ) : (
                      <route.component />
                    )
                  }
                />
              ))}
            </Route>

            {/* Protected Routes (sau này mở rộng) */}
            {Object.entries(protectedRoutes).map(([key, group]) => {
              const Layout = group.layout;

              if (Layout) {
                return (
                  <Route
                    key={key}
                    element={
                      <ProtectedRoute allowedRoles={group.roles}>
                        <Layout>
                          <Outlet />
                        </Layout>
                      </ProtectedRoute>
                    }
                  >
                    {group.routes.map((route, index) => (
                      <Route
                        key={`${key}-${index}`}
                        path={route.path}
                        element={<route.component />}
                      />
                    ))}
                  </Route>
                );
              }

              return group.routes.map((route, index) => (
                <Route
                  key={`standalone-${index}`}
                  path={route.path}
                  element={
                    <ProtectedRoute allowedRoles={group.roles}>
                      <route.component />
                    </ProtectedRoute>
                  }
                />
              ));
            })}

            {/* Catch all route - 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>

        </TokenValidator>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
