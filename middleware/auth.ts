export default defineNuxtRouteMiddleware(async (to, from) => {
    if (process.server) return;

    const { $auth } = useNuxtApp();

    // Wait for auth state to resolve (simple check)
    // In a real app you might want a more robust auth state listener or a store
    const user = await new Promise((resolve) => {
        const unsubscribe = $auth.onAuthStateChanged((user) => {
            unsubscribe();
            resolve(user);
        });
    });

    if (!user && to.path !== '/') {
        return navigateTo('/');
    }
});
