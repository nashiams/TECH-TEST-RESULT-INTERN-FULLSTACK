import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import AuthLayout from "./layouts/authLayout";
import HomePage from "./pages/productPages/homePage";
import { MainLayout } from "./layouts/mainLayout";
import AuthPages from "./pages/authPages/authPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthLayout />}>
          <Route index element={<AuthPages />} />
        </Route>
        <Route path="/register" element={<AuthLayout />}>
          <Route index element={<AuthPages />} />
        </Route>

        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
