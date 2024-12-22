import { Route, Routes } from "react-router-dom";

import LoginPage from "@/pages/login";
import BundlesPage from "@/pages/bundles/bundles";
import CategoriesPage from "@/pages/categories/categories";
import ProductsPage from "@/pages/products/products";
import PromotionsPage from "@/pages/promotions";
import ProtectedRoute from "@/config/protected-route";
import ProductDetailsPage from "./pages/products/productDetails";


function App() {
  return (
    <Routes>
      <Route element={<LoginPage />} path="/" />
      <Route
        element={
          <ProtectedRoute>
            <BundlesPage />
          </ProtectedRoute>
        }
        path="/bundles"
      />
      <Route
        element={
          <ProtectedRoute>
            <CategoriesPage />
          </ProtectedRoute>
        }
        path="/categories"
      />
      <Route
        element={
          <ProtectedRoute>
            <ProductsPage />
          </ProtectedRoute>
        }
        path="/products"
      />
      <Route
        element={
          <ProtectedRoute>
            <PromotionsPage />
          </ProtectedRoute>
        }
        path="/promotions"
      />
    </Routes>
  );
}

export default App;
