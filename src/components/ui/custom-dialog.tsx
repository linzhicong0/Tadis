import React from 'react';
import CloseButton from '@/app/components/close-button';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  title: string;
}

export function CustomDialog({ isOpen, onClose, children, className = '', title }: DialogProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div 
          className={`bg-white dark:bg-dialog-default backdrop-blur-md rounded-lg p-4 max-w-md w-full mx-4 relative shadow-lg ${className}`}
          onClick={e => e.stopPropagation()}
        >
          <div className="absolute top-0 left-3">
            <CloseButton onClose={onClose} />
          </div>
          <div className="mt-3">
                <div className="text-gray-900 dark:text-white px-4 select-none">
                <h2 className="text-2xl font-normal mb-4">{title}</h2>
                {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 