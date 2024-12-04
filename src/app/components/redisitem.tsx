import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import React from 'react';

type RedisItemType = 'string' | 'set' | 'hash' | 'list' | 'stream' | 'zset';

interface RedisItemProps {
  type: RedisItemType;
  label: string;
  onDelete?: (name: string) => void;
  onClick?: (name: string) => void;
  isSelected?: boolean;
}

const RedisItem: React.FC<RedisItemProps> = ({ type, label, onDelete, onClick, isSelected }) => {
  const getTypeColor = (type: RedisItemType) => {
    const colors = {
      string: 'bg-green-500',
      set: 'bg-blue-500',
      hash: 'bg-purple-600',
      list: 'bg-orange-400',
      stream: 'bg-red-500',
      zset: 'bg-purple-500'
    };
    return colors[type];
  };

  return (
    <div
      className={`flex items-center justify-between gap-2 ${isSelected ? 'bg-gray-200 dark:bg-gray-700' : ' hover:bg-gray-200 dark:hover:bg-gray-700'
        } rounded-md p-1 hover:cursor-pointer`}
      onClick={() => onClick?.(label)}
    >
      <div className="flex items-center gap-2">
        <span className={`${getTypeColor(type)} text-white rounded-sm font-semibold uppercase text-[10px] w-14 h-5 flex items-center justify-center`}>
          {type}
        </span>
        <span className="text-gray-800 dark:text-gray-200 text-sm">
          {label}
        </span>
      </div>
      {onDelete && (
        <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-700 dark:text-gray-300 dark:hover:text-red-500 hover:text-red-500 p-1"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(label);
          }}>
          <Trash2 strokeWidth={1.5} className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default RedisItem; 