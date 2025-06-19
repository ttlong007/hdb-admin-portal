/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, createContext, useContext } from 'react'
interface ThemeContextType {
  theme: string
  setTheme: (theme: string) => void
}
const ThemeProviderContext = createContext<ThemeContextType | undefined>(
  undefined
)
export function ThemeProvider({
  children,
  defaultTheme,
}: React.PropsWithChildren<{
  defaultTheme: string;
}>) {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || defaultTheme)

  useEffect(() => {
    localStorage.setItem('vite-ui-theme', theme)
    document.documentElement.className = theme
  }, [theme])
  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  )
}
export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (!context) throw new Error('useTheme must be used within a ThemeProvider')
  return context
}
