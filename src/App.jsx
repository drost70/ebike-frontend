import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Rental from './pages/Rental';
import Catalog from './pages/Catalog';
import Configurator from './pages/Configurator';
import Login from './pages/Login';
import ThankYou from './pages/ThankYou'; // Додано імпорт
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import ProtectedRoute from './components/ProtectedRoute'; // Додано імпорт захисту
import useStore from './store/useStore';
import ProductDetails from './pages/ProductDetails';

function App() {
  const currentBuild = useStore((state) => state.currentBuild);
  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);

  return (
    <Router>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; overflow-x: hidden; background-color: #f5f7fa; }
      `}</style>

      <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        
        <header style={{ 
          padding: '15px 20px', 
          background: '#0f172a',
          color: 'white', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '15px',      
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          width: '100%'
        }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.8rem' }}>⚡</span>
            <span style={{ fontSize: '1.5rem', fontWeight: '900', letterSpacing: '-0.5px' }}>E-Bike Builder</span>
          </Link>
          
          <nav style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link to="/catalog" style={{ color: '#e2e8f0', textDecoration: 'none', fontWeight: '600', fontSize: '1.05rem', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = '#34d399'} onMouseOut={(e) => e.target.style.color = '#e2e8f0'}>Каталог</Link>
            <Link to="/rent" style={{ color: '#e2e8f0', textDecoration: 'none', fontWeight: '600', fontSize: '1.05rem', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = '#34d399'} onMouseOut={(e) => e.target.style.color = '#e2e8f0'}>Оренда</Link>
            <Link to="/configurator" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e2e8f0', textDecoration: 'none', fontWeight: '600', fontSize: '1.05rem' }} onMouseOver={(e) => e.target.style.color = '#34d399'} onMouseOut={(e) => e.target.style.color = '#e2e8f0'}>
              Кошик 
              {currentBuild.length > 0 && (
                <span style={{ background: '#ef4444', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  {currentBuild.length}
                </span>
              )}
            </Link>
            
            {user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {user.role === 'admin' && (
                  <Link to="/admin" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: 'white', padding: '8px 16px', borderRadius: '10px', textDecoration: 'none', fontWeight: '800', boxShadow: '0 4px 10px rgba(245, 158, 11, 0.3)' }}>
                    Адмінка
                  </Link>
                )}
                <button 
                  onClick={() => logout()} 
                  style={{ background: 'none', border: '1px solid #475569', color: '#94a3b8', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s' }}
                  onMouseOver={(e) => { e.target.style.color = 'white'; e.target.style.borderColor = 'white'; }}
                  onMouseOut={(e) => { e.target.style.color = '#94a3b8'; e.target.style.borderColor = '#475569'; }}
                >
                  Вийти
                </button>
              </div>
            )}
          </nav>
        </header>

        <main style={{ padding: 'clamp(20px, 5vw, 40px) clamp(15px, 4vw, 30px)', maxWidth: '1200px', margin: '0 auto', width: '100%', flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/rent" element={<Rental />} />
            <Route path="/configurator" element={<Configurator />} />
            <Route path="/login" element={<Login />} />
            <Route path="/thank-you" element={<ThankYou />} /> {/* Публічний роут */}
            <Route path="/product/:id" element={<ProductDetails />} />

            {/* 🔒 ЗАХИЩЕНІ РОУТИ АДМІНІСТРАТОРА (Неавторизованих перекине на /login) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;