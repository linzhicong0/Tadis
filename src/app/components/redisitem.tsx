import React from 'react';

type RedisItemType = 'string' | 'set' | 'hash' | 'list' | 'stream' | 'zset';

interface RedisItemProps {
  type: RedisItemType;
  name: string;
}

const RedisItem: React.FC<RedisItemProps> = ({ type, name }) => {
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
    <div className="flex items-center gap-2">
      <span className={`${getTypeColor(type)} text-white rounded-sm font-semibold uppercase text-[10px] w-14 h-5 flex items-center justify-center`}>
        {type}
      </span>
      <span className="text-gray-200 text-sm">
        {name}
      </span>
    </div>
  );
};

export default RedisItem; 