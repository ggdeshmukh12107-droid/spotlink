import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SearchParking from './pages/SearchParking';
import BookParking from './pages/BookParking';
import MyBookings from './pages/MyBookings';
import GuestParking from './pages/GuestParking';
import Dashboard from './pages/Dashboard';
import MySpaces from './pages/MySpaces';
import Profile from './pages/Profile';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"/></div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

function AppContent() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<SearchParking />} />
          <Route path="/book/:id" element={<ProtectedRoute><BookParking /></ProtectedRoute>} />
          <Route path="/bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
          <Route path="/guest-parking" element={<ProtectedRoute><GuestParking /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute roles={['owner','admin']}><Dashboard /></ProtectedRoute>} />
          <Route path="/my-spaces" element={<ProtectedRoute roles={['owner','admin']}><MySpaces /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background:'rgba(30,41,59,0.95)', color:'#e2e8f0', border:'1px solid rgba(255,255,255,0.1)', backdropFilter:'blur(20px)', borderRadius:'16px', fontSize:'14px' },
          success: { iconTheme: { primary:'#4ade80', secondary:'#0f172a' } },
          error: { iconTheme: { primary:'#f87171', secondary:'#0f172a' } },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
