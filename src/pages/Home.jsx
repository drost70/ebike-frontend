import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", maxWidth: '1200px', margin: '0 auto', padding: '10px' }}>
      
      {/* Сучасний Hero-блок (Адаптований) */}
      <div style={{ 
        position: 'relative',
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        borderRadius: '24px',
        padding: 'clamp(40px, 8vw, 80px) clamp(20px, 5vw, 40px)', // Гумові відступи
        textAlign: 'center',
        color: 'white',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        marginBottom: '50px',
        width: '100%'
      }}>
        {/* Декоративні елементи фону */}
        <div style={{ position: 'absolute', top: '-50%', left: '-10%', width: '400px', height: '400px', background: '#3b82f6', filter: 'blur(150px)', opacity: '0.4', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-50%', right: '-10%', width: '400px', height: '400px', background: '#10b981', filter: 'blur(150px)', opacity: '0.3', borderRadius: '50%' }}></div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '850px', margin: '0 auto' }}>
          <h1 style={{ 
            fontSize: 'clamp(2.2rem, 7vw, 4rem)', // Гумовий шрифт: ідеально для телефонів
            fontWeight: '900', 
            margin: '0 0 20px 0', 
            lineHeight: '1.15', 
            letterSpacing: '-1px' 
          }}>
            Електрифікуй свій рух. <br />
            <span style={{ background: 'linear-gradient(to right, #34d399, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Без компромісів.
            </span>
          </h1>
          
          <p style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)', color: '#94a3b8', marginBottom: '40px', lineHeight: '1.6' }}>
            Перший у Львові спеціалізований сервіс із розумним конфігуратором збірки. Обирай готові моделі, орендуй на вихідні або збирай власний кастомний байк без ризику помилитися.
          </p>
          
          {/* КНОПКИ ДІЇ (Тепер їх ТРИ, з акцентом на Помічник) */}
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {/* Головна кнопка переходу в Помічник */}
            <Link 
              to="/catalog" 
              state={{ openConfigurator: true }} // Передаємо сигнал для відкриття помічника
              style={{ padding: '16px 32px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', textDecoration: 'none', fontWeight: '800', borderRadius: '12px', fontSize: '1.1rem', boxShadow: '0 10px 20px rgba(16, 185, 129, 0.3)', transition: 'all 0.2s' }}
            >
              ⚡ Запустити Помічник
            </Link>
            
            <Link to="/catalog" style={{ padding: '16px 32px', background: 'white', color: '#0f172a', textDecoration: 'none', fontWeight: '800', borderRadius: '12px', fontSize: '1.1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
              Готові моделі
            </Link>
            
            <Link to="/rent" style={{ padding: '16px 32px', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', textDecoration: 'none', fontWeight: '600', borderRadius: '12px', fontSize: '1.1rem' }}>
              Оренда
            </Link>
          </div>
        </div>
      </div>

      {/* РОЗДІЛ: ПЕРЕВАГИ (З ефектом підняття при наведенні) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', marginBottom: '60px' }}>
        {[
          { 
            icon: '🧠', 
            title: 'Розумний конфігуратор', 
            text: 'Наша система автоматично блокує несумісні деталі. Збирай байк як Lego, ми подбаємо про вольтаж та електроніку.',
            link: true // Кажемо, що тут потрібна кнопка
          },
          { 
            icon: '🔋', 
            title: 'Преміальні елементи', 
            text: 'Використовуємо лише перевірені оригінальні акумулятори Panasonic та Samsung. Максимальний запас ходу та безпека.',
            link: false
          },
          { 
            icon: '🛠️', 
            title: 'Локальний сервіс', 
            text: 'Повна технічна підтримка, швидка діагностика, збірка під ключ та ремонт у нашому сервісному центрі.',
            link: false
          }
        ].map((feature, idx) => (
          <div 
            key={idx} 
            style={{ 
              background: '#fff', padding: '30px', borderRadius: '20px', 
              boxShadow: '0 10px 20px -5px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0',
              display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease'
            }}
            // Анімація через стандартні події React
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 30px -10px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 20px -5px rgba(0,0,0,0.02)'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>{feature.icon}</div>
            <h3 style={{ fontSize: '1.3rem', color: '#0f172a', marginBottom: '10px', fontWeight: '800' }}>{feature.title}</h3>
            <p style={{ color: '#64748b', lineHeight: '1.6', fontSize: '0.95rem', flexGrow: 1, margin: '0 0 20px 0' }}>{feature.text}</p>
            
            {/* Посилання на помічник всередині картки переваг */}
            {feature.link && (
              <button 
                onClick={() => navigate('/catalog', { state: { openConfigurator: true } })}
                style={{ background: 'none', border: 'none', color: '#3b82f6', fontWeight: 'bold', fontSize: '0.95rem', textAlign: 'left', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                Спробувати конфігуратор →
              </button>
            )}
          </div>
        ))}
      </div>

      {/* ПРЕЗЕНТАБЕЛЬНИЙ БЛОК ДЛЯ ДИПЛОМУ: ЯК ЦЕ ПРАЦЮЄ */}
      <div style={{ background: '#fff', padding: '40px 30px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.02)' }}>
        <h2 style={{ textAlign: 'center', color: '#0f172a', fontSize: '1.8rem', fontWeight: '800', margin: '0 0 35px 0' }}>Три кроки до твого ідеального байка</h2>
        
        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { step: '1', title: 'Обери мотор', desc: 'Визнач необхідну потужність (350W, 500W чи кастомні 1000W+ для швидкості).' },
            { step: '2', title: 'Контроль сумісності', desc: 'Система сама підсвітить лише ті акумулятори та плати, які підходять по вольтажу.' },
            { step: '3', title: 'Забери замовлення', desc: 'Оформи доставку Новою Поштою. Ми надійно запакуємо та відправимо твою кастомну збірку.' }
          ].map((item, index) => (
            <div key={index} style={{ flex: '1 1 280px', display: 'flex', gap: '15px' }}>
              <div style={{ background: '#eff6ff', color: '#2563eb', fontSize: '1.3rem', fontWeight: '900', width: '45px', height: '45px', minWidth: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {item.step}
              </div>
              <div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', color: '#1e293b', fontWeight: '700' }}>{item.title}</h4>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}