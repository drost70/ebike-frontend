import { create } from 'zustand';

const extractVoltage = (text) => {
  if (!text) return null;
  const match = text.match(/(\d+)V/i);
  return match ? match[1] : null; 
};

const useStore = create((set, get) => ({
  currentBuild: [], 
  
  getRequiredVoltage: () => {
    const { currentBuild } = get();
    const itemWithVoltage = currentBuild.find(item => extractVoltage(item.name) || extractVoltage(item.description));
    return itemWithVoltage ? extractVoltage(itemWithVoltage.name) || extractVoltage(itemWithVoltage.description) : null;
  },

  addToBuild: (product) => {
    const { currentBuild, getRequiredVoltage } = get();
 
    if (currentBuild.find(item => item.category === product.category)) {
      alert(` Ви вже обрали деталь у категорії "${product.category}". Спочатку видаліть її у Кошику.`);
      return false;
    }

    const requiredVoltage = getRequiredVoltage();
    const productVoltage = extractVoltage(product.name) || extractVoltage(product.description);

    if (requiredVoltage && productVoltage && requiredVoltage !== productVoltage) {
      alert(` ПОМИЛКА СУМІСНОСТІ!\nВаша збірка розрахована на ${requiredVoltage}V, а цей товар — ${productVoltage}V.`);
      return false;
    }

    set({ currentBuild: [...currentBuild, product] });
    return true;
  },

  removeFromBuild: (productId) => set((state) => ({
    currentBuild: state.currentBuild.filter((item) => item.id !== productId)
  })),

  clearBuild: () => set({ currentBuild: [] }),

  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  setAuth: (user, token) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, token: null });
  }
}));

export default useStore;