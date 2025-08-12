import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MockAuthProvider } from './contexts/AuthContextMock';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import EventRegistration from './pages/EventRegistration';
import Profile from './pages/Profile';
import Membership from './pages/Membership';
import Payments from './pages/Payments';
import Achievements from './pages/Achievements';
import About from './pages/About';
import Teams from './pages/Teams';
import AdminPanel from './pages/admin/AdminPanel';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboardDemo from './pages/AdminDashboardDemo';
import AuthDebug from './pages/AuthDebug';
import PrivateRoute from './components/PrivateRoute';
import ErrorBoundary from './components/ErrorBoundary';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './App.css';
import ScalingViewport from './components/ScalingViewport';

function App() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 100
    });
  }, []);

  const enableScaling = process.env.REACT_APP_SCALE_TO_BASE === 'true';

  const appBody = (
    <div className="App min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth-debug" element={<AuthDebug />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/events/:eventId/register" element={<EventRegistration />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/about" element={<About />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/admin-demo" element={<AdminDashboardDemo />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/*"
            element={
              <PrivateRoute>
                <AdminPanel />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/membership"
            element={
              <PrivateRoute>
                <Membership />
              </PrivateRoute>
            }
          />
          <Route
            path="/payments"
            element={
              <PrivateRoute>
                <Payments />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );

  return (
    <MockAuthProvider>
      <Router>
        <ErrorBoundary>
          {enableScaling ? (
            <ScalingViewport baseWidth={412} baseHeight={915}>
              {appBody}
            </ScalingViewport>
          ) : (
            appBody
          )}
        </ErrorBoundary>
      </Router>
    </MockAuthProvider>
  );
}

export default App;
