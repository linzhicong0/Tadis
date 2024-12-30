import { ReactNode } from 'react';

interface TabContentProps {
    id: string;
    children: ReactNode;
    className?: string;
}

const TabContent = ({ id, children, className }: TabContentProps) => {
    return (
        <div id={id} className={`${className} overflow-y-auto`}>
            {children}
        </div>
    );
};

export default TabContent;