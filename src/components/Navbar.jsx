import { Link, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

export default function Navbar() {
  const { token, logout, currentBuild } = useStore();
  const navigate = useNavigate();

  return (
    <nav style={{ 
      background: '#0f172a', 
      color: 'white', 
      padding: '15px 20px', // Фіксовані акуратні відступи
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      flexWrap: 'wrap', // Дозволяє падати вниз на телефоні
      gap: '15px',
      width: '100%',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
      fontFamily: "'Inter', sans-serif"
    }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: '900', letterSpacing: '-0.5px' }}>
        ⚡ E-Bike<span style={{ color: '#3b82f6' }}>Builder</span>
      </Link>
      
      {/* Контейнер для посилань, який сам переноситься на новий рядок */}
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
        <Link to="/catalog" style={{ color: '#cbd5e1', textDecoration: 'none', fontWeight: '600' }}>Каталог</Link>
        <Link to="/rent" style={{ color: '#cbd5e1', textDecoration: 'none', fontWeight: '600' }}>Оренда</Link>
        
        <Link to="/configurator" style={{ background: '#3b82f6', color: 'white', textDecoration: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
          Кошик 
          {currentBuild.length > 0 && (
            <span style={{ background: 'white', color: '#3b82f6', borderRadius: '50%', padding: '2px 8px', fontSize: '0.8rem' }}>
              {currentBuild.length}
            </span>
          )}
        </Link>

        {token ? (
          <>
            <Link to="/admin" style={{ color: '#cbd5e1', textDecoration: 'none', fontWeight: '600' }}>Адмінка</Link>
            <button onClick={() => { logout(); navigate('/login'); }} style={{ background: 'none', border: '1px solid #475569', color: '#cbd5e1', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Вийти</button>
          </>
        ) : (
          <Link to="/login" style={{ color: '#cbd5e1', textDecoration: 'none', fontWeight: '600' }}>Вхід</Link>
        )}
      </div>
    </nav>
  );
}