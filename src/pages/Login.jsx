import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const setAuth = useStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://ebike-api-server.onrender.com/api/auth/login', { email, password });
      setAuth(res.data.user, res.data.token); // Зберігаємо дані в стор
      alert('Вхід успішний!');
      navigate('/admin'); // Перенаправляємо в адмінку
    } catch (err) {
      alert(err.response?.data?.message || 'Помилка входу');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Вхід для адміністратора</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: '10px' }} />
        <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: '10px' }} />
        <button type="submit" style={{ padding: '10px', background: '#333', color: 'white', border: 'none', cursor: 'pointer' }}>Увійти</button>
      </form>
    </div>
  );
}