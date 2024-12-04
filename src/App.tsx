import { Route, Routes } from "react-router-dom";

import LoginPage from "@/pages/login";
import BundlesPage from "@/pages/bundles";
import CategoriesPage from "@/pages/categories";
import ProductsPage from "@/pages/products";
import PromotionsPage from "@/pages/promotions";

function App() {
  return (
    <Routes>
      <Route element={<LoginPage />} path="/" />
      <Route element={<BundlesPage />} path="/bundles" />
      <Route element={<CategoriesPage />} path="/categories" />
      <Route element={<ProductsPage />} path="/products" />
      <Route element={<PromotionsPage />} path="/promotions" />
    </Routes>
  );
}

export default App;
