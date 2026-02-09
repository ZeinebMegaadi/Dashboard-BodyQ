import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppLayout from './layout/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import ActivityPage from './pages/ActivityPage';
import NutritionPage from './pages/NutritionPage';
import ProfilePage from './pages/ProfilePage';
import InsightsPage from './pages/InsightsPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/activity" element={<ActivityPage />} />
            <Route path="/nutrition" element={<NutritionPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
