import { useState, useEffect } from 'react';
import axios from 'axios';
import useStore from '../store/useStore';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const token = useStore((state) => state.token);
  
  // Стан для відстеження, який товар зараз редагується (null - якщо створюємо новий)
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({ 
    name: '', 
    description: '', 
    price: '', 
    type: 'component', 
    category: 'motor', 
    stock_quantity: '10' 
  });
  
  const [imageFile, setImageFile] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('https://ebike-api-server.onrender.com/api/products');
      setProducts(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // ФУНКЦІЯ: Включення режиму редагування
  const startEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      type: product.type || 'component',
      category: product.category || 'motor',
      stock_quantity: product.stock_quantity || '10'
    });
    setImageFile(null); // скидаємо попередньо обраний файл для нового товару
  };

  // ФУНКЦІЯ: Скасування редагування
  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', description: '', price: '', type: 'component', category: 'motor', stock_quantity: '10' });
    setImageFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('type', formData.type);
    data.append('category', formData.category);
    data.append('stock_quantity', formData.stock_quantity);
    
    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      if (editingId) {
        // РЕЖИМ РЕДАГУВАННЯ: відправляємо PUT-запит на ID товару
        await axios.put(`https://ebike-api-server.onrender.com/api/products/${editingId}`, data, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        alert('✏️ Товар успішно оновлено!');
      } else {
        // РЕЖИМ СТВОРЕННЯ: відправляємо POST-запит
        await axios.post('https://ebike-api-server.onrender.com/api/products', data, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        alert('✅ Товар успішно додано!');
      }

      fetchProducts();
      cancelEdit(); // Скидаємо форму і виходимо з режиму редагування
      e.target.reset(); 
    } catch (err) { 
      alert('❌ Помилка при збереженні товару. Перевірте лог сервера.'); 
    }
  };

  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(`❌ Ви впевнені, що хочете видалити товар: "${name}"?`);
    if (!confirmDelete) return;

    try {
      await axios.delete(`https://ebike-api-server.onrender.com/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('🗑️ Товар успішно видалено!');
      if (editingId === id) cancelEdit(); // Якщо видалили той, що редагувався — очищаємо форму
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert('❌ Не вдалося видалити товар.');
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      
      <div style={{ 
        display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px',
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        padding: 'clamp(20px, 4vw, 35px)', borderRadius: '24px', color: 'white',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)'
      }}>
        <div style={{ fontSize: '2.5rem' }}>🚲</div>
        <div>
          <h1 style={{ margin: '0 0 5px 0', fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: '900' }}>Асортимент магазину</h1>
          <p style={{ margin: 0, color: '#94a3b8' }}>Додавання, редагування та видалення товарів вашого каталогу</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        
        {/* ЛІВА КОЛОНКА: ФОРМА (ДИНАМІЧНА: СТВОРЕННЯ / РЕДАГУВАННЯ) */}
        <div style={{ flex: '1 1 350px', background: '#fff', padding: '30px', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: editingId ? '2px solid #3b82f6' : '1px solid #e2e8f0', height: 'fit-content' }}>
          <h3 style={{ margin: '0 0 20px 0', color: editingId ? '#3b82f6' : '#0f172a', fontSize: '1.3rem', fontWeight: '800' }}>
            {editingId ? '✏️ Редагувати товар' : '➕ Додати нову позицію'}
          </h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            
            <input required type="text" placeholder="Назва товару (напр. Акумулятор 48V)" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '1rem', width: '100%', boxSizing: 'border-box' }} />
            <textarea required placeholder="Опис характеристик..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '1rem', minHeight: '80px', width: '100%', boxSizing: 'border-box', fontFamily: 'inherit' }} />
            <input required type="number" placeholder="Ціна (₴)" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '1rem', width: '100%', boxSizing: 'border-box' }} />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#64748b' }}>
                {editingId ? 'Змінити зображення (залиште пустим, щоб зберегти старе):' : 'Зображення товару (файл):'}
              </label>
              <input required={!editingId} type="file" accept="image/*" onChange={handleFileChange} style={{ padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', width: '100%', background: '#f8fafc' }} />
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '120px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#64748b' }}>Тип:</label>
                <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: '600' }}>
                  <option value="component">Запчастина</option>
                  <option value="ready_bike">Готовий байк</option>
                  <option value="rental">Оренда</option>
                </select>
              </div>

              <div style={{ flex: 1, minWidth: '120px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#64748b' }}>Категорія:</label>
                <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: '600' }}>
                  <option value="motor">Мотори</option>
                  <option value="battery">Акумулятори</option>
                  <option value="controller">Контролери</option>
                  <option value="display">Дисплеї</option>
                  <option value="ebike">Велосипеди</option>
                  <option value="rent">Прокат</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button 
                type="submit" 
                style={{ 
                  flex: 2, padding: '14px', 
                  background: editingId ? '#3b82f6' : '#0f172a', 
                  color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' 
                }}
              >
                {editingId ? 'Зберегти зміни' : 'Створити картку'}
              </button>
              
              {editingId && (
                <button 
                  type="button" 
                  onClick={cancelEdit}
                  style={{ flex: 1, padding: '14px', background: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}
                >
                  Скасувати
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ПРАВА КОЛОНКА: СПИСОК З КНОПКАМИ РЕДАГУВАННЯ ТА ВИДАЛЕННЯ */}
        <div style={{ flex: '1 1 450px', background: '#fff', padding: '25px', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#0f172a', fontWeight: '800' }}>Поточний список ({products.length})</h3>
          <div style={{ maxHeight: '560px', overflowY: 'auto', paddingRight: '5px' }}>
            {products.map(p => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9', gap: '15px', background: editingId === p.id ? '#f0f7ff' : 'transparent', borderRadius: '8px', paddingLeft: editingId === p.id ? '10px' : '0', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={p.image_url} alt="" style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '6px', background: '#f8fafc' }} />
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 'bold', textTransform: 'uppercase' }}>{p.category}</span>
                    <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.95rem' }}>{p.name}</div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontWeight: '900', color: '#0f172a', fontSize: '1rem', whiteSpace: 'nowrap', marginRight: '5px' }}>{p.price} ₴</span>
                  
                  {/* КНОПКА РЕДАГУВАННЯ */}
                  <button 
                    onClick={() => startEdit(p)}
                    style={{ background: '#eff6ff', color: '#2563eb', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }}
                  >
                    Редагувати
                  </button>

                  <button 
                    onClick={() => handleDelete(p.id, p.name)}
                    style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }}
                  >
                    Видалити
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}