import { ref } from 'vue'

export type Theme = 'light' | 'dark'

const storageKey = 'rednexus_theme'

function systemTheme(): Theme {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function savedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(storageKey)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    return null
  }
}

// Compartido entre componentes: el tema es uno solo para toda la app
const theme = ref<Theme>(savedTheme() ?? systemTheme())

function apply(value: Theme) {
  document.documentElement.dataset.theme = value
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', value === 'dark' ? '#0a0f1e' : '#f5f6fa')
}

/** Tema claro u oscuro. Por defecto sigue al sistema; al cambiarlo se recuerda en este navegador. */
export function useTheme() {
  function toggle() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    apply(theme.value)
    try {
      localStorage.setItem(storageKey, theme.value)
    } catch {
      // sin almacenamiento (modo privado): el cambio dura hasta recargar
    }
  }

  return { theme, toggle }
}
