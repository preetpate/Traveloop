import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { TripProvider } from './contexts/TripContext';
import { UIProvider } from './contexts/UIContext';

// Route guards
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

// Layout
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// UI
import ToastContainer from './components/ui/ToastContainer';

// Public pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import PublicItineraryPage from './pages/PublicItineraryPage';
import ExploreCitiesPage from './pages/ExploreCitiesPage';
import ActivitiesPage from './pages/ActivitiesPage';

// Protected pages
import DashboardPage from './pages/DashboardPage';
import CreateTripPage from './pages/CreateTripPage';
import MyTripsPage from './pages/MyTripsPage';
import TripDetailPage from './pages/TripDetailPage';
import ItineraryPage from './pages/ItineraryPage';
import BudgetPage from './pages/BudgetPage';
import PackingChecklistPage from './pages/PackingChecklistPage';
import TripNotesPage from './pages/TripNotesPage';
import ProfilePage from './pages/ProfilePage';

// Admin pages
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';

// ---------------------------------------------------------------------------
// Page transition wrapper
// ---------------------------------------------------------------------------
const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const pageTransition = { duration: 0.2 };

function PageTransition({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Layout wrapper for authenticated pages
// ---------------------------------------------------------------------------
function AuthenticatedLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Animated routes — must live inside BrowserRouter so useLocation works
// ---------------------------------------------------------------------------
function AnimatedRoutes() {
  const location = useLocation();
  const isPublicRoute = ['/', '/login', '/signup', '/forgot-password', '/reset-password', '/explore-cities', '/activities'].some(
    path => location.pathname.startsWith(path) || location.pathname.startsWith('/public-itinerary')
  );

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public */}
        <Route
          path="/"
          element={
            <PageTransition>
              <LandingPage />
            </PageTransition>
          }
        />
        <Route
          path="/login"
          element={
            <PageTransition>
              <LoginPage />
            </PageTransition>
          }
        />
        <Route
          path="/signup"
          element={
            <PageTransition>
              <SignupPage />
            </PageTransition>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PageTransition>
              <ForgotPasswordPage />
            </PageTransition>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <PageTransition>
              <ResetPasswordPage />
            </PageTransition>
          }
        />
        <Route
          path="/public-itinerary/:shareToken"
          element={
            <PageTransition>
              <PublicItineraryPage />
            </PageTransition>
          }
        />
        <Route
          path="/explore-cities"
          element={
            <PageTransition>
              <ExploreCitiesPage />
            </PageTransition>
          }
        />
        <Route
          path="/activities"
          element={
            <PageTransition>
              <ActivitiesPage />
            </PageTransition>
          }
        />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard"
            element={
              <AuthenticatedLayout>
                <PageTransition>
                  <DashboardPage />
                </PageTransition>
              </AuthenticatedLayout>
            }
          />
          <Route
            path="/create-trip"
            element={
              <AuthenticatedLayout>
                <PageTransition>
                  <CreateTripPage />
                </PageTransition>
              </AuthenticatedLayout>
            }
          />
          <Route
            path="/my-trips"
            element={
              <AuthenticatedLayout>
                <PageTransition>
                  <MyTripsPage />
                </PageTransition>
              </AuthenticatedLayout>
            }
          />
          <Route
            path="/trip/:id"
            element={
              <AuthenticatedLayout>
                <PageTransition>
                  <TripDetailPage />
                </PageTransition>
              </AuthenticatedLayout>
            }
          />
          <Route
            path="/itinerary"
            element={
              <AuthenticatedLayout>
                <PageTransition>
                  <ItineraryPage />
                </PageTransition>
              </AuthenticatedLayout>
            }
          />
          <Route
            path="/budget"
            element={
              <AuthenticatedLayout>
                <PageTransition>
                  <BudgetPage />
                </PageTransition>
              </AuthenticatedLayout>
            }
          />
          <Route
            path="/packing-checklist"
            element={
              <AuthenticatedLayout>
                <PageTransition>
                  <PackingChecklistPage />
                </PageTransition>
              </AuthenticatedLayout>
            }
          />
          <Route
            path="/trip-notes"
            element={
              <AuthenticatedLayout>
                <PageTransition>
                  <TripNotesPage />
                </PageTransition>
              </AuthenticatedLayout>
            }
          />
          <Route
            path="/profile"
            element={
              <AuthenticatedLayout>
                <PageTransition>
                  <ProfilePage />
                </PageTransition>
              </AuthenticatedLayout>
            }
          />
        </Route>

        {/* Admin */}
        <Route element={<AdminRoute />}>
          <Route
            path="/admin/users"
            element={
              <AuthenticatedLayout>
                <PageTransition>
                  <AdminUsersPage />
                </PageTransition>
              </AuthenticatedLayout>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <AuthenticatedLayout>
                <PageTransition>
                  <AdminAnalyticsPage />
                </PageTransition>
              </AuthenticatedLayout>
            }
          />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// Root app — provider nesting order:
//   BrowserRouter → UIProvider → AuthProvider (needs useNavigate) → TripProvider
// ---------------------------------------------------------------------------
function App() {
  return (
    <BrowserRouter>
      <UIProvider>
        <AuthProvider>
          <TripProvider>
            <AnimatedRoutes />
            <ToastContainer />
          </TripProvider>
        </AuthProvider>
      </UIProvider>
    </BrowserRouter>
  );
}

export default App;
