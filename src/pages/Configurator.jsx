import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import axios from 'axios';

export default function Configurator() {
  const { currentBuild, removeFromBuild, clearBuild } = useStore();
  const totalPrice = currentBuild.reduce((sum, item) => sum + parseFloat(item.price), 0);
  const navigate = useNavigate();

  // Визначаємо стан кошика
  const isCartEmpty = currentBuild.length === 0;
  const needsShipping = currentBuild.some(item => item.type !== 'rental');

  const [formData, setFormData] = useState({ fullName: '', phone: '', city: '', postBranch: '', comment: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'fullName') setFormData({ ...formData, [name]: value.replace(/[0-9!@#$%^&*()_+=[\]{};:"\\|,.<>/?]/g, '') });
    else if (name === 'phone') setFormData({ ...formData, [name]: value.replace(/\D/g, '').slice(0, 12) });
    else setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.phone.length < 10) return alert('❌ Номер телефону занадто короткий');
    if (formData.fullName.trim().split(' ').length < 2) return alert('❌ Вкажіть Прізвище та Ім’я повністю');

    setIsSubmitting(true);
    try {
      const finalCity = needsShipping ? formData.city : 'Оренда (Без доставки)';
      const finalBranch = needsShipping ? formData.postBranch : '-';

      await axios.post('http://localhost:3001/api/orders', { 
        ...formData, 
        city: finalCity, 
        postBranch: finalBranch,
        currentBuild, 
        totalPrice 
      });
      
      const isPureRental = !needsShipping;

      clearBuild();
      setFormData({ fullName: '', phone: '', city: '', postBranch: '', comment: '' });
      navigate('/thank-you', { state: { isRental: isPureRental } }); 
    } catch (error) { 
      alert('❌ Помилка сервера.'); 
    } finally { // <--- ВИПРАВЛЕНО: тепер слово написане правильно!
      setIsSubmitting(false); 
    }
  };

  // Розумне визначення вмісту для Hero-блоку
  const getHeroContent = () => {
    if (isCartEmpty) {
      return {
        icon: '🛒',
        title: 'Ваш кошик',
        desc: 'Переглядайте додані товари та керуйте своєю збіркою'
      };
    }
    if (!needsShipping) {
      return {
        icon: '🚲',
        title: 'Оформлення оренди',
        desc: 'Вкажіть контакти для бронювання транспорту'
      };
    }
    return {
      icon: '📦',
      title: 'Оформлення доставки',
      desc: 'Перевірте товари та вкажіть дані для відправки'
    };
  };

  const hero = getHeroContent();

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      
      {/* Динамічний Hero-блок */}
      <div style={{ 
        display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px',
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        padding: 'clamp(20px, 4vw, 35px)', borderRadius: '24px', color: 'white',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)'
      }}>
        <div style={{ fontSize: 'clamp(2.5rem, vw, 3.5rem)' }}>{hero.icon}</div>
        <div>
          <h1 style={{ margin: '0 0 5px 0', fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: '900' }}>
            {hero.title}
          </h1>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: 'clamp(0.95rem, 3vw, 1.1rem)' }}>
            {hero.desc}
          </p>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 350px' }}>
          {isCartEmpty ? (
            <div style={{ padding: '40px', background: '#fff', borderRadius: '24px', textAlign: 'center', color: '#64748b', fontSize: '1.1rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
              Кошик порожній. Перейдіть до каталогу.
            </div>
          ) : (
            <div style={{ background: '#fff', padding: '25px', borderRadius: '24px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {currentBuild.map((item) => (
                  <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #f1f5f9', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ flex: '1 1 200px' }}>
                      <span style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold', display: 'block' }}>{item.category}</span>
                      <span style={{ fontWeight: '600', color: '#1e293b' }}>{item.name}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <span style={{ fontWeight: '900', color: '#0f172a' }}>{item.price} ₴</span>
                      <button onClick={() => removeFromBuild(item.id)} style={{ color: '#ef4444', background: '#fee2e2', padding: '6px 12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>✕</button>
                    </div>
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: '25px', paddingTop: '20px', borderTop: '2px dashed #e2e8f0', textAlign: 'right' }}>
                <span style={{ color: '#64748b', fontSize: '1.1rem', marginRight: '10px' }}>Разом до сплати:</span>
                <span style={{ fontSize: '1.8rem', fontWeight: '900', color: '#10b981' }}>{totalPrice} ₴</span>
              </div>
            </div>
          )}
        </div>

        {!isCartEmpty && (
          <div style={{ flex: '1 1 350px', background: '#f8fafc', padding: '30px', borderRadius: '24px', border: '1px solid #e2e8f0', height: 'fit-content' }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#0f172a', fontSize: '1.4rem' }}>
              {needsShipping ? '📦 Оформлення доставки' : '📞 Контактні дані'}
            </h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input required type="text" name="fullName" placeholder="Прізвище та Ім'я" value={formData.fullName} onChange={handleInputChange} style={{ padding: '14px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '1rem', width: '100%', boxSizing: 'border-box' }} />
              <input required type="tel" name="phone" placeholder="Телефон (напр. 0671234567)" value={formData.phone} onChange={handleInputChange} style={{ padding: '14px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '1rem', width: '100%', boxSizing: 'border-box' }} />

              {needsShipping && (
                <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', fontWeight: 'bold', color: '#64748b' }}>📍 Нова Пошта</p>
                  <input required={needsShipping} type="text" name="city" placeholder="Місто (напр. Львів)" value={formData.city} onChange={handleInputChange} style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                  <input required={needsShipping} type="text" name="postBranch" placeholder="Відділення (напр. №1)" value={formData.postBranch} onChange={handleInputChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                </div>
              )}

              <textarea name="comment" placeholder={needsShipping ? "Коментар до замовлення..." : "На який час та день потрібен транспорт?"} value={formData.comment} onChange={handleInputChange} style={{ padding: '14px', borderRadius: '12px', border: '1px solid #cbd5e1', minHeight: '80px', fontFamily: 'inherit', resize: 'vertical', width: '100%', boxSizing: 'border-box' }} />

              <button type="submit" disabled={isSubmitting} style={{
                marginTop: '10px', padding: '16px', background: isSubmitting ? '#94a3b8' : '#0f172a', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem'
              }}>
                {isSubmitting ? 'Відправка...' : (needsShipping ? 'Підтвердити замовлення' : 'Забронювати')}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}