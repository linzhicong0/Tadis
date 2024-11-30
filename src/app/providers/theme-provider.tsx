'use client';

import { createContext, useEffect, useState } from 'react';

export const ThemeContext = createContext({
    isDarkMode: false,
    setIsDarkMode: (value: boolean) => { },
});

// Theme provider component that handles dark/light mode
// Uses system preferences by default and allows manual override
// Wraps children in context provider and applies theme classes
export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Set initial theme
        setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);

        // Watch for changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
            setIsDarkMode(e.matches);
        };

        mediaQuery.addEventListener('change', handleChange);

        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    return (
        <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
            <div className={`${isDarkMode ? 'dark' : 'light'} `}>
                <div className='bg-white/60 dark:bg-gray-950/70'>
                    {children}
                </div>
            </div>
        </ThemeContext.Provider>
    );
}