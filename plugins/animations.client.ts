export default defineNuxtPlugin(() => {
  // Logic runs only on client due to .client.ts extension
  const selector = '.auth-button, .login-button, .nav-link, .search-button, .auth-btn, .action-btn';

  document.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest(selector);
    if (target) {
      const button = target as HTMLElement;

      // Animation Logic
      const rect = button.getBoundingClientRect();
      const x = (e as MouseEvent).clientX - rect.left;
      const y = (e as MouseEvent).clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      button.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    }
  });
});