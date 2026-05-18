import { useNavigate } from 'react-router-dom';

export default function CartModal({ product, onClose }) {
  const navigate = useNavigate();
  if (!product) return null;

  return (
    <div style={{ 
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
      background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)',
      zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' 
    }}>
      <div style={{ 
        background: 'white', padding: '30px', borderRadius: '24px', 
        maxWidth: '420px', width: '100%', textAlign: 'center', 
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' 
      }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '10px' }}>✅</div>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '1.6rem', color: '#0f172a', fontWeight: '900' }}>Успішно додано!</h3>
        <p style={{ color: '#64748b', marginBottom: '25px', lineHeight: '1.5', fontSize: '1.05rem' }}>
          <strong>{product.name}</strong> тепер знаходиться у вашому кошику.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '14px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
            Продовжити
          </button>
          <button onClick={() => navigate('/configurator')} style={{ flex: 1, padding: '14px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' }}>
            Перейти в кошик
          </button>
        </div>
      </div>
    </div>
  );
}