import { useState, useEffect } from 'react';
import axios from 'axios';
import useStore from '../store/useStore';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = useStore((state) => state.token);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('https://ebike-api-server.onrender.com/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      console.error('Не вдалося завантажити замовлення', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        `https://ebike-api-server.onrender.com/api/orders/${orderId}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('✅ Статус замовлення успішно оновлено!');
      fetchOrders(); 
    } catch (err) {
      console.error(err);
      alert('❌ Не вдалось оновити статус замовлення.');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px', fontWeight: 'bold' }}>⏳ Завантаження замовлень...</div>;

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      
      {/* Уніфікований Hero-блок */}
      <div style={{ 
        display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px',
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        padding: 'clamp(20px, 4vw, 35px)', borderRadius: '24px', color: 'white',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)'
      }}>
        <div style={{ fontSize: '2.5rem' }}>📦</div>
        <div>
          <h1 style={{ margin: '0 0 5px 0', fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: '900' }}>Керування замовленнями</h1>
          <p style={{ margin: 0, color: '#94a3b8' }}>Зміна статусів, перегляд контактів та деталей збірок</p>
        </div>
      </div>

      {/* Сітка карток замовлень */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
        {orders.map((order) => {
          // ВИПРАВЛЕНО: беремо поле current_build (як у БД)
          let items = [];
          try {
            items = typeof order.current_build === 'string' 
              ? JSON.parse(order.current_build) 
              : (order.current_build || []);
          } catch (e) {
            console.error("Помилка парсингу товарів для замовлення №" + order.id, e);
          }

          return (
            <div key={order.id} style={{ background: 'white', padding: '25px', borderRadius: '20px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <span style={{ fontWeight: '900', color: '#3b82f6' }}>№ {order.id}</span>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>

                <h3 style={{ margin: '0 0 5px 0', color: '#0f172a', fontSize: '1.2rem' }}>{order.fullName}</h3>
                <p style={{ margin: '0 0 15px 0', color: '#475569', fontWeight: 'bold' }}>📞 {order.phone}</p>

                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', marginBottom: '15px', fontSize: '0.9rem', border: '1px solid #f1f5f9' }}>
                  <strong style={{ color: '#64748b' }}>Доставка / Тип:</strong> <br />
                  {order.city} <br />
                  {order.postBranch}
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <strong style={{ color: '#64748b', fontSize: '0.9rem' }}>Обрані товари:</strong>
                  <ul style={{ paddingLeft: '20px', margin: '5px 0', fontSize: '0.95rem', color: '#1e293b' }}>
                    {items.length > 0 ? (
                      items.map((item, idx) => (
                        <li key={idx} style={{ marginBottom: '4px' }}>
                          {item.name} <span style={{ color: '#64748b', fontSize: '0.85rem' }}>({item.price} ₴)</span>
                        </li>
                      ))
                    ) : (
                      <li style={{ color: '#94a3b8', listStyleType: 'none', marginLeft: '-20px' }}>Список товарів порожній</li>
                    )}
                  </ul>
                </div>
              </div>

              <div>
                {/* ВИПРАВЛЕНО: беремо поле total_price (як у БД) */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '15px', borderTop: '1px dashed #e2e8f0', marginBottom: '15px' }}>
                  <span style={{ color: '#64748b' }}>Сума замовлення:</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: '900', color: '#10b981' }}>{order.total_price} ₴</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#64748b' }}>Статус замовлення:</label>
                  <select 
                    value={order.status || 'Нове'} 
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.95rem', fontWeight: 'bold', color: '#1e293b', cursor: 'pointer' }}
                  >
                    <option value="Нове">Нове</option>
                    <option value="В обробці">В обробці</option>
                    <option value="Відправлено">Відправлено</option>
                    <option value="Завершено">Завершено</option>
                    <option value="Скасовано">Скасовано</option>
                  </select>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {orders.length === 0 && <h3 style={{ textAlign: 'center', color: '#94a3b8', marginTop: '40px' }}>Замовлень немає.</h3>}
    </div>
  );
}