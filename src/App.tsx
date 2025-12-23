import { BrowserRouter as Router, Routes, Route } from "react-router";
import Calendar from "./pages/Calendar";
import FormElements from "./pages/Forms/FormElements";
import Kuchirishlar from "./pages/Kuchirishlar";
import HistoryPage from "./pages/History";
import AdminManagement from "./pages/AdminManagement";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import CategoryPage from "./pages/Kategoriya/CategoryPage";
import QismCategory from "./pages/Kategoriya/QismCategory";
import LoginPage from "./pages/Auth/Login";
import ProtectedRoute from "./components/common/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<AppLayout />}>
          <Route
            index
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <Calendar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/kochirishlar"
            element={
              <ProtectedRoute>
                <Kuchirishlar />
              </ProtectedRoute>
            }
          />

          <Route
            path="/eksponatlar"
            element={
              <ProtectedRoute>
                <FormElements />
              </ProtectedRoute>
            }
          />
          <Route
            path="/kategoriyalar"
            element={
              <ProtectedRoute>
                <CategoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/qism-kategoriyalar"
            element={
              <ProtectedRoute>
                <QismCategory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tarix"
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-boshqaruvi"
            element={
              <ProtectedRoute>
                <AdminManagement />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}
