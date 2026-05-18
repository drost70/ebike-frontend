import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useConfiguratorLogic } from '../hooks/useConfiguratorLogic';
import ProductCardFactory from '../components/ProductCardFactory';
import CartModal from '../components/CartModal'; // <--- ДОДАЛИ МОДАЛКУ
import useStore from '../store/useStore'; // <--- ДОДАЛИ СТОР

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { addToBuild } = useStore(); // <--- Витягуємо функцію додавання
  const [addedProduct, setAddedProduct] = useState(null); // <--- Стан для модалки
  
  const [isConfiguring, setIsConfiguring] = useState(location.state?.openConfigurator || false);
  const [activeCatalogTab, setActiveCatalogTab] = useState('bikes');

  const {
    activeTab, setActiveTab, categories, readyBikes,
    filteredComponents, requiredVoltage, currentBuild, handleNextStep
  } = useConfiguratorLogic(products);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('https://ebike-api-server.onrender.com/api/products');
        setProducts(res.data); 
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchProducts();
  }, []);

  // Функція покупки спеціально для Каталогу (без кроків конфігуратора)
  const handleCatalogBuy = (product) => {
    addToBuild(product);
    setAddedProduct(product); // Відкриваємо модалку
  };

  const filteredCatalogProducts = products.filter(p => {
    if (p.type === 'rental') return false; 
    if (activeCatalogTab === 'bikes') return p.type === 'ready_bike';
    return p.category === activeCatalogTab;
  });

  const catalogTabs = [
    { id: 'bikes', label: 'Електровелосипеди' },
    { id: 'motor', label: 'Мотори' },
    { id: 'battery', label: 'Акумулятори' },
    { id: 'controller', label: 'Контролери' },
    { id: 'display', label: 'Дисплеї' }
  ];

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '100px 0', color: '#64748b', fontSize: '1.2rem', fontWeight: 'bold' }}>
      ⏳ Завантаження каталогу...
    </div>
  );

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      
      {/* Підключаємо модалку для каталогу */}
      <CartModal product={addedProduct} onClose={() => setAddedProduct(null)} />

      {!isConfiguring ? (
        <section>
          <div style={{ 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px',
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            padding: 'clamp(25px, 5vw, 50px) clamp(20px, 5vw, 40px)', borderRadius: '24px', color: 'white',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)', position: 'relative', overflow: 'hidden', flexWrap: 'wrap', gap: '20px', width: '100%'
          }}>
            <div style={{ position: 'absolute', right: '-5%', top: '-20%', width: '300px', height: '300px', background: '#3b82f6', filter: 'blur(100px)', opacity: '0.25', borderRadius: '50%' }}></div>
            
            <div style={{ maxWidth: '650px', position: 'relative', zIndex: 1, width: '100%' }}>
              <span style={{ display: 'inline-block', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '6px 14px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '800', marginBottom: '15px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                🚀 Наша унікальна фішка
              </span>
              <h2 style={{ margin: '0 0 15px 0', fontSize: 'clamp(1.8rem, 6vw, 2.8rem)', fontWeight: '900', letterSpacing: '-1px', lineHeight: '1.2' }}>
                Розумний конфігуратор <br/><span style={{ color: '#3b82f6' }}>кастомних збірок</span>
              </h2>
              <p style={{ color: '#94a3b8', margin: 0, fontSize: 'clamp(1rem, 3vw, 1.15rem)', lineHeight: '1.5' }}>
                Єдина в Україні система автоматичної перевірки сумісності деталей.
              </p>
            </div>
            
            <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
              <button 
                onClick={() => setIsConfiguring(true)} 
                style={{ 
                  padding: '16px 30px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
                  color: 'white', border: 'none', borderRadius: '16px', cursor: 'pointer', 
                  fontWeight: '900', fontSize: '1.1rem', transition: 'all 0.3s ease', 
                  boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.5)', width: '100%', maxWidth: '300px' 
                }}
              >
                ⚡ Створити свій байк
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '25px' }}>
            {catalogTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCatalogTab(tab.id)}
                style={{
                  padding: '10px 20px', borderRadius: '12px',
                  border: activeCatalogTab === tab.id ? '1px solid #0f172a' : '1px solid #cbd5e1',
                  background: activeCatalogTab === tab.id ? '#0f172a' : 'white',
                  color: activeCatalogTab === tab.id ? 'white' : '#64748b',
                  fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeCatalogTab !== 'bikes' && (
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '15px 25px', borderRadius: '12px', marginBottom: '30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
              <div>
                <h4 style={{ margin: 0, color: '#1e40af', fontSize: '1.1rem' }}>💡 Збираєте байк з нуля?</h4>
                <p style={{ margin: '5px 0 0 0', color: '#3b82f6', fontSize: '0.95rem' }}>
                  Щоб уникнути помилок сумісності деталей, рекомендуємо скористатися нашим помічником.
                </p>
              </div>
              <button 
                onClick={() => setIsConfiguring(true)} 
                style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Перейти в конфігуратор
              </button>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
            {filteredCatalogProducts.map(product => (
              <ProductCardFactory 
                key={product.id} 
                product={product} 
                isCatalogMode={true} 
                actionHandler={handleCatalogBuy} // <--- Тепер викликаємо правильну функцію
                onDetailsClick={() => navigate(`/product/${product.id}`)}
              />
            ))}
          </div>
        </section>
      ) : (
        <section>
          <button 
            onClick={() => { navigate('.', { replace: true, state: {} }); setIsConfiguring(false); }} 
            style={{ marginBottom: '20px', background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}
          >
            ← Повернутися до каталогу
          </button>

          <div style={{ background: '#fff', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
              <div>
                <h2 style={{ color: '#0f172a', margin: '0 0 8px 0', fontSize: '2rem', fontWeight: '800' }}>🛠️ Помічник збірки</h2>
                <p style={{ color: '#64748b', margin: 0 }}>Крок за кроком обирай сумісні деталі.</p>
              </div>
              {requiredVoltage && (
                <span style={{ background: '#eff6ff', color: '#2563eb', padding: '10px 20px', borderRadius: '12px', fontWeight: '800', border: '1px solid #bfdbfe' }}>
                  ⚡ Система: {requiredVoltage}V
                </span>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '15px', marginBottom: '40px', flexWrap: 'wrap' }}>
              {categories.map((cat, index) => {
                const isCompleted = currentBuild.find(i => i.category === cat.id);
                const isActive = activeTab === cat.id;
                let bg = '#f8fafc'; let border = '1px solid #e2e8f0'; let color = '#94a3b8';
                if (isCompleted) { bg = '#ecfdf5'; border = '1px solid #34d399'; color = '#059669'; } 
                else if (isActive) { bg = '#eff6ff'; border = '2px solid #3b82f6'; color = '#1d4ed8'; }
                return (
                  <div key={cat.id} style={{ flex: 1, padding: '15px', textAlign: 'center', borderRadius: '12px', background: bg, border: border, color: color, fontWeight: 'bold', minWidth: '120px' }}>
                    {isCompleted ? '✅' : <span>{index + 1}.</span>} {cat.label}
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
              {filteredComponents.map(p => (
                <ProductCardFactory 
                  key={p.id} 
                  product={p} 
                  isCatalogMode={false} 
                  actionHandler={(p) => handleNextStep(p, navigate)} // <--- А тут конфігуратор працює по-своєму
                  requiredVoltage={requiredVoltage}
                  onDetailsClick={() => navigate(`/product/${p.id}`)}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}