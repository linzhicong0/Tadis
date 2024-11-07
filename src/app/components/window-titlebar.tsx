'use client';

import SidebarCollapseButton from './sidebar-collapse-button';
import { Moon, Sun } from 'lucide-react';
import { useState } from 'react';

export default function WindowTitleBar() {


    const [theme, setTheme] = useState('light');

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.classList.toggle('dark');
    };

    return (
        <div className="flex flex-row">
            <div data-tauri-drag-region
                className="z-10 h-8 w-full fixed inset-x-0 top-0 bg-zinc-800 flex gap-2 items-center px-2 select-none rounded-t-lg"
            >
                <div className="flex items-center align-middle pl-16 gap-2">
                    <SidebarCollapseButton />
                    <button
                        onClick={toggleTheme}
                        className="text-gray-300 hover:text-white"
                    >
                        {theme === 'light' ? (
                            <Moon className='w-[18px] h-[18px]'/>
                        ) : (
                            <Sun className='w-[18px] h-[18px]'/>
                        )}
                    </button>
                </div>
            </div>
        </div>

    );
}