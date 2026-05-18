import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogOut, ShoppingCart, ClipboardList, Coffee, Settings } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-amber-800 text-white px-6 py-3 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-2 font-bold text-xl">
        <Coffee size={22} />
        <span>CafePOS</span>
      </div>
      <div className="flex items-center gap-6 text-sm font-medium">
        <Link to="/" className="flex items-center gap-1 hover:text-amber-200 transition-colors">
          <ShoppingCart size={16} /> POS
        </Link>
        <Link to="/orders" className="flex items-center gap-1 hover:text-amber-200 transition-colors">
          <ClipboardList size={16} /> Orders
        </Link>
        {isAdmin() && (
          <>
            <Link to="/menu" className="flex items-center gap-1 hover:text-amber-200 transition-colors">
              <Settings size={16} /> Menu
            </Link>
            <Link to="/categories" className="flex items-center gap-1 hover:text-amber-200 transition-colors">
              <Settings size={16} /> Categories
            </Link>
          </>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-amber-200 text-sm">{user?.username} ({user?.role})</span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 bg-amber-700 hover:bg-amber-600 px-3 py-1.5 rounded-md text-sm transition-colors"
        >
          <LogOut size={14} /> Logout
        </button>
      </div>
    </nav>
  );
}
