
import React from 'react';
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { publicRoutes, protectedRoutes } from "./routes/AppRouter.js";
import ProtectedRoute from "./middleware/ProtectedRoute.jsx";
import TokenValidator from "./components/Auth/TokenValidator";
import AuthGuard from "./middleware/AuthGuard";
// import { Toaster } from 'sonner';
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./queryClient.js";
=======
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Layout_Auth from "./layout/Layout_Auth";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Verify from "./pages/auth/Verify";
// user
import Layout_user from "./layout/Layout_user";
import Dashboard from "./pages/user/Dashboard";
import NotesList from "./pages/user/Notes_Pages";


const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TokenValidator>
        <Routes>
          {/* Redirect /auth -> /auth/login */}
          <Route path="/auth" element={<Navigate to="/auth/login" replace />} />

          {/* Public Routes */}
          {publicRoutes.map((route, index) => {
            const Layout = route.layout || React.Fragment; // dùng Layout nếu có, không thì Fragment
            const element = route.path.includes('login') ? (
              <AuthGuard>
                <route.component />
              </AuthGuard>
            ) : (
              <route.component />
            );

            return (
              <Route
                key={index}
                element={<Layout><Outlet /></Layout>} // Layout dùng Outlet
              >
                <Route path={route.path} element={element} />
              </Route>
            );
          })}

          {/* Protected Routes */}
          {Object.entries(protectedRoutes).map(([key, group]) => {
            const Layout = group.Layout || React.Fragment; // Layout user

            return (
              <Route
                key={key}
                element={
                  <ProtectedRoute allowedRoles={group.role}>
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
          })}

          {/* Catch-all 404 */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>

        {/* <Toaster position="top-right" richColors duration={1500} expand visibleToasts={1} /> */}
      </TokenValidator>
    </QueryClientProvider>
  );
};

export default App;
