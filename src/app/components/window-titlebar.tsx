'use client';
import { Window } from '@tauri-apps/api/window'
export default function WindowTitleBar({ children }: { children: React.ReactNode }) {
    const handleMinimize = () => Window.getCurrent().minimize();
    const handleMaximize = () => Window.getCurrent().toggleMaximize();
    const handleClose = () => Window.getCurrent().close();
  
    return (
    <div className="flex flex-row">
      <div data-tauri-drag-region
        className="z-10 h-8 w-full absolute inset-x-0 top-0 bg-gray-800 flex justify-between items-center px-2 select-none"
      >
        <div className="flex gap-2">
          <button 
            onClick={handleMinimize}
            className="text-white px-3 py-1 hover:bg-gray-700 transition-colors"
          >
            a
          </button>
          <button 
            onClick={handleMaximize}
            className="text-white px-3 py-1 hover:bg-gray-700 transition-colors"
          >
            b
          </button>
          <button 
            onClick={handleClose}
            className="text-white px-3 py-1 hover:bg-red-600 transition-colors"
          >
            c
          </button>
        </div>
      </div>
      {children}
    </div> 

    );
}