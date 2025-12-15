import { BrowserRouter as Router, Routes, Route } from "react-router";
import UserProfiles from "./pages/UserProfiles";
import Calendar from "./pages/Calendar";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import CategoryPage from "./pages/Kategoriya/CategoryPage";
import QismCategory from "./pages/Kategoriya/QismCategory";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/kochirishlar" element={<Blank />} />

            {/* Forms */}
            <Route path="/eksponatlar" element={<FormElements />} />
            <Route path="/kategoriyalar" element={<CategoryPage />} />
            <Route path="/qism-kategoriyalar" element={<QismCategory />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}
