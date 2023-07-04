import { Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header";
import HomePage from "./pages/HomePage";
import Footer from "./components/Footer";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import SignPage from "./pages/signUpPage/SignPage";
import CreatCardPage from "./pages/CreatCardPage";
import EditCardPage from "./pages/EditCardPage";
import MyCardsPage from "./pages/MyCardsPage";
import FavoriteCardPage from "./pages/FavoriteCardPage";
import ViewCardPage from "./pages/ViewCardPage";
// import PrimarySearchAppBar from "./components/Header/Header";
import { Container } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { verifyToken } from "./auth/TokenManager";
import RouteGuard from "./auth/RouteGuard";
import React from "react";
import AppThemeProvider from "./plugins/mui";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/signUpPage/EditProfilePage";
import SandBox from "./pages/SandBox";

function App() {
  const [mode, setMode] = React.useState<"light" | "dark">("light");

  function themeToggle() {
    const toggleMode = mode === "dark" ? "light" : "dark";
    setMode(toggleMode);
  }

  return (
    <>
      <AppThemeProvider mode={mode}>
        <CssBaseline />
        <Header themeToggle={themeToggle} />
        <ToastContainer position="top-right" theme="light" />
        <Container fixed sx={{ margin: "10px auto" }}>
          <Container sx={{ margin: "60px auto", minHeight: "700px" }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/sign" element={<SignPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/view-card/:id" element={<ViewCardPage />} />

              <Route
                path="/favorite-card"
                element={
                  <RouteGuard>
                    <FavoriteCardPage />
                  </RouteGuard>
                }
              />
              <Route
                path="/profile"
                element={
                  <RouteGuard>
                    <ProfilePage />
                  </RouteGuard>
                }
              />
              <Route
                path="/edit-user"
                element={
                  <RouteGuard>
                    <EditProfilePage />
                  </RouteGuard>
                }
              />
              <Route
                path="/create-card"
                element={
                  <RouteGuard level={2}>
                    <CreatCardPage />
                  </RouteGuard>
                }
              />
              <Route
                path="/my-cards"
                element={
                  <RouteGuard level={2}>
                    <MyCardsPage />
                  </RouteGuard>
                }
              />
              <Route
                path="/edit-card/:id"
                element={
                  <RouteGuard level={2}>
                    <EditCardPage />
                  </RouteGuard>
                }
              />

              <Route
                path="/sandbox"
                element={
                  <RouteGuard level={3}>
                    <SandBox />
                  </RouteGuard>
                }
              />
            </Routes>
          </Container>
        </Container>
        {/* </div> */}
        <Footer />
      </AppThemeProvider>
    </>
  );
}

export default App;
