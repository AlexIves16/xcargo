import { navigateTo } from '#app';

export default defineNuxtRouteMiddleware(async (to, from) => {
    if (process.server) return;

    const { $auth } = useNuxtApp();
    if (!$auth) return; // UI-only mode

    // Проверяем текущего пользователя
    const currentUser = $auth.currentUser;

    // Если пользователь уже авторизован и пытается попасть на главную страницу, перенаправляем его в кабинет
    if (currentUser && to.path === '/') {
        const isAdmin = currentUser.email === 'kairfakomylife@gmail.com';
        console.log('User already authenticated, redirecting to', isAdmin ? '/admin' : '/dashboard');
        return navigateTo(isAdmin ? '/admin' : '/dashboard');
    }

    // Wait for auth state to resolve (simple check)
    // In a real app you might want a more robust auth state listener or a store
    const user = await new Promise((resolve) => {
        // Проверяем текущего пользователя сразу
        if ($auth.currentUser) {
            resolve($auth.currentUser);
            return;
        }

        // Если текущий пользователь не определен, ждем обновления состояния
        const unsubscribe = $auth.onAuthStateChanged((user) => {
            unsubscribe();
            resolve(user);
        });

        // Таймаут на случай, если событие не произойдет
        setTimeout(() => {
            resolve($auth.currentUser);
        }, 1000);
    });

    if (!user && to.path !== '/') {
        // Пользователь не авторизован и пытается попасть на защищенную страницу
        console.log('User not authenticated, redirecting to home page');
        return navigateTo('/');
    }

    // Если пользователь авторизован, позволяем ему продолжить
    if (user) {
        console.log('User authenticated, allowing access to', to.path);

        // Дополнительно проверяем, если пользователь авторизован и пытается попасть на главную
        if (to.path === '/') {
            const isAdmin = (user as any).email === 'kairfakomylife@gmail.com';
            console.log('Redirecting authenticated user to', isAdmin ? '/admin' : '/dashboard');
            return navigateTo(isAdmin ? '/admin' : '/dashboard');
        }
    }
});
