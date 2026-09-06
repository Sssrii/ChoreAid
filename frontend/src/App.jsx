import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateRequest from './pages/CreateRequest';
import MyRequests from './pages/MyRequests';
import ProtectedRoute from './components/ProtectedRoute';
import ProviderDashboard from './pages/ProviderDashboard';
import ProviderJobs from './pages/ProviderJobs';
import RequestTracking from './pages/RequestTracking';
import AdminDashboard from './pages/AdminDashboard';
import Home from './pages/Home';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-request"
        element={
          <ProtectedRoute>
            <CreateRequest />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-requests"
        element={
          <ProtectedRoute>
            <MyRequests />
          </ProtectedRoute>
        }
      />
      <Route
  path="/provider-jobs"
  element={
    <ProtectedRoute>
      <ProviderJobs />
    </ProtectedRoute>
  }
/>
      <Route
  path="/provider-dashboard"
  element={
    <ProtectedRoute>
      <ProviderDashboard />
    </ProtectedRoute>
  }
/>
<Route
  path="/request/:id"
  element={
    <ProtectedRoute>
      <RequestTracking />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin"
  element={
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
    </Routes>
  );
}

export default App;