import { Trash2 } from 'lucide-react';
import React from 'react';

type RedisItemType = 'string' | 'set' | 'hash' | 'list' | 'stream' | 'zset';

interface RedisItemProps {
  type: RedisItemType;
  name: string;
  onDelete?: (name: string) => void;
}

const RedisItem: React.FC<RedisItemProps> = ({ type, name, onDelete }) => {
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
    <div className="flex items-center justify-between gap-2 hover:bg-gray-800 rounded-md p-1 hover:cursor-pointer">
      <div className="flex items-center gap-2">
        <span className={`${getTypeColor(type)} text-white rounded-sm font-semibold uppercase text-[10px] w-14 h-5 flex items-center justify-center`}>
          {type}
        </span>
        <span className="text-gray-200 text-sm">
          {name}
        </span>
      </div>
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(name);
          }}
          className="text-gray-400 hover:text-red-500 p-1"
        >
          <Trash2 strokeWidth={1.5} className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default RedisItem; 