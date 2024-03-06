import { useEffect, useState } from 'react';

export const isBrowser = () => typeof window !== 'undefined';

const useThemeDetector = () => {
  const getCurrentTheme = () =>
    isBrowser() && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [isDarkTheme, setIsDarkTheme] = useState(getCurrentTheme());

  const mqListener = (event: MediaQueryListEvent) => {
    setIsDarkTheme(event.matches);
  };

  useEffect(() => {
    if (!isBrowser()) return;
    const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)');
    darkThemeMq.addEventListener('change', mqListener);

    return () => darkThemeMq.removeEventListener('change', mqListener);
  }, []);

  return isDarkTheme;
};

export default useThemeDetector;
