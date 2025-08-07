'use client';

import { useState, ReactElement, useRef, useEffect } from 'react';

interface TabContentProps {
    id: string;
    label: string;
    children: React.ReactNode;
}

interface TabsProps {
    children: ReactElement<TabContentProps>[];
    className?: string;
}

const Tabs = ({ children, className }: TabsProps) => {
    const [activeTab, setActiveTab] = useState(children[0].props.id);
    const [underlineStyle, setUnderlineStyle] = useState({ width: 0, left: 0 });
    const tabRefs = useRef<HTMLButtonElement[]>([]);

    useEffect(() => {
        // 初始化下划线位置
        const activeTabIndex = children.findIndex((child) => child.props.id === activeTab);
        const activeTabRef = tabRefs.current[activeTabIndex];
        if (activeTabRef) {
            setUnderlineStyle({
                width: activeTabRef.offsetWidth,
                left: activeTabRef.offsetLeft,
            });
        }
    }, [activeTab, children]);

    const handleTabClick = (id: string, index: number) => {
        setActiveTab(id);
        const activeTabRef = tabRefs.current[index];
        if (activeTabRef) {
            setUnderlineStyle({
                width: activeTabRef.offsetWidth,
                left: activeTabRef.offsetLeft,
            });
        }
    };

    return (
        <div className={`${className} h-full flex flex-col`}>
            {/* Tab 按钮 */}
            <div className="flex relative py-2">
                {children.map((child, index) => {
                    const isActive = activeTab === child.props.id;
                    return (
                        <button
                            key={child.props.id}
                            ref={(el) => {
                                if (el) tabRefs.current[index] = el;
                            }}
                            className={`px-6 text-base font-semibold transition-all duration-300 ${isActive ? 'text-blue-500' : 'text-stone-200 hover:text-stone-50 font-semibold'
                                }`}
                            onClick={() => handleTabClick(child.props.id, index)}
                        >
                            {child.props.id}
                        </button>
                    );
                })}
                {/* 下划线 */}
                <div
                    className="absolute bottom-0 h-0.5 bg-blue-500 transition-all duration-300"
                    style={{
                        width: underlineStyle.width,
                        left: underlineStyle.left,
                    }}
                />
            </div>

            {/* Tab 内容 */}
            {/* <div className="h-full bg-red-500"> */}
                {children.map((child) => (
                    <div
                        key={child.props.id}
                        className={`${activeTab === child.props.id ? '' : 'hidden'} h-full overflow-y-auto`}
                    >
                        {child}
                    </div>
                ))}
            {/* </div> */}
        </div>
    );
};

export default Tabs;