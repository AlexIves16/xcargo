export default defineNuxtPlugin(() => {
  if (process.client) {
    // Анимации для кнопок
    const animateButton = (e: Event) => {
      const button = e.target as HTMLElement;
      const rect = button.getBoundingClientRect();
      const x = (e as MouseEvent).clientX - rect.left;
      const y = (e as MouseEvent).clientY - rect.top;
      
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      
      button.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    };
    
    // Добавляем обработчики для кнопок
    const addRippleEffect = () => {
      // Удаляем существующие обработчики чтобы избежать дублирования
      const buttons = document.querySelectorAll('.auth-button, .login-button, .nav-link, .search-button');
      buttons.forEach(button => {
        button.removeEventListener('click', animateButton);
        button.addEventListener('click', animateButton);
      });
    };
    
    // Инициализация после загрузки страницы
    setTimeout(() => {
      addRippleEffect();
    }, 100);
    
    // Переинициализация при переходах между страницами
    const handleNavigation = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest('a')) {
        setTimeout(() => {
          addRippleEffect();
        }, 100);
      }
    };
    
    // Используем делегирование событий для лучшей производительности
    document.removeEventListener('click', handleNavigation);
    document.addEventListener('click', handleNavigation);
  }
});