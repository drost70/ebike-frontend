import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // <--- Додали навігацію
import ProductCardFactory from '../components/ProductCardFactory';
import CartModal from '../components/CartModal';
import useStore from '../store/useStore';

export default function Rental() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedProduct, setAddedProduct] = useState(null);
  
  const { addToBuild } = useStore();
  const navigate = useNavigate(); // <--- Ініціалізуємо навігацію

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/products');
        setRentals(res.data.filter(p => p.type === 'rental'));
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchRentals();
  }, []);

  const handleRentClick = (product) => {
    addToBuild(product);
    setAddedProduct(product); 
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px 0', color: '#64748b', fontWeight: 'bold' }}>⏳ Завантаження оренди...</div>;

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      
      <CartModal product={addedProduct} onClose={() => setAddedProduct(null)} />

      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px',
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        padding: 'clamp(25px, 5vw, 50px) clamp(20px, 5vw, 40px)', 
        borderRadius: '24px', color: 'white',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', right: '-10%', top: '-30%', width: '350px', height: '350px', background: '#f59e0b', filter: 'blur(120px)', opacity: '0.2', borderRadius: '50%' }}></div>
        
        <div style={{ maxWidth: '600px', position: 'relative', zIndex: 1 }}>
          <span style={{ display: 'inline-block', background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', padding: '6px 14px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '800', marginBottom: '15px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            🚲 Сервіс прокату
          </span>
          <h2 style={{ margin: '0 0 15px 0', fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', fontWeight: '900', lineHeight: '1.2' }}>
            Оренда електротранспорту <br/><span style={{ color: '#f59e0b' }}>на будь-який смак</span>
          </h2>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: 'clamp(1rem, 3vw, 1.15rem)', lineHeight: '1.6' }}>
            Обирайте велосипед чи самокат для прогулянок містом або лісом. Швидке бронювання та доступні ціни.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
        {rentals.map(product => (
          <ProductCardFactory 
            key={product.id} 
            product={product} 
            isCatalogMode={true} 
            actionHandler={handleRentClick}
            // Додали функцію переходу на сторінку деталей
            onDetailsClick={() => navigate(`/product/${product.id}`)} 
          />
        ))}
      </div>
      
      {rentals.length === 0 && <h3 style={{ textAlign: 'center', color: '#94a3b8' }}>Транспорту для оренди поки немає.</h3>}
    </div>
  );
}