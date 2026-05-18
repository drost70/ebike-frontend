import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      
      {/* Hero-блок панелі */}
      <div style={{ 
        display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px',
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        padding: 'clamp(20px, 4vw, 35px)', borderRadius: '24px', color: 'white',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)'
      }}>
        <div style={{ fontSize: '2.5rem' }}>⚙️</div>
        <div>
          <h1 style={{ margin: '0 0 5px 0', fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: '900' }}>Панель адміністратора</h1>
          <p style={{ margin: 0, color: '#94a3b8' }}>Оберіть розділ для керування контентом та замовленнями вашого магазину</p>
        </div>
      </div>

      {/* Меню вибору */}
      <div style={{ display: 'flex', gap: '25px', flexWrap: 'wrap', marginTop: '20px' }}>
        
        <Link to="/admin/products" style={{ flex: '1 1 280px', textDecoration: 'none', background: 'white', padding: '35px 25px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'transform 0.2s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ fontSize: '3.5rem', marginBottom: '15px' }}>🚲</div>
          <h3 style={{ margin: '0 0 10px 0', color: '#0f172a', fontSize: '1.4rem', fontWeight: '800' }}>Товари та деталі</h3>
          <p style={{ margin: 0, color: '#64748b', textAlign: 'center', fontSize: '0.95rem', lineHeight: '1.5' }}>Додавання нових моделей електровелосипедів, моторів, акумуляторів та плат у каталог</p>
        </Link>

        <Link to="/admin/orders" style={{ flex: '1 1 280px', textDecoration: 'none', background: 'white', padding: '35px 25px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'transform 0.2s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ fontSize: '3.5rem', marginBottom: '15px' }}>📦</div>
          <h3 style={{ margin: '0 0 10px 0', color: '#0f172a', fontSize: '1.4rem', fontWeight: '800' }}>Замовлення</h3>
          <p style={{ margin: 0, color: '#64748b', textAlign: 'center', fontSize: '0.95rem', lineHeight: '1.5' }}>Перегляд нових купівель, заявок на оренду кастомних збірок та зміна поточних статусів</p>
        </Link>

      </div>
    </div>
  );
}