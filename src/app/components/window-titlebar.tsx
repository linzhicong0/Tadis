'use client';

import SidebarCollapseButton from './sidebar-collapse-button';

export default function WindowTitleBar() {

    return (
        <div className="flex flex-row">
            <div data-tauri-drag-region
                className="z-10 h-8 w-full fixed inset-x-0 top-0 bg-white/50 dark:bg-zinc-800/50 flex gap-2 items-center px-2 select-none rounded-t-lg"
            >
                <div className="flex items-center align-middle pl-16 gap-2">
                    <SidebarCollapseButton />
                </div>
            </div>
        </div>

    );
}