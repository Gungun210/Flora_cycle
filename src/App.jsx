import { BrowserRouter, Routes, Route } from "react-router-dom";
import FloraCycleHero from "./pages/FloraCycleHero";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Petals from "./components/Petals";
import Story from "./components/story";
import "./components/style.css";

function App() {
  return (
    <BrowserRouter>
      <Petals />
      <Routes>
        <Route path="/" element={
          <>
            <FloraCycleHero />
            <Story />
            <Footer />
          </>
        } />
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
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;