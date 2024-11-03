'use client';
import CloseButton from './close-button';
import MinButton from './min-button';
import MaxButton from './max-button';
import SidebarCollapseButton from './sidebar-collapse-button';
export default function WindowTitleBar({ children }: { children: React.ReactNode }) {

    return (
        <div className="flex flex-row">
            <div data-tauri-drag-region
                className="z-10 h-8 w-full absolute inset-x-0 top-0 bg-zinc-800 flex gap-2 items-center px-2 select-none rounded-t-lg"
            >
                <div className="flex gap-2 py-3 ">
                    <CloseButton />
                    <MinButton />
                    <MaxButton />
                </div>
                <div className="flex items-center align-middle py-3">
                    <SidebarCollapseButton />
                </div>
            </div>
            {children}
        </div>

    );
}