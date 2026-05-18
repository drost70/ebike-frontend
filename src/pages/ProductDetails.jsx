import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useStore from '../store/useStore';
import CartModal from '../components/CartModal';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addedProduct, setAddedProduct] = useState(null);
  
  // Додаємо стан для кількості днів оренди (за замовчуванням 1)
  const [rentDays, setRentDays] = useState(1);
  
  const { addToBuild } = useStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`https://ebike-api-server.onrender.com/api/products/${id}`);
        setProduct(res.data);
      } catch (error) { console.error(error); } 
      finally { setLoading(false); }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', fontFamily: "'Inter', sans-serif" }}>Завантаження...</div>;
  if (!product) return <div style={{ padding: '40px', textAlign: 'center', fontFamily: "'Inter', sans-serif" }}>Товар не знайдено</div>;

  const getButtonText = () => {
    if (product.type === 'ready_bike') return 'Купити велосипед';
    if (product.type === 'rental') return 'Забронювати';
    return 'Купити деталь';
  };

  // Рахуємо фінальну ціну (якщо оренда - множимо на дні)
  const finalPrice = product.type === 'rental' ? product.price * rentDays : product.price;

  const handleAddToCart = () => {
    let productToAdd = product;
    
    // Якщо це оренда, модифікуємо товар перед тим, як кинути в кошик
    if (product.type === 'rental') {
      productToAdd = {
        ...product,
        name: `${product.name} (Оренда: ${rentDays} дн.)`, // Щоб в кошику і в БД було видно дні
        price: finalPrice // Оновлена ціна за кілька днів
      };
    }

    addToBuild(productToAdd); 
    setAddedProduct(productToAdd); 
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", maxWidth: '1000px', margin: '20px auto', padding: '20px', background: '#fff', borderRadius: '24px', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)', display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
      
      <CartModal product={addedProduct} onClose={() => setAddedProduct(null)} />

      <div style={{ width: '100%', marginBottom: '5px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>
          ← Повернутися назад
        </button>
      </div>

      <div style={{ flex: '1 1 300px', minHeight: '300px', background: '#f8fafc', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <img src={product.image_url} alt={product.name} style={{ maxWidth: '100%', maxHeight: '350px', objectFit: 'contain' }} />
      </div>

      <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column' }}>
        <span style={{ textTransform: 'uppercase', color: '#64748b', fontWeight: 'bold', fontSize: '0.85rem', letterSpacing: '1px' }}>Категорія: {product.category}</span>
        <h1 style={{ fontSize: '2rem', color: '#0f172a', margin: '10px 0 20px 0', lineHeight: '1.2' }}>{product.name}</h1>
        
        <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: '1.6', marginBottom: '30px' }}>{product.description}</p>

        {product.type === 'component' && (
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '15px', borderRadius: '12px', marginBottom: '20px' }}>
            <span style={{ fontWeight: 'bold', color: '#b45309' }}>💡 Порада: </span>
            <span style={{ color: '#d97706', fontSize: '0.95rem' }}>
              Щоб перевірити сумісність, скористайтеся <span onClick={() => navigate('/catalog', { state: { openConfigurator: true } })} style={{ textDecoration: 'none', cursor: 'pointer', fontWeight: 'bold', color: '#b45309' }}>Веб-помічником</span>.
            </span>
          </div>
        )}

        {/* НОВИЙ БЛОК: Вибір кількості днів (тільки для Оренди) */}
        {product.type === 'rental' && (
          <div style={{ marginBottom: '20px', padding: '15px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 'bold', color: '#1e293b' }}>⏱ Кількість днів:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <button 
                onClick={() => setRentDays(Math.max(1, rentDays - 1))} 
                style={{ background: '#e2e8f0', border: 'none', width: '36px', height: '36px', borderRadius: '8px', fontSize: '1.2rem', cursor: 'pointer', fontWeight: 'bold', color: '#475569' }}
              >
                -
              </button>
              <span style={{ fontSize: '1.2rem', fontWeight: '900', color: '#0f172a', width: '30px', textAlign: 'center' }}>
                {rentDays}
              </span>
              <button 
                onClick={() => setRentDays(rentDays + 1)} 
                style={{ background: '#e2e8f0', border: 'none', width: '36px', height: '36px', borderRadius: '8px', fontSize: '1.2rem', cursor: 'pointer', fontWeight: 'bold', color: '#475569' }}
              >
                +
              </button>
            </div>
          </div>
        )}

        <div style={{ marginTop: 'auto', padding: '20px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          {/* Виводимо фінальну ціну, яка множиться на дні */}
          <div style={{ fontSize: '2rem', fontWeight: '900', color: '#0f172a', marginBottom: '15px' }}>
            {finalPrice} ₴
          </div>
          <button 
            onClick={handleAddToCart}
            style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' }}
          >
            {getButtonText()}
          </button>
        </div>
      </div>
    </div>
  );
}