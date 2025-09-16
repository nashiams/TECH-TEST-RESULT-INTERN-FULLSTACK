import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import AuthLayout from "./layouts/authLayout";
import HomePage from "./pages/productPages/homePage";
import { MainLayout } from "./layouts/mainLayout";
import AuthPages from "./pages/authPages/authPage";
import DetailPage from "./pages/productPages/detailPage";
import AddEditPage from "./pages/productPages/addEditPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/register" element={<AuthPages />} />
          <Route path="/login" element={<AuthPages />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="detail/:id" element={<DetailPage />} />
          <Route path="add" element={<AddEditPage />} />
          <Route path="edit/:id" element={<AddEditPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
