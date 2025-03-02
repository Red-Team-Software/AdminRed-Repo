import { Route, Routes } from "react-router-dom";

import LoginPage from "@/pages/login";
import BundlesPage from "@/pages/bundles/bundles";
import CategoriesPage from "@/pages/categories/categories";
import ProductsPage from "@/pages/products/products";
import ProtectedRoute from "@/config/protected-route";
import PromotionsPage from "./pages/promotions/promotions";
import CuponsPage from "./pages/cupons/cupons";


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
      <Route
        element={
          <ProtectedRoute>
            <CuponsPage />
          </ProtectedRoute>
        }
        path="/cupons"
      />
    </Routes>
  );
}

export default App;
