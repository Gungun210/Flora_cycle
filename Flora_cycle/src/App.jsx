<<<<<<< HEAD
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FloraCycleHero from "./pages/FloraCycleHero";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Petals from "./components/Petals";
import Story from "./components/story";
import "./components/style.css";

=======
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import FloraCycleHero from "./pages/FloraCycleHero";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import TempleDashboard from "./pages/TempleDashboard";
import VendorDashboard from "./pages/VendorDashboard";
import Petals from "./components/Petals";
import Story from "./components/story";
import Footer from "./components/Footer";
import "./components/style.css";

// Route guard — redirects to /login if not logged in
function PrivateRoute({ children }) {
  const token = localStorage.getItem("fc_token");
  return token ? children : <Navigate to="/login" />;
}

// Smart dashboard redirect based on role
function DashboardRedirect() {
  const role = localStorage.getItem("fc_role");
  if (role === "temple") return <Navigate to="/dashboard/temple" />;
  if (role === "vendor") return <Navigate to="/dashboard/vendor" />;
  return <Navigate to="/login" />;
}

>>>>>>> 514c23e (Added backend to temples and vendors dashboard)
function App() {
  return (
    <BrowserRouter>
      <Petals />
      <Routes>
<<<<<<< HEAD
=======
        {/* Public pages */}
>>>>>>> 514c23e (Added backend to temples and vendors dashboard)
        <Route path="/" element={
          <>
            <FloraCycleHero />
            <Story />
            <Footer />
          </>
        } />
<<<<<<< HEAD
        <Route path="/register" element={
          <>
            <RegisterPage />
            <Footer />
          </>
        } />
        <Route path="/login" element={
          <>
            <LoginPage />
            <Footer />
          </>
=======
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login"    element={<LoginPage />} />

        {/* Dashboard redirect */}
        <Route path="/dashboard" element={<DashboardRedirect />} />

        {/* Protected dashboards */}
        <Route path="/dashboard/temple" element={
          <PrivateRoute><TempleDashboard /></PrivateRoute>
        } />
        <Route path="/dashboard/vendor" element={
          <PrivateRoute><VendorDashboard /></PrivateRoute>
>>>>>>> 514c23e (Added backend to temples and vendors dashboard)
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;