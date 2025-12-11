
import { useState } from '#app'
import ru from '../locales/ru'
import en from '../locales/en'
import kk from '../locales/kk'
import zh from '../locales/zh'

const messages: any = { ru, en, kk, zh }

export const useI18n = () => {
    // Shared state for locale
    const locale = useState<string>('app-locale', () => 'ru')

    const t = (path: string) => {
        if (!path) return ''
        const keys = path.split('.')
        let loc = locale.value
        let current = messages[loc]

        if (!current) {
            console.warn(`[I18n] Locale ${loc} not found.`)
            current = messages['ru']
        }

        if (current && current.default) current = current.default

        let fallback = messages['ru']
        if (fallback && fallback.default) fallback = fallback.default

        let res = current
        let fb = fallback

        for (const key of keys) {
            res = (res && res[key] !== undefined) ? res[key] : undefined
            fb = (fb && fb[key] !== undefined) ? fb[key] : undefined
        }

        return res || fb || path
    }

    const setLocale = (newLocale: string) => {
        if (messages[newLocale]) {
            console.log(`[I18n] Switching to ${newLocale}`)
            locale.value = newLocale
            if (typeof window !== 'undefined') {
                localStorage.setItem('user-locale', newLocale)
            }
        }
    }

    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('user-locale')
        if (saved && messages[saved] && saved !== locale.value) {
            locale.value = saved
        }
    }

    return {
        t,
        locale,
        setLocale
    }
}
