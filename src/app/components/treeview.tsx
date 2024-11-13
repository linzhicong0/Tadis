import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { RedisTreeItem } from '@/types/redis';
import RedisItem from './redisitem';

interface TreeViewProps {
  item: RedisTreeItem;
  onDelete: (name: string) => void;
  selectedItemName: string;
  onItemSelect: (name: string) => void;
}

const TreeView: React.FC<TreeViewProps> = ({ item, onDelete, selectedItemName, onItemSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  if (!hasChildren && item.type) {
    return (
      <RedisItem
        type={item.type}
        name={item.name}
        onDelete={onDelete}
        onClick={() => onItemSelect(item.name)}
        isSelected={selectedItemName === item.name}
      />
    );
  }

  return (
    <div>
      <div
        className="flex items-center gap-1 hover:bg-gray-800 rounded-md p-1 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {hasChildren && (
          <span className="text-gray-400">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </span>
        )}
        <span className="text-gray-200 text-sm">{item.name}</span>
      </div>

      {isExpanded && hasChildren && (
        <div className="ml-4 flex flex-col gap-1 mt-1">
          {item.children!.map((child) => (
            <TreeView
              key={child.name}
              item={child}
              onDelete={onDelete}
              selectedItemName={selectedItemName}
              onItemSelect={onItemSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeView; 