import { useState, useMemo } from 'react';
import useStore from '../store/useStore';

export const useConfiguratorLogic = (products) => {
  const [activeTab, setActiveTab] = useState('motor');
  const { currentBuild, addToBuild, getRequiredVoltage } = useStore();
  
  const requiredVoltage = getRequiredVoltage();

  const categories = [
    { id: 'motor', label: 'Двигуни' },
    { id: 'battery', label: 'Акумулятори' },
    { id: 'controller', label: 'Контролери' },
    { id: 'display', label: 'Дисплеї' }
  ];

  const filteredComponents = useMemo(() => {
    return products.filter(p => p.category === activeTab);
  }, [products, activeTab]);

  const readyBikes = useMemo(() => {
    return products.filter(p => p.type === 'ready_bike');
  }, [products]);

  // НОВА ЛОГІКА: Перевірка сумісності з генерацією тексту помилки
  const checkCompatibility = (product) => {
    // 1. Якщо така категорія вже є в кошику
    const hasSameCategory = currentBuild.some(item => item.category === product.category);
    if (hasSameCategory) {
      return { isValid: false, reason: 'Деталь цієї категорії вже у збірці' };
    }

    // 2. Перевірка вольтажу (якщо в збірці вже є задана напруга)
    if (requiredVoltage) {
      // Шукаємо вольтаж (якщо в базі є поле voltage, або витягуємо з назви "Мотор 48V")
      const productVoltage = product.voltage || (product.name.match(/(\d+)V/)?.[1]);
      
      if (productVoltage && parseInt(productVoltage) !== parseInt(requiredVoltage)) {
        return { 
          isValid: false, 
          reason: `Потрібен компонент на ${requiredVoltage}V` 
        };
      }
    }

    return { isValid: true, reason: '' };
  };

  const handleNextStep = (product, navigate) => {
    const { isValid, reason } = checkCompatibility(product);
    
    // Блокуємо додавання, якщо не підходить
    if (!isValid) {
      alert(`❌ ${reason}`);
      return;
    }

    const isSuccess = addToBuild(product);
    if (isSuccess) {
      const currentIndex = categories.findIndex(c => c.id === activeTab);
      if (currentIndex < categories.length - 1) {
        setActiveTab(categories[currentIndex + 1].id);
      } else {
        const goToCart = window.confirm("🎉 Збірка завершена! Перейти до оформлення?");
        if (goToCart) navigate('/configurator');
      }
    }
  };

  return {
    activeTab,
    setActiveTab,
    categories,
    readyBikes,
    filteredComponents,
    requiredVoltage,
    currentBuild,
    handleNextStep,
    checkCompatibility // Передаємо цю функцію у компоненти!
  };
};