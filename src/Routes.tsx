import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/LoginPage";
import { Register } from "./pages/RegisterPage";
import AppLayout from "./components/layout/AppLayout";
import { Home } from "./home";
import { useAuth } from "./contexts/authContext";
import { NotFound } from "./pages/NotFoundPage";
import { LoadingPage } from "./pages/LoadingPage";
import { GoogleAuthCallback } from "./components/auth/GoogleAuthCallback";
import { Profile } from "./components/profile/Profile";
import ImageUploaderWithCrop from "./components/upload/ImageUploaderWithCrop";
import { NotificationPanel } from "./components/notification/NotificationPannel";

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingPage />;
  }

  console.log(user);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/" />}
        />
        <Route path="/google/callback" element={<GoogleAuthCallback />} />

        <Route
          path="/"
          element={user ? <AppLayout /> : <Navigate to="/login" />}>
          <Route index element={<Home />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/upload" element={<ImageUploaderWithCrop />} />
          <Route path="/notification" element={<NotificationPanel />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
