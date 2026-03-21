import { ui, defaultLang } from './ui'

export type Lang = keyof typeof ui

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/')
  if (lang in ui) return lang as keyof typeof ui
  return defaultLang
}

export function useTranslations(lang: Lang = defaultLang) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key]
  }
}
