import React from 'react';

// 1. Дизайн картки для ГОТОВОГО ВЕЛОСИПЕДА АБО ОРЕНДИ
const ReadyBikeCard = ({ product, actionHandler, onDetailsClick }) => (
  <div style={{
    background: '#fff', borderRadius: '16px', overflow: 'hidden',
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    display: 'flex', flexDirection: 'column', height: '100%'
  }}>
    <div style={{ height: '220px', position: 'relative' }}>
      <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <span style={{ position: 'absolute', top: '15px', right: '15px', background: product.type === 'rental' ? '#f59e0b' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
        {product.type === 'rental' ? 'В оренду' : 'Готовий до поїздки'}
      </span>
    </div>
    <div style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ margin: '0 0 10px 0', fontSize: '1.15rem', color: '#1e293b' }}>{product.name}</h3>
      <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5', flexGrow: 1 }}>{product.description}</p>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <span style={{ fontSize: '1.3rem', fontWeight: '900', color: '#0f172a' }}>{product.price} ₴</span>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={onDetailsClick} style={{ background: '#f8fafc', color: '#475569', border: '1px solid #cbd5e1', padding: '10px 14px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Огляд</button>
          <button onClick={() => actionHandler(product)} style={{ background: '#0f172a', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
            {product.type === 'rental' ? 'Забронювати' : 'Купити'}
          </button>
        </div>
      </div>
    </div>
  </div>
);

// 2. Дизайн картки для КОМПЛЕКТУЮЧОЇ ДЕТАЛІ
const ComponentCard = ({ product, actionHandler, requiredVoltage, onDetailsClick, isCatalogMode }) => {
  const voltage = product.name.match(/(\d+)V/i)?.[1] || product.description?.match(/(\d+)V/i)?.[1];
  
  // Якщо ми в звичайному каталозі, деталь завжди доступна для покупки
  let isCompatible = true;
  let reason = '';

  if (!isCatalogMode && requiredVoltage && voltage && requiredVoltage !== voltage) {
    isCompatible = false;
    reason = `Потрібен компонент на ${requiredVoltage}V`;
  }

  // Визначаємо текст кнопки залежно від режиму
  const buttonText = isCatalogMode ? 'Купити' : (isCompatible ? '+ У збірку' : 'Заблоковано');

  return (
    <div style={{
      background: '#fff', borderRadius: '16px', overflow: 'hidden',
      border: isCompatible ? '1px solid #e2e8f0' : '1px solid #fca5a5',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
      opacity: isCompatible ? 1 : 0.7,
      display: 'flex', flexDirection: 'column', height: '100%',
      filter: isCompatible ? 'none' : 'grayscale(30%)'
    }}>
      <div style={{ height: '180px', background: '#f8fafc', padding: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
        <img src={product.image_url} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
        {voltage && (
          <span style={{ position: 'absolute', top: '10px', left: '10px', background: isCompatible ? '#3b82f6' : '#94a3b8', color: 'white', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold' }}>
            ⚡ {voltage}V
          </span>
        )}
      </div>
      <div style={{ padding: '15px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#1e293b', fontSize: '1rem', lineHeight: '1.4' }}>{product.name}</h4>
        
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 'auto', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <span style={{ fontWeight: 'bold', color: '#334155', fontSize: '1.2rem' }}>{product.price} ₴</span>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={onDetailsClick} style={{ background: '#f8fafc', color: '#475569', border: '1px solid #cbd5e1', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Огляд</button>
              <button 
                disabled={!isCompatible} 
                onClick={() => actionHandler(product)} 
                style={{ 
                  background: isCompatible ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : '#e2e8f0', 
                  color: isCompatible ? '#fff' : '#94a3b8', 
                  border: 'none', padding: '8px 14px', borderRadius: '6px', fontWeight: 'bold', cursor: isCompatible ? 'pointer' : 'not-allowed'
                }}
              >
                {buttonText}
              </button>
            </div>
          </div>
          
          {!isCompatible && !isCatalogMode && (
            <span style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 'bold', textAlign: 'right' }}>
              ❌ {reason}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default function ProductCardFactory({ product, actionHandler, requiredVoltage, onDetailsClick, isCatalogMode }) {
  switch (product.type) {
    case 'ready_bike':
    case 'rental':
      return <ReadyBikeCard product={product} actionHandler={actionHandler} onDetailsClick={onDetailsClick} />;
    case 'component':
    case 'accessory':
      return <ComponentCard product={product} actionHandler={actionHandler} requiredVoltage={requiredVoltage} onDetailsClick={onDetailsClick} isCatalogMode={isCatalogMode} />;
    default:
      return null;
  }
}