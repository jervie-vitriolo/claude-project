import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import LoginPage from './pages/LoginPage';
import POSDashboard from './pages/POSDashboard';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import MenuManagementPage from './pages/MenuManagementPage';
import CategoryManagementPage from './pages/CategoryManagementPage';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

const queryClient = new QueryClient();

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout><POSDashboard /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute>
              <Layout><OrdersPage /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/orders/:id" element={
            <ProtectedRoute>
              <Layout><OrderDetailPage /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/menu" element={
            <ProtectedRoute adminOnly>
              <Layout><MenuManagementPage /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/categories" element={
            <ProtectedRoute adminOnly>
              <Layout><CategoryManagementPage /></Layout>
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
