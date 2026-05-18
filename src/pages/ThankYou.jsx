import { Link, useLocation } from 'react-router-dom';

export default function ThankYou() {
  const location = useLocation();
  
  // Витягуємо прапорець оренди з переданого стану (за дефолтом false)
  const isRental = location.state?.isRental || false;

  return (
    <div style={{ 
      fontFamily: "'Inter', sans-serif", 
      maxWidth: '600px', 
      margin: '80px auto', 
      padding: '40px 20px', 
      textAlign: 'center',
      background: '#fff',
      borderRadius: '24px',
      boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)',
      border: '1px solid #e2e8f0'
    }}>
      {/* Динамічний смайлик: велосипед для прокату, конфеті для покупки */}
      <div style={{ fontSize: '5rem', marginBottom: '20px' }}>{isRental ? '🚲' : '🎉'}</div>
      
      <h1 style={{ color: '#0f172a', fontWeight: '900', fontSize: '2.2rem', margin: '0 0 15px 0' }}>
        {isRental ? 'Транспорт заброньовано!' : 'Замовлення прийнято!'}
      </h1>

      {/* ДИНАМІЧНИЙ ТЕКСТ ЗАЛЕЖНО ВІД ТИПУ ЗАМОВЛЕННЯ */}
      {isRental ? (
        <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '35px' }}>
          Дякуємо! Сповіщення про ваше бронювання вже надіслано менеджеру в <b>Telegram</b>. 
          Ми зарезервуємо вибраний транспорт та зателефонуємо вам, щоб підтвердити час та деталі отримання в нашому сервісному центрі у Львові.
        </p>
      ) : (
        <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '35px' }}>
          Дякуємо за довіру! Наш робот уже надіслав сповіщення менеджеру в <b>Telegram</b>. 
          Ми перевіримо комплектацію на сумісність і зателефонуємо вам найближчим часом, щоб підтвердити відправку Новою Поштою.
        </p>
      )}
      
      <Link to="/" style={{ 
        padding: '14px 28px', 
        background: '#0f172a', 
        color: 'white', 
        textDecoration: 'none', 
        fontWeight: 'bold', 
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
        transition: 'background 0.2s'
      }}>
        Повернутися на головну
      </Link>
    </div>
  );
}